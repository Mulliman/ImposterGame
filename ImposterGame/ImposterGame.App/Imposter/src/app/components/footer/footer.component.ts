import { Component, OnInit, Input } from '@angular/core';
import { GameService, GameModel } from 'src/app/services/game.service';
import { AppPagesService } from 'src/app/services/app-pages.service';
import { PlayerService } from 'src/app/services/player.service';
import { ModalController } from '@ionic/angular';
import { HelpModalComponent } from '../modals/help-modal/help-modal.component';
import { IPlayer } from 'src/server';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  hasJoinedGame: boolean;
  player: IPlayer;
  game: GameModel;
  isLoaded: boolean;

  @Input() helpSection: string;

  constructor(private playerService: PlayerService,
    private gameService: GameService,
    private appPages: AppPagesService,
    private modalController: ModalController) { }

  async ngOnInit() {
    this.player = await this.playerService.getCurrentPlayer();
    this.game = await this.gameService.getCurrentGame();

    this.hasJoinedGame = !!this.game;

    this.isLoaded = true;
  }

  async playGame(){
    await this.appPages.goToYouPage();
  }

  async leaveGame(){
    try{
      await this.gameService.leaveGame(this.player, this.game.gameCode);
      this.hasJoinedGame = false;
      await this.appPages.goToHomePage();
    }catch (e){

    }
  }

  async showHelp(){
      const modal = await this.modalController.create({
        component: HelpModalComponent,
        componentProps: {
          section: this.helpSection
        }
      });
      return await modal.present();
  }
}