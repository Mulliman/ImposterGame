import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { GameModel } from './game.service';
import { PlayerModel } from './player.service';

@Injectable({
  providedIn: 'root'
})
export class AppPagesService {

  public routes = {
    home: "home",
    you: "you"
  }

  constructor(private router: Router) {
  }

  ensureOnMostAppropriatePage(player: PlayerModel, game: GameModel) {
    if (!player) {
      this.goToYouPage();
      return;
    }

    // TODO: Add other states here.

    this.goToHomePage();
  }

  goToHomePage() {
    this.router.navigate([`/${this.routes.home}`]);
  }

  goToYouPage() {
    this.router.navigate([`/${this.routes.you}`]);
  }
}