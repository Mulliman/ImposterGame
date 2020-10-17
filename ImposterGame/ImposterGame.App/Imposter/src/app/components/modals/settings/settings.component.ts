import { Component, OnInit } from '@angular/core';
import { BaseGameComponent } from '../../BaseGameComponent';
import { PlayerService } from 'src/app/services/player.service';
import { GameService } from 'src/app/services/game.service';
import { ModalController } from '@ionic/angular';
import { IPlayer } from 'src/server';
import { UiService } from 'src/app/services/ui.service';
import { AppPagesService } from 'src/app/services/app-pages.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent extends BaseGameComponent {
  isLoaded: boolean;

  constructor(playerService: PlayerService,
    gameService: GameService,
    public uiService: UiService,
    public appPages: AppPagesService,
    public modalController: ModalController) {
    super(playerService, gameService);
  }

  protected async updateScope() {
    this.isLoaded = true;
  }

  async kickPlayer(playerToKick: IPlayer){
    try {
      var scope = this;

      const isHost = this.currentGameContext.currentGame
        && this.currentGameContext.currentGame.host.id == playerToKick.id;

      if (isHost) {
        this.uiService.confirm("Finish Game", "You are the host, if you leave you will stop the game for everybody. Are you sure?", async function () {
          await scope.gameService.kickPlayer(playerToKick, scope.currentGameContext.currentGame.easyCode);
          scope.playerService.clearSavedPlayer();
          await scope.appPages.reloadApp();
        });
      } else {
        const isMidGame =
          this.currentGameContext.currentGame
          && this.currentGameContext.currentGame.currentRound
          && !this.currentGameContext.currentGame.currentRound.isComplete;

        const message = isMidGame
          ? "If you kick " + playerToKick.name  + " now the round will be cancelled for everyone! Are you sure you want to kick?"
          : "Are you sure you want to kick " + playerToKick.name + "?";

        this.uiService.confirm("Kick player", message, async () => {
          await scope.gameService.kickPlayer(playerToKick, scope.currentGameContext.currentGame.easyCode);
          await scope.uiService.successToast(playerToKick.name + " kicked!");
        });
      }
    } catch (e) {
      console.error("Kick player error", e);
    }
  }

  async dismiss() {
    await this.modalController.dismiss();
  }
}