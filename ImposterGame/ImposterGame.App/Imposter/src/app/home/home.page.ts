import { Component, ViewChild } from '@angular/core';
import { IonSlides, ModalController } from '@ionic/angular';
import { BaseGamePage } from '../pages/baseGamePage';
import { PlayerService } from '../services/player.service';
import { GameService } from '../services/game.service';
import { AppPagesService } from '../services/app-pages.service';
import { UiService } from '../services/ui.service';
import { SettingsComponent } from '../components/modals/settings/settings.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage extends BaseGamePage {
  
  @ViewChild('HomeSlider', { static: true }) slides: IonSlides;

  slideOpts = {
    initialSlide: 0,
    speed: 400,
    slidesPerView: 1,
    pager: true,
  };

  showHeaderLogo: boolean;
  hasLoaded: boolean;

  constructor(playerService: PlayerService,
    gameService: GameService,
    appPages: AppPagesService,
    public modalController: ModalController) {
    super(playerService, gameService, appPages);
  }

  setAllowedStates(): string[] {
    return null;
  }

  async gamePageOnInit() {
    this.hasLoaded = true;
    
    // The user can't use the home page if already playing.
    if(this.gameContext && this.gameContext.currentGame){
      await this.appPages.ensureOnMostAppropriatePage(this.playerService.currentPlayer, this.gameContext);
    }
  }

  async gamePageOnLeave(){
    
  }

  swipeNext() {
    this.slides.slideNext();
  }

  async slideChanged(){
    var index = await this.slides.getActiveIndex();

    this.showHeaderLogo = index != 0;
  }

  async playGame() {
    await this.appPages.goToYouPage();
  }

  async openSettings(){
    const modal = await this.modalController.create({
      component: SettingsComponent
    });
    return await modal.present();
  }
}
