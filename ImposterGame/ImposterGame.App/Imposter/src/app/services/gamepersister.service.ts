import { Injectable } from '@angular/core';
import { Game } from '../model/Game';

@Injectable({
  providedIn: 'root'
})
export class GamePersister {
  readonly GameKey: string = "imposter.game";
  getCurrentGame() {
    let game = JSON.parse(localStorage.getItem(this.GameKey)) as Game;
    if (!game) {
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