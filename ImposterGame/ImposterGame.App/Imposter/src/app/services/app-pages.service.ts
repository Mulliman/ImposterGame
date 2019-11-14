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
    newGame: "new-game"
  }

  constructor(private navController: NavController) {
  }

  async ensureOnMostAppropriatePage(player: PlayerModel, game: GameModel) {
    console.log("ensureOnMostAppropriatePage");
    if (!player) {
      await this.goToYouPage();
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
}