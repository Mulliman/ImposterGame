import { Injectable, EventEmitter } from '@angular/core';
import { GameStates } from '../model/GameStates';
import { OptionGridModel } from './option-grid.service';
import { IPlayer, GameApiService, IGame, JoinGameModel, RoundApiService, AddAnswerModel } from 'src/server';
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

  public onGameUdated = new EventEmitter<Game>();
  public onPlayersChanged = new EventEmitter<Game>();
  public onRoundStarted = new EventEmitter<Game>();
  public onAllAnswered = new EventEmitter<Game>();

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

  async updateGameFromServer(serverGame: IGame) : Promise<Game>{
    var game = GameFactory.fromServerGame(serverGame, this.currentGame.currentPlayer);

    await this.updateGame(game);

    return game;
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
    await this.addStartRoundListener();
    this.addOnAllAnsweredListener();
  }

  public addOnNewPlayerListener = () => {
    console.log("addOnNewPlayerListener");

    this.hubConnection.on('NewPlayer', (data) => {
      console.log("addOnNewPlayerListener - NewPlayer", data);

      this.updateGameFromServer(data);
      console.log("addOnNewPlayerListener - Current game updated", this.currentGame);
      
      console.log("addOnNewPlayerListener - pre onPlayersChanged.emit");
      this.onGameUdated.emit(this.currentGame);
      this.onPlayersChanged.emit(this.currentGame);
      console.log("addOnNewPlayerListener - post onPlayersChanged.emit");

      this.callback(this.currentGame);
    });
  }

  public async addStartRoundListener() : Promise<void> {
    this.hubConnection.on('StartRound', async (data) => {
      this.updateGameFromServer(data);
      this.onGameUdated.emit(this.currentGame);
      this.onRoundStarted.emit(this.currentGame);

      console.log("signalr - StartRound data", data);
      console.log("signalr - StartRound data", this.currentGame);
      await this.appPages.goToCurrentRoundPage();

      this.callback(this.currentGame);
    });
  }

  public addOnAllAnsweredListener = () => {
    this.hubConnection.on('AllAnswered', (data) => {
      this.updateGameFromServer(data);
      this.onGameUdated.emit(this.currentGame);
      this.onAllAnswered.emit(this.currentGame);
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

  private gameContext: GameContext;
  public readonly gamePersister: GamePersister;

  // public get hasJoinedGame(): boolean { return !!this.currentGame; }
  // currentGame: Game;

  constructor(private gameApi: GameApiService,
    private roundApi: RoundApiService,
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

    this.gameContext = await this.createNewContext(game);

    return this.gameContext;
  }

  async createNewContext(game: Game){
    var gameContext = new GameContext(this.uiService, this.appPages, new GamePersister());
    gameContext.start(game, (g) => console.log("updated signalr", g));
    
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
}