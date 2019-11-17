import { Injectable } from '@angular/core';

export class PlayerModel {
  id: string;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  readonly PlayerKey = "imposter.player";

  currentPlayer: PlayerModel;

  constructor() { }

  async setCurrentPlayer(name: string): Promise<PlayerModel> {
    this.currentPlayer = {
      id: name,
      name: name
    };

    // TODO: Call the API to save this on server.

    localStorage.setItem(this.PlayerKey, JSON.stringify(this.currentPlayer));

    return this.currentPlayer;
  }

  async getCurrentPlayer(): Promise<PlayerModel> {
    if (this.currentPlayer) {
      return this.currentPlayer;
    }

    if (!localStorage.getItem(this.PlayerKey)) {
      return null;
    }

    var localPlayer = JSON.parse(localStorage.getItem(this.PlayerKey)) as PlayerModel;

    if (!localPlayer) {
      return null;
    }

    return localPlayer;

    // TODO: Get from the server.
  }
}