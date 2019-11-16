import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { GameModel } from './game.service';
import { PlayerModel } from './player.service';
import { NavController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AppPagesService {

  public routes = {
    home: "home",
    you: "you",
    newGame: "new-game",
    newRound: "new-round",
    chooseGrid: "choose-grid"
  };

  constructor(private navController: NavController) {
  }

  async ensureOnMostAppropriatePage(player: PlayerModel, game: GameModel) {
    console.log("ensureOnMostAppropriatePage");
    if (!player) {
      await this.goToYouPage();
      return;
    }

    if(!game){
      await this.goToNewGamePage();
      return;
    }

    if(!game){
      await this.goToNewGamePage();
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

  async goToChooseGridPage() {
    await this.navController.navigateForward([`/${this.routes.chooseGrid}`]);
  }
}