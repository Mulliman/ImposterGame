import { Injectable } from '@angular/core';
import { GameStates } from '../model/GameStates';
import { OptionGridModel } from './option-grid.service';
import { IPlayer, GameApiService, IGame } from 'src/server';
import { UiService } from './ui.service';
import { Game } from '../model/Game';

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

@Injectable({
  providedIn: 'root'
})
export class GameService {

  readonly GameKey: string = "imposter.game";

  public get hasJoinedGame(): boolean { return !!this.currentGame; }
  private currentGame: Game;

  constructor(private gameApi: GameApiService, private uiService: UiService) { }

  async hostGame(player: IPlayer): Promise<Game> {
    try {
      var serverGame = await this.gameApi.apiGameApiHostPost(player.id).toPromise();

      this.setCurrentGameFromServerGame(serverGame, player);

      return this.currentGame;
    } catch (e) {
      console.error("Host Game Error", e);
      this.uiService.errorToast("The was an error starting your game.", "Please check your connection and try again.")
      throw e;
    }
  }

  async joinGame(player: IPlayer, gameCode: string): Promise<Game> {
    try {
      // TODO: call the services;

      this.currentGame = {
        state: GameStates.roundPending,
        //gameCode: "TEST",
        //isHost: false,
        currentRound: null,
        currentPlayer: {},
        isHost: false
      };

      this.setCurrentGameFromServerGame(this.currentGame, player);

      return this.currentGame;
    } catch (e) {
      console.error("Host Game Error", e);
      throw e;
    }
  }

  async getCurrentGame(): Promise<Game> {
    if (this.currentGame) {
      return this.currentGame;
    }

    let game = JSON.parse(localStorage.getItem(this.GameKey)) as Game;

    if (!game) {
      this.clearSavedGame();
      return null;
    }

    // TODO: Get from server

    return game;
  }

  async leaveGame(player: IPlayer, gameCode: string): Promise<void> {
    try {
      // TODO: Call APIs

      this.clearSavedGame();
    } catch (e) {
      console.error("Leave Game Error", e);
      throw e;
    }
  }

  async startNewRound(grid: OptionGridModel): Promise<Game> {
    let currentGame = await this.getCurrentGame();

    if (currentGame == null) {
      throw "No game in progress";
    }

    try {
      currentGame.currentRound = {
        id: "kjsbdkasdjbaskbj",
        allOptions: grid.options,
        word: "TEST",
        imposter: { player: { name: "MadeUp", id: "MadeUp" } }
      };
      //currentGame.state = GameStates.roundStarted;

      this.setCurrentGame(currentGame);

      return currentGame;
    }
    catch (e) {
      console.log(e);
      throw "Error starting new round.";
    }
  }

  async submitAnswer(playerId: string, answer: string): Promise<IGame> {
    let currentGame = await this.getCurrentGame();

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

  setCurrentGameFromServerGame(serverGame: IGame, player: IPlayer) {
    this.currentGame = serverGame as Game;
    this.currentGame.isHost = this.currentGame.host.id == player.id;
    this.currentGame.currentPlayer = player;

    this.setCurrentGame(this.currentGame);
  }

  setCurrentGame(game: Game) {
    this.currentGame = game;

    localStorage.setItem(this.GameKey, JSON.stringify(this.currentGame));
  }

  clearSavedGame() {
    localStorage.removeItem(this.GameKey);
    this.currentGame = null;
  }
}