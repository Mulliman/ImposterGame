import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { GameModel } from './game.service';
import { NavController } from '@ionic/angular';
import { GameStates } from '../model/GameStates';
import { IPlayer, IGame } from 'src/server';

@Injectable({
  providedIn: 'root'
})
export class AppPagesService {

  public routes = {
    home: "home",
    you: "you",
    newGame: "new-game",
    newRound: "new-round",
    currentRound: "current-round",
    chooseImposter: "choose-imposter"
  };

  constructor(private navController: NavController) {
  }

  async ensureOnMostAppropriatePage(player: IPlayer, game: IGame) {
    console.log("ensureOnMostAppropriatePage");
    if (!player) {
      await this.goToYouPage();
      return;
    }

    if(!game){
      await this.goToNewGamePage();
      return;
    }

    if(game.state == GameStates.roundPending){
      await this.goToNewRoundPage();
      return;
    }

    if(game.state == GameStates.roundStarted){
      await this.goToCurrentRoundPage();
      return;
    }

    // TODO: Add other states here.

    //await this.goToNewGamePage();
  }

  async goToHomePage() {
    await this.navController.navigateForward([`/${this.routes.home}`]);
  }

  async goToYouPage() {
    await this.navController.navigateForward([`/${this.routes.you}`]);
  }

  async goToNewGamePage() {
    await this.navController.navigateForward([`/${this.routes.newGame}`]);
  }

  async goToNewRoundPage() {
    await this.navController.navigateForward([`/${this.routes.newRound}`]);
  }

  async goToCurrentRoundPage() {
    await this.navController.navigateForward([`/${this.routes.currentRound}`]);
  }

  async goToChooseImposterPage() {
    await this.navController.navigateForward([`/${this.routes.chooseImposter}`]);
  }
}