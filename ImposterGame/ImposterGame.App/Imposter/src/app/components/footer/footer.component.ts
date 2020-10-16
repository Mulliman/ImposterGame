import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { GameService, GameModel } from 'src/app/services/game.service';
import { GameContext } from "src/app/services/gamecontext.service";
import { AppPagesService } from 'src/app/services/app-pages.service';
import { PlayerService } from 'src/app/services/player.service';
import { ModalController } from '@ionic/angular';
import { HelpModalComponent } from '../modals/help-modal/help-modal.component';
import { IPlayer } from 'src/server';
import { Game } from 'src/app/model/Game';
import { BaseGameComponent } from '../BaseGameComponent';
import { UiService } from 'src/app/services/ui.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent extends BaseGameComponent {
  isLoaded: boolean;

  @Input() helpSection: string;
  @Input() hidePlayButton: boolean;
  @Input() hideChangeNameButton: boolean;
  @Input() showNextRoundButton: boolean;

  showChangeName: boolean;

  constructor(playerService: PlayerService,
    gameService: GameService,
    private appPages: AppPagesService,
    private modalController: ModalController,
    private uiService: UiService) {
    super(playerService, gameService);
  }

  protected async updateScope() {
    this.isLoaded = true;

    this.showChangeName = !!(!this.hideChangeNameButton
      && ((!this.currentGameContext.currentGame || this.currentGameContext.currentGame.canLeaveWithoutRoundCancellation)
      && this.player));
  }

  async playGame() {
    await this.appPages.goToYouPage();
  }

  async leaveGame() {
    try {
      var scope = this;

      const isHost = this.currentGameContext.currentGame
        && this.currentGameContext.currentGame.host.id == this.playerService.currentPlayer.id;

      if (isHost) {
        this.uiService.confirm("Finish Game", "You are the host, if you leave you will stop the game for everybody. Are you sure?", async function () {
          await scope.gameService.leaveGame(scope.playerService.currentPlayer, scope.currentGameContext.currentGame.easyCode);
          scope.playerService.clearSavedPlayer();
          await scope.appPages.reloadApp();
        });
      } else {
        const isMidGame =
          this.currentGameContext.currentGame
          && this.currentGameContext.currentGame.currentRound
          && !this.currentGameContext.currentGame.currentRound.isComplete;

        const message = isMidGame
          ? "If you leave the game now, the round will be cancelled for everyone! Are you sure you want to leave this game?"
          : `Are you sure you want to leave this game?`;

        this.uiService.confirm("Leave Game", message, async function () {
          await scope.gameService.leaveGame(scope.playerService.currentPlayer, scope.currentGameContext.currentGame.easyCode);
          scope.playerService.clearSavedPlayer();
          await scope.appPages.reloadApp();
        });
      }
    } catch (e) {
      console.error("Leave game error", e);
    }
  }

  async clearPlayer(){
    var scope = this;

    this.uiService.confirm("Are you sure you want change your name?", "", async function () {
      await scope.playerService.clearSavedPlayer();
      await scope.appPages.reloadApp();
    });
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
  
  async goToNextRound(){
    await this.appPages.goToNewRoundPage();
  }
}