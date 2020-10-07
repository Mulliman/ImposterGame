import { Component, OnInit, Input } from '@angular/core';
import { GameService, GameModel } from 'src/app/services/game.service';
import { GameContext } from "src/app/services/gamecontext.service";
import { AppPagesService } from 'src/app/services/app-pages.service';
import { PlayerService } from 'src/app/services/player.service';
import { ModalController } from '@ionic/angular';
import { HelpModalComponent } from '../modals/help-modal/help-modal.component';
import { IPlayer } from 'src/server';
import { Game } from 'src/app/model/Game';
import { BaseGameComponent } from '../BaseGameComponent';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent extends BaseGameComponent {
  isLoaded: boolean;

  @Input() helpSection: string;

  constructor(playerService: PlayerService,
    gameService: GameService,
    private appPages: AppPagesService,
    private modalController: ModalController) {
    super(playerService, gameService);
  }

  protected async updateScope() {
    this.isLoaded = true;
  }

  async playGame() {
    await this.appPages.goToYouPage();
  }

  async leaveGame() {
    try {
      await this.gameService.leaveGame(this.player, this.currentGameContext.currentGame.easyCode);
      await this.appPages.goToHomePage();
    } catch (e) {
      console.error("Leave game error", e);
    }
  }

  async showHelp() {
    const modal = await this.modalController.create({
      component: HelpModalComponent,
      componentProps: {
        section: this.helpSection,
        isImposter: this.currentGameContext.currentGame && this.currentGameContext.currentGame.isImposter
      }
    });
    return await modal.present();
  }
}