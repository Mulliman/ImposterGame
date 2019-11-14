import { Injectable } from '@angular/core';
import { PlayerModel } from './player.service';
import { GameStates } from '../model/GameStates';

export class GameModel {
  state: string;
  gameCode: string;
}

@Injectable({
  providedIn: 'root'
})
export class GameService {

  readonly GameKey: string = "imposter.game";

  public get hasJoinedGame(): boolean { return !!this.currentGame; }
  public currentGame: GameModel;

  constructor() { }

  async hostGame(player: PlayerModel): Promise<GameModel> {
    try {
      // TODO: call the services;

      return {
        state: GameStates.roundPending,
        gameCode: "TEST"
      };
    } catch (e) {
      console.error("Host Game Error", e);
      throw e;
    }
  }

  async joinGame(player: PlayerModel, gameCode: string): Promise<GameModel> {
    try {
      // TODO: call the services;

      return {
        state: GameStates.roundPending,
        gameCode: "TEST"
      };
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

  async leaveGame(player: PlayerModel, gameCode: string): Promise<void> {
    try {
      // TODO: Call APIs

      this.clearSavedGame();
    } catch (e) {
      console.error("Leave Game Error", e);
      throw e;
    }
  }

  clearSavedGame() {
    localStorage.removeItem(this.GameKey);
    this.currentGame = null;
  }
}