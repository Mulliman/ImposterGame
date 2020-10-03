import { Injectable, EventEmitter } from '@angular/core';
import { GameStates } from '../model/GameStates';
import { OptionGridModel } from './option-grid.service';
import { IPlayer, GameApiService, IGame, JoinGameModel } from 'src/server';
import { UiService } from './ui.service';
import * as signalR from "@aspnet/signalr";
import { AppPagesService } from './app-pages.service';
import { GameFactory, Game } from '../model/Game';
import { environment } from 'src/environments/environment';

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

export class GameContext {

  public onPlayersChanged = new EventEmitter<Game>();

  currentGame: Game;
  private hubConnection: signalR.HubConnection;
  private isConnectionActive: boolean = false;
  private callback: (game: Game) => void;

  constructor(private uiService: UiService,
     private appPages: AppPagesService,
     private gamePersister: GamePersister) {
  }

  async start(game: Game, onUpdatedCallback: (game: Game) => void) {
    if (!this.isConnectionActive) {
      this.currentGame = game;

      this.gamePersister.setCurrentGame(game);

      this.callback = onUpdatedCallback;
      await this.startConnection(game.id);
    }
  }

  async disconnect() {
    if (this.isConnectionActive && this.hubConnection) {
      await this.hubConnection.stop();
    }
  }

  async updateGameFromServer(serverGame: IGame){
    var game = GameFactory.fromServerGame(serverGame, this.currentGame.currentPlayer);

    this.updateGame(game);
  }

  async updateGame(game: Game){
    this.currentGame = game;

    this.gamePersister.setCurrentGame(game);
  }

  private async startConnection(gameId: string) {
    if (this.isConnectionActive) {
      console.log("startConnection - already active");
      return;
    }

    this.isConnectionActive = true;

    try {
      this.hubConnection = new signalR.HubConnectionBuilder()
        .withUrl(environment.apiBaseUrl + "/hubs/gamehub")
        .build();

      await this.hubConnection
        .start()
        .then(() => console.log('Connection started'))
        .catch(err => console.log('Error while starting connection: ' + err))

      await this.delay(100);

    } catch (e) {
      console.error("Error connecting", e);
      this.isConnectionActive = false;
    }

    try {
       await this.hubConnection.invoke("AddToGroup", gameId);
    } catch (e) {
      console.error("Error joining group", e);
      this.isConnectionActive = false;
    }

    // Add listeners here.
     this.addOnNewPlayerListener();
  }

  public addOnNewPlayerListener = () => {
    console.log("addOnNewPlayerListener");

    this.hubConnection.on('NewPlayer', (data) => {
      console.log("addOnNewPlayerListener - NewPlayer", data);
      this.currentGame = GameFactory.fromServerGame(data, this.currentGame.currentPlayer);

      this.onPlayersChanged.emit(this.currentGame);
      this.callback(this.currentGame);
    });
  }

  async delay(ms: number) {
    await new Promise(resolve => setTimeout(() => resolve(), ms));
  }
}

export class GamePersister{
  readonly GameKey: string = "imposter.game";

  getCurrentGame(){
    let game = JSON.parse(localStorage.getItem(this.GameKey)) as Game;

    if(!game){
      this.clearSavedGame();
      return null;
    }

    return game;
  }

  setCurrentGame(game: Game) {
    localStorage.setItem(this.GameKey, JSON.stringify(game));
  }

  clearSavedGame() {
    localStorage.removeItem(this.GameKey);
  }
}

@Injectable({
  providedIn: 'root'
})
export class GameService {

  public readonly gameContext: GameContext;
  public readonly gamePersister: GamePersister;

  // public get hasJoinedGame(): boolean { return !!this.currentGame; }
  // currentGame: Game;

  constructor(private gameApi: GameApiService,
     private uiService: UiService,
      private appPages: AppPagesService) {

    this.gamePersister = new GamePersister();
  }

  async getCurrentGameContext(player: IPlayer) : Promise<GameContext>{
    if(this.gameContext){
      return this.gameContext;
    }

    var game = await this.getCurrentGame(player);

    if(!game){
      return null;
    }

    return this.createNewContext(game);
  }

  async createNewContext(game: Game){
    var gameContext = new GameContext(this.uiService, this.appPages, new GamePersister());
    gameContext.start(game, (g) => console.log(g));
    
    return gameContext;
  }

  async hostGame(player: IPlayer): Promise<GameContext> {
    try {
      var serverGame = await this.gameApi.apiGameApiHostPost(player.id).toPromise();
      var game = GameFactory.fromServerGame(serverGame, player);

      return this.createNewContext(game);
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

      return this.createNewContext(game);
    } catch (e) {
      console.error("Host Game Error", e);
      this.uiService.errorToast("The was an error joining this game.", "Please check your code is correct and your connection and try again.");
      throw e;
    }
  }

  private async getCurrentGame(player: IPlayer): Promise<Game> {
    // if (this.currentGame) {
    //   return this.currentGame;
    // }

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

  async leaveGame(player: IPlayer, gameCode: string): Promise<void> {
    // try {
    //   // TODO: Call APIs

    //   this.clearSavedGame();
    // } catch (e) {
    //   console.error("Leave Game Error", e);
    //   throw e;
    // }
  }

  async startNewRound(player: IPlayer, grid: OptionGridModel): Promise<Game> {
    // let currentGame = await this.getCurrentGame(player);

    // if (currentGame == null) {
    //   throw "No game in progress";
    // }

    // try {
    //   currentGame.currentRound = {
    //     id: "kjsbdkasdjbaskbj",
    //     allOptions: grid.options,
    //     word: "TEST",
    //     imposter: { player: { name: "MadeUp", id: "MadeUp" } }
    //   };
    //   //currentGame.state = GameStates.roundStarted;

    //   this.setCurrentGame(currentGame);

    //   return currentGame;
    // }
    // catch (e) {
    //   console.log(e);
    //   throw "Error starting new round.";
    // }

    return null;
  }

  async submitAnswer(player: IPlayer, answer: string): Promise<IGame> {
    let currentGame = await this.getCurrentGame(player);

    if (currentGame == null) {
      throw "No game in progress";
    }

    try {
      // TODO: Save the item.

      return currentGame;
    }
    catch (e) {
      console.log(e);
      throw "Error starting new round.";
    }
  }
}