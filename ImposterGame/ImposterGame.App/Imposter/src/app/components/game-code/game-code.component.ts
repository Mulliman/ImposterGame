import { Component, OnInit } from '@angular/core';
import { BaseGameComponent } from '../BaseGameComponent';
import { PlayerService } from 'src/app/services/player.service';
import { GameService } from 'src/app/services/game.service';
import { AppPagesService } from 'src/app/services/app-pages.service';
import { ModalController } from '@ionic/angular';
import { UiService } from 'src/app/services/ui.service';

@Component({
  selector: 'app-game-code',
  templateUrl: './game-code.component.html',
  styleUrls: ['./game-code.component.scss'],
})
export class GameCodeComponent extends BaseGameComponent {
  isLoaded: boolean;

  protected updateScope() {
    console.log("GameCodeComponent");
    
    this.isLoaded = true;
  }

  constructor(playerService: PlayerService,
    gameService: GameService,
    private appPages: AppPagesService,
    private modalController: ModalController,
    private uiService: UiService) {
    super(playerService, gameService);
  }

  copyCode() {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = this.currentGameContext.currentGame.easyCode;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);

    this.uiService.successToast("Game code copied to clipboard.");
  }
}
