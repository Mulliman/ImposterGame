import { Component, OnInit } from '@angular/core';
import { GameService, GameModel } from 'src/app/services/game.service';
import { AppPagesService } from 'src/app/services/app-pages.service';
import { PlayerService, PlayerModel } from 'src/app/services/player.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  hasJoinedGame: boolean;
  player: PlayerModel;
  game: GameModel;

  constructor(private playerService: PlayerService,
    private gameService: GameService,
    private appPages: AppPagesService) { }

  async ngOnInit() {
    this.player = await this.playerService.getCurrentPlayer();
    this.game = await this.gameService.getCurrentGame();

    this.hasJoinedGame = !!this.game;
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
}