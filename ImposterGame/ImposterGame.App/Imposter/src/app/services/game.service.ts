import { Injectable } from '@angular/core';
import { GameStates } from '../model/GameStates';
import { OptionGridModel } from './option-grid.service';
import { IPlayer } from 'src/server';

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
  private currentGame: GameModel;

  constructor() { }

  async hostGame(player: IPlayer): Promise<GameModel> {
    try {
      // TODO: call the services;

      this.currentGame = {
        state: GameStates.roundPending,
        gameCode: "TEST",
        isHost: true,
        currentRound: null
      };

      this.updateSavedGame(this.currentGame);

      return this.currentGame;
    } catch (e) {
      console.error("Host Game Error", e);
      throw e;
    }
  }

  async joinGame(player: IPlayer, gameCode: string): Promise<GameModel> {
    try {
      // TODO: call the services;

      this.currentGame = {
        state: GameStates.roundPending,
        gameCode: "TEST",
        isHost: false,
        currentRound: null
      };

      this.updateSavedGame(this.currentGame);

      return this.currentGame;
    } catch (e) {
      console.error("Host Game Error", e);
      throw e;
    }
  }

  async getCurrentGame(): Promise<GameModel> {
    if (this.currentGame) {
      return this.currentGame;
    }

    let game = JSON.parse(localStorage.getItem(this.GameKey)) as GameModel;

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

  async startNewRound(grid: OptionGridModel): Promise<GameModel> {
    let currentGame = await this.getCurrentGame();

    if (currentGame == null) {
        throw "No game in progress";
    }

    try {
        currentGame.currentRound = {  
            id: "kjsbdkasdjbaskbj",
            allOptions: grid.options,
            word: "TEST",
            imposter: { player: { name: "MadeUp", id: "MadeUp" }}
        };
        currentGame.state = GameStates.roundStarted;

        this.updateSavedGame(currentGame);

        return currentGame;
    }
    catch (e) {
        console.log(e);
        throw "Error starting new round.";
    }
  }

  async submitAnswer(playerId: string, answer: string): Promise<GameModel> {
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

updateSavedGame(game: GameModel) {
  localStorage.setItem(this.GameKey, JSON.stringify(game));
  this.currentGame = game;
}

  clearSavedGame() {
    localStorage.removeItem(this.GameKey);
    this.currentGame = null;
  }
}