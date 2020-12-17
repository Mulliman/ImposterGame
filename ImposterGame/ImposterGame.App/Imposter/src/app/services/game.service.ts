import { Injectable } from '@angular/core';
import { GameStates } from '../model/GameStates';
import { OptionGridModel } from './option-grid.service';
import { IPlayer, GameApiService, IGame, JoinGameModel, RoundApiService, AddAnswerModel, AccusationModel } from 'src/server';
import { UiService } from './ui.service';
import * as signalR from "@aspnet/signalr";
import { AppPagesService } from './app-pages.service';
import { GameFactory, Game } from '../model/Game';
import { GameContext } from './gamecontext.service';
import { GamePersister } from './gamepersister.service';
import { Subscription } from 'rxjs';

//#region Move these models somewhen

export class GameModel {
  state: string;
  gameCode: string;
  isHost: boolean;
  currentRound: Round;
}

export interface Round {
  readonly id?: string;
  readonly word?: string;
  impostersGuess?: string;
  readonly isGuessCorrect?: boolean;
  readonly allOptions?: Array<string>;
  readonly allAnswered?: boolean;
  readonly allAccused?: boolean;
  isComplete?: boolean;
  imposter: Participant;
}

export interface Participant {
  player: IPlayer;
}

//#endregion

@Injectable({
  providedIn: 'root'
})
export class GameService {
  protected subscriptions = new Subscription();
  protected hasSubscribedToGameEvents: boolean;
  
  constructor(private gameApi: GameApiService,
    private roundApi: RoundApiService,
    private uiService: UiService,
    private appPages: AppPagesService,
    private gameContext: GameContext,
    private gamePersister: GamePersister) {
  }

  async getCurrentGameContext(player: IPlayer): Promise<GameContext> {
    if(!player){
      this.gamePersister.clearSavedGame();
      return null;
    }

    if (this.gameContext.isGameInitialised) {
      return this.gameContext;
    }

    //await this.delay(3000)
    var game = await this.getCurrentGame(player);

    if (!game) {
      // If no game present, return an empty non-started gameContext.
      return this.gameContext;
    }

    await this.gameContext.initialiseGame(game);
    this.subscribeToGameEvents();

    return this.gameContext;
  }

  //#region Joining and Hosting

  async hostGame(player: IPlayer): Promise<GameContext> {
    try {
      var serverGame = await this.gameApi.apiGameApiHostPost(player.id).toPromise();
      var game = GameFactory.fromServerGame(serverGame, player);

      await this.gameContext.initialiseGame(game);
      this.subscribeToGameEvents();

      return this.gameContext;
    } catch (e) {
      console.error("Host Game Error", e);
      this.uiService.errorToast("The was an error starting your game.", "Please check your connection and try again.");
      throw e;
    }
  }

  async joinGame(player: IPlayer, gameCode: string): Promise<GameContext> {
    try {
      var joinModel: JoinGameModel = {
        gameCode: gameCode,
        playerId: player.id
      }

      var serverGame = await this.gameApi.apiGameApiJoinPost(joinModel).toPromise();
      var game = GameFactory.fromServerGame(serverGame, player);

      await this.gameContext.initialiseGame(game);
      this.subscribeToGameEvents();

      return this.gameContext;
    } catch (e) {

      console.error("Join Game Error", e);

      if(e.status == 409){
        this.uiService.errorToast("Player with same name already exists in this game.", "Please change your name by clicking the 'Not you' button bottom right.");
      }else{
        this.uiService.errorToast("The was an error joining this game.", "Please check your code is correct and your connection and try again.");
      }

      throw e;
    }
  }

  subscribeToGameEvents(){
    var self = this;

    if(this.hasSubscribedToGameEvents){
      return;
    }

    // When a round starts, move every user to the current round page. 
    
    this.subscriptions.add(this.gameContext.onConnectionLost.subscribe(() => {
      this.uiService.alert("Your connection has been lost.", "Please reload the page.", () => this.appPages.reloadPage())
    }));

    this.subscriptions.add(this.gameContext.onRoundStarted.subscribe(() => {console.log("onRoundStarted"); this.appPages.goToCurrentRoundPage()}));
    this.subscriptions.add(this.gameContext.onAllAnswered.subscribe(() => this.appPages.goToChooseImposterPage()));
    this.subscriptions.add(this.gameContext.onAllAccused.subscribe(() => this.appPages.goToImposterGuessPage()));
    this.subscriptions.add(this.gameContext.onRoundComplete.subscribe(() => this.appPages.goToRoundScoresPage()));
    this.subscriptions.add(this.gameContext.onRoundCancelled.subscribe(() => this.appPages.goToNewRoundPage()));
    this.subscriptions.add(this.gameContext.onGameCancelled.subscribe(async () => {
      await this.gameContext.endGame();
      this.appPages.reloadApp();
    }));

    this.subscriptions.add(this.gameContext.onKicked.subscribe(async () => {
      await this.uiService.warningToast("You have been kicked from the game!");

      setTimeout(async () => {
        await this.gameContext.endGame();
        this.appPages.reloadApp();
      }, 2000);
    }));

    this.hasSubscribedToGameEvents = true;
  }

  // unsubscribeToGameEvents(){
  //   // When a round starts, move every user to the current round page. 
  //   this.gameContext.onRoundStarted.unsubscribe();
  // }

