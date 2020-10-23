import { Component, ViewChild } from '@angular/core';
import { BaseGamePage } from '../baseGamePage';
import { PlayerService } from 'src/app/services/player.service';
import { GameService } from 'src/app/services/game.service';
import { AppPagesService } from 'src/app/services/app-pages.service';
import { GameStates } from 'src/app/model/GameStates';
import { OptionGridService } from 'src/app/services/option-grid.service';
import { ModalController, IonSlides } from '@ionic/angular';
import { ChooseGridComponent } from 'src/app/components/modals/choose-grid/choose-grid.component';
import { Game } from 'src/app/model/Game';
import { UiService } from 'src/app/services/ui.service';

@Component({
  selector: 'app-new-round',
  templateUrl: './new-round.page.html',
  styleUrls: ['./new-round.page.scss'],
})
export class NewRoundPage extends BaseGamePage {

  states = [GameStates.roundPending];

  @ViewChild('NewRoundSlider', { static: true }) slides: IonSlides;

  slideOpts = {
    initialSlide: 1,
    speed: 400,
    slidesPerView: 1
  };
  subscription: any;

  constructor(playerService: PlayerService,
    gameService: GameService,
    appPages: AppPagesService,
    public gridService: OptionGridService,
    private uiService: UiService,
    public modalController: ModalController) {

    super(playerService, gameService, appPages);
    console.log("Constructed New Round");
  }

  setAllowedStates(): Array<string> {
    return this.states;
  }

  async gamePageOnInit() {
  }

  async gamePageOnLeave(){
    
  }

  ngOnDestroy() {
  }

  async startRound(){
    if(this.gameContext.currentGame.players.length > 1){
      await this.gameService.startNewRound(this.playerService.currentPlayer, this.gridService.selectedOptionGrid);
      await this.appPages.goToCurrentRoundPage();
    } else{
      await this.uiService.errorToast("You must have at least 3 players to start a round.");
    }
  }

  async goToChooseGridPage(){    
      const modal = await this.modalController.create({
        component: ChooseGridComponent,
        componentProps: {
          'isHost': this.gameContext && this.gameContext.currentGame && this.gameContext.currentGame.isHost
        }
      });
      return await modal.present();
  }

  async goToSlide(num: number) {
    await this.slides.slideTo(num);
  }
}