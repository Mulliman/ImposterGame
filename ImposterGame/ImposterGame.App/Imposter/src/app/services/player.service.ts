import { Injectable } from '@angular/core';
import { PlayerApiService } from 'src/server/api/playerApi.service';
import { IPlayer } from 'src/server';
import { UiService } from './ui.service';
import { timeout } from 'q';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  readonly PlayerKey = "imposter.player";

  currentPlayer: IPlayer;
  isAlreadyFetching: boolean;

  constructor(private playerApi: PlayerApiService, private uiService: UiService) {
    console.log("PlayerService constructed");
   }

  async setCurrentPlayer(name: string): Promise<IPlayer> {

    try{  
      var response = await this.playerApi.apiPlayerApiCreatePost(name).toPromise();
  
      this.currentPlayer = response;

      localStorage.setItem(this.PlayerKey, JSON.stringify(this.currentPlayer));
  
      return this.currentPlayer;
    } catch (e){
      console.log(e);
      this.uiService.errorToast("There was an error connecting with the server.", "You could not be created at this time, please try again.");
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

    this.currentPlayer = await this.getFromServer(localPlayer);

    return this.currentPlayer;
  }

  private async getFromServer(localPlayer: IPlayer): Promise<IPlayer> {
    try{
      var serverPlayer = await this.playerApi.apiPlayerApiGetGet(localPlayer.id).toPromise();

      if(!serverPlayer){
        this.uiService.errorToast("There was an error finding your account on the server.", "Please clear you browsing data for this website.");
        return null;
      }
  
      return serverPlayer;
    }
    catch (e){
      console.log(e);
      this.uiService.errorToast("There was an error connecting with the server.", "Please check your network connection and try again.");
    }
  }
}