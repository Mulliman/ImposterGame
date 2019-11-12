import { Injectable } from '@angular/core';

export class GameModel {
  state: string
}

@Injectable({
  providedIn: 'root'
})
export class GameService {

  readonly GameKey: string = "imposter.game";

  public hasJoinedGame: boolean;
  public currentGame: GameModel;

  constructor() { }

  async joinGame() {
    this.hasJoinedGame = true;
  }

  async leaveGame() {
    this.hasJoinedGame = false;
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

  clearSavedGame() {
    localStorage.removeItem(this.GameKey);
    this.currentGame = null;
  }
}