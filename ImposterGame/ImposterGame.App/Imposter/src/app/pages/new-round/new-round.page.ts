import { Component } from '@angular/core';
import { BaseGamePage } from '../baseGamePage';
import { PlayerService } from 'src/app/services/player.service';
import { GameService } from 'src/app/services/game.service';
import { AppPagesService } from 'src/app/services/app-pages.service';
import { GameStates } from 'src/app/model/GameStates';
import { OptionGridService } from 'src/app/services/option-grid.service';
import { ModalController, IonSlides } from '@ionic/angular';
import { ChooseGridComponent } from 'src/app/components/modals/choose-grid/choose-grid.component';

@Component({
  selector: 'app-new-round',
  templateUrl: './new-round.page.html',
  styleUrls: ['./new-round.page.scss'],
})
export class NewRoundPage extends BaseGamePage {

  constructor(playerService: PlayerService,
    gameService: GameService,
    appPages: AppPagesService,
    protected gridService: OptionGridService,
    public modalController: ModalController) {
    super(playerService, gameService, appPages);
  }

  setAllowedStates(): string[] {
    return [GameStates.roundPending, GameStates.roundCompleted];
  }

  async gamePageOnInit() {

  }

  async startRound(){
    await this.gameService.startNewRound(this.gridService.selectedOptionGrid);

    await this.appPages.goToCurrentRoundPage();
  }

  async goToChooseGridPage(){
    console.log("goToChooseGridPage");
    
      const modal = await this.modalController.create({
        component: ChooseGridComponent
      });
      return await modal.present();
  }
}