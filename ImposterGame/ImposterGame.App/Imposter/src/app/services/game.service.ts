import { Injectable } from '@angular/core';
import { GameStates } from '../model/GameStates';
import { OptionGridModel } from './option-grid.service';
import { IPlayer, GameApiService, IGame, JoinGameModel, RoundApiService, AddAnswerModel } from 'src/server';
import { UiService } from './ui.service';
import * as signalR from "@aspnet/signalr";
import { AppPagesService } from './app-pages.service';
import { GameFactory, Game } from '../model/Game';
import { GameContext } from './gamecontext.service';
import { GamePersister } from './gamepersister.service';

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

  public readonly gamePersister: GamePersister;

  // public get hasJoinedGame(): boolean { return !!this.currentGame; }
  // currentGame: Game;

  constructor(private gameApi: GameApiService,
    private roundApi: RoundApiService,
    private uiService: UiService,
    private appPages: AppPagesService,
    private gameContext: GameContext) {

    this.gamePersister = new GamePersister();
  }

  async getCurrentGameContext(player: IPlayer): Promise<GameContext> {
    if (this.gameContext) {
      return this.gameContext;
    }

    var game = await this.getCurrentGame(player);

    if (!game) {
      return this.gameContext;
    }

    await this.gameContext.start(game);

    return this.gameContext;
  }

  //#region Joining and Hosting

  async hostGame(player: IPlayer): Promise<GameContext> {
    try {
      var serverGame = await this.gameApi.apiGameApiHostPost(player.id).toPromise();
      var game = GameFactory.fromServerGame(serverGame, player);

      await this.gameContext.start(game);
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

      await this.gameContext.start(game);
      this.subscribeToGameEvents();

      return this.gameContext;
    } catch (e) {
      console.error("Host Game Error", e);
      this.uiService.errorToast("The was an error joining this game.", "Please check your code is correct and your connection and try again.");
      throw e;
    }
  }

  subscribeToGameEvents(){
    // When a round starts, move every user to the current round page. 
    this.gameContext.onRoundStarted.subscribe(() => this.appPages.goToCurrentRoundPage());
  }

  //#endregion

  //#region Round creation and answering stage

  async startNewRound(player: IPlayer, grid: OptionGridModel): Promise<Game> {
    let currentGameContext = await this.getCurrentGameContext(player);

    if (currentGameContext == null) {
      throw "No game in progress";
    }

    try {
      console.log("startNewRound - posting new round");

      var serverGame = await this.roundApi.apiRoundApiNewRoundPost(currentGameContext.currentGame.id, grid.id).toPromise();
      console.log("startNewRound - new round started", serverGame);

      currentGameContext.currentGame = await this.gameContext.updateGameFromServer(serverGame);
      console.log("startNewRound - current game updated", currentGameContext.currentGame);

      return currentGameContext.currentGame;
    }
    catch (e) {
      console.log(e);
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
      currentGameContext.currentGame = await this.gameContext.updateGameFromServer(serverGame);

      return currentGameContext.currentGame;
    }
    catch (e) {
      console.log(e);
      throw "Error starting new round.";
    }
  }

  //#endregion

  //#region Leaving

  async leaveGame(player: IPlayer, gameCode: string): Promise<void> {
    // try {
    //   // TODO: Call APIs

    //   this.clearSavedGame();
    // } catch (e) {
    //   console.error("Leave Game Error", e);
    //   throw e;
    // }
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
}