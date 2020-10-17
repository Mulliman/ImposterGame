import { Component, NgZone, ChangeDetectionStrategy, Input, ChangeDetectorRef } from '@angular/core';
import { GameService } from 'src/app/services/game.service';
import { PlayerService } from 'src/app/services/player.service';
import { BaseGameComponent } from '../BaseGameComponent';
import { ModalController } from '@ionic/angular';
import { SettingsComponent } from '../modals/settings/settings.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent extends BaseGameComponent {

  // isInRound: boolean;
  // isImposter: boolean;
  isLoaded: boolean;

  constructor(playerService: PlayerService,
    gameService: GameService,
    public modalController: ModalController) {
    super(playerService, gameService);
  }

  protected async updateScope() {
    this.isLoaded = true;
  }

  async openSettings(){
    const modal = await this.modalController.create({
      component: SettingsComponent
    });
    return await modal.present();
  }
}