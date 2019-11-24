import { Injectable } from '@angular/core';
import { PlayerApiService } from 'src/server/api/playerApi.service';
import { IPlayer } from 'src/server';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  readonly PlayerKey = "imposter.player";

  currentPlayer: IPlayer;

  constructor(private playerApi: PlayerApiService) { }

  async setCurrentPlayer(name: string): Promise<IPlayer> {

    try{  
      var response = await this.playerApi.apiPlayerApiCreatePost(name).toPromise();
  
      this.currentPlayer = response;

      localStorage.setItem(this.PlayerKey, JSON.stringify(this.currentPlayer));
  
      return this.currentPlayer;
    } catch (e){
      console.log(e);
      alert("Error saving your name");
    }    
  }

  async getCurrentPlayer(): Promise<IPlayer> {
    if (this.currentPlayer) {
      return this.currentPlayer;
    }

    if (!localStorage.getItem(this.PlayerKey)) {
      return null;
    }

    var localPlayer = JSON.parse(localStorage.getItem(this.PlayerKey)) as IPlayer;

    if (!localPlayer) {
      return null;
    }

    try{
      var serverPlayer = await this.playerApi.apiPlayerApiGetGet(localPlayer.id).toPromise();

      if(!serverPlayer){
        return null;
      }
  
      return serverPlayer;
    }
    catch (e){
      console.log(e);
      alert("Error getting your details from the server");
    }
  }
}