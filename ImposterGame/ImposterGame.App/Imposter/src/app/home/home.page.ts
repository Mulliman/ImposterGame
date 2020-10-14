import { Component, ViewChild } from '@angular/core';
import { IonSlides } from '@ionic/angular';
import { BaseGamePage } from '../pages/baseGamePage';
import { PlayerService } from '../services/player.service';
import { GameService } from '../services/game.service';
import { AppPagesService } from '../services/app-pages.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage extends BaseGamePage {
  
  @ViewChild('HomeSlider', { static: true }) slides: IonSlides;

  slideOpts = {
    initialSlide: 0,
    speed: 400,
    slidesPerView: 1,
    pager: true,
  };

  constructor(playerService: PlayerService,
    gameService: GameService,
    appPages: AppPagesService) {
    super(playerService, gameService, appPages);
  }

  setAllowedStates(): string[] {
    return null;
  }

  async gamePageOnInit() {
    // The user can't use the home page if already playing.
    if(this.gameContext.currentGame){
      await this.appPages.ensureOnMostAppropriatePage(this.playerService.currentPlayer, this.gameContext);
    }
  }

  async gamePageOnLeave(){
    
  }

  swipeNext() {
    this.slides.slideNext();
  }
}