  //#endregion

  //#region Round creation and answering stage

  async startNewRound(player: IPlayer, grid: OptionGridModel): Promise<Game> {
    let currentGameContext = await this.getCurrentGameContext(player);

    if (currentGameContext == null) {
      throw "No game in progress";
    }

    try {
      var serverGame = await this.roundApi.apiRoundApiNewRoundPost(currentGameContext.currentGame.id, grid.id).toPromise();

      await this.gameContext.updateGameFromServer(serverGame);

      return currentGameContext.currentGame;
    }
    catch (e) {
      console.log(e);
      this.uiService.errorToast("There was an error starting a new round.", "Please try again, and if you still have issues, try reloading the page.");
      throw "Error starting new round.";
    }
  }

  async submitAnswer(player: IPlayer, answer: string): Promise<IGame> {
    let currentGameContext = await this.getCurrentGameContext(player);

    if (currentGameContext == null) {
      throw "No game in progress";
    }

    try {
      var model = {
        gameId: currentGameContext.currentGame.id,
        playerId: player.id,
        word: answer
      } as AddAnswerModel;

      var serverGame = await this.roundApi.apiRoundApiAddAnswerPost(model).toPromise();
      await this.gameContext.updateGameFromServer(serverGame);

      return currentGameContext.currentGame;
    }
    catch (e) {
      console.log(e);
      this.uiService.errorToast("There was an error submitting your answer.", "Please try again, and if you still have issues, try reloading the page.");
      throw "Error submitting answer.";
    }
  }

  //#endregion

  //#region Accusing Stage

  async submitAccusation(player: IPlayer, accusedPlayerId: string, wager: number): Promise<IGame> {

    if(!accusedPlayerId){
      this.uiService.errorToast("You still need to accuse a player.");
      return;
    }

    if(!wager){
      this.uiService.errorToast("You still need to make a wager.", "The more you wager, the point points you can gain. If you guess incorrectly, the imposter will get these points.");
      return;
    }
    
    let currentGameContext = await this.getCurrentGameContext(player);

    if (currentGameContext == null) {
      throw "No game in progress";
    }

    try {
      var model = {
        gameId: currentGameContext.currentGame.id,
        playerId: player.id,
        accusedPlayerId: accusedPlayerId,
        wager: wager
      } as AccusationModel;

      var serverGame = await this.roundApi.apiRoundApiMakeAccusationPost(model).toPromise();
      await this.gameContext.updateGameFromServer(serverGame);

      return currentGameContext.currentGame;
    }
    catch (e) {
      console.log(e);
      this.uiService.errorToast("There was an error submitting your accusation.", "Please try again, and if you still have issues, try reloading the page.");
      throw "Error submitting accusation.";
    }
  }

  async submitImposterGuessAndScoreRound(player: IPlayer, answer: string): Promise<IGame> {

    if(!answer){
      this.uiService.errorToast("You still need to choose the word.");
      return;
    }
    
    let currentGameContext = await this.getCurrentGameContext(player);

    if (currentGameContext == null) {
      throw "No game in progress";
    }

    try {
      var serverGame = await this.roundApi.apiRoundApiScoreRoundPost(currentGameContext.currentGame.id, answer).toPromise();
      await this.gameContext.updateGameFromServer(serverGame);

      return currentGameContext.currentGame;
    }
    catch (e) {
      console.log(e);
      this.uiService.errorToast("There was an error submitting your imposter guess.", "Please try again, and if you still have issues, try reloading the page.");
      throw "There was an error submitting your imposter guess.";
    }
  }

  //#endregion 

  //#region Leaving and Cancelling

  async cancelRound(gameId: string): Promise<void> {
    try {
      await this.gameApi.apiGameApiCancelCurrentRoundDelete(gameId).toPromise();
    } catch (e) {
      console.error("Cancel Game Error", e);
      throw e;
    }
  }

  async leaveGame(player: IPlayer, gameCode: string): Promise<void> {
    try {
      var leaveModel = {
        gameCode: gameCode,
        playerId: player.id
      } as JoinGameModel;

      await this.gameApi.apiGameApiLeavePost(leaveModel).toPromise();

      this.gameContext.endGame();
    } catch (e) {
      console.error("Leave Game Error", e);


      throw e;
    }
  }

  async kickPlayer(player: IPlayer, gameCode: string): Promise<void> {
    try {
      var leaveModel = {
        gameCode: gameCode,
        playerId: player.id,
        wasKicked: true
      } as JoinGameModel;

      await this.gameApi.apiGameApiLeavePost(leaveModel).toPromise();
    } catch (e) {
      console.error("Kick Error", e);
      throw e;
    }
  }

  //#endregion

  private async getCurrentGame(player: IPlayer): Promise<Game> {
    var game = this.gamePersister.getCurrentGame();

    if (!game) {
      return null;
    }

    var serverGame = await this.gameApi.apiGameApiGetGameGet(game.id).toPromise();

    if (!serverGame) {
      this.gamePersister.clearSavedGame();
      return null;
    }

    var game = GameFactory.fromServerGame(serverGame, game.currentPlayer);

    return game;
  }

  async ngOnDestroy () {
    this.subscriptions.unsubscribe();
   }

   // For testing
   delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }
}