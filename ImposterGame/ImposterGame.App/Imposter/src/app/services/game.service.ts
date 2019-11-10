import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  public hasJoinedGame: boolean;

  constructor() { }

  public joinGame(){
    this.hasJoinedGame = true;
  }

  public leaveGame(){
    this.hasJoinedGame = false;
  }
}