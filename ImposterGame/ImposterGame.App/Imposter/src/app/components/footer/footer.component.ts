import { Component, OnInit } from '@angular/core';
import { GameService } from 'src/app/services/game.service';
import { AppPagesService } from 'src/app/services/app-pages.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  hasJoinedGame: boolean;

  constructor(private gameService: GameService,
    private appPages: AppPagesService) { }

  async ngOnInit() {
    this.hasJoinedGame = this.gameService.hasJoinedGame;
  }

  async playGame(){
    await this.appPages.goToYouPage();
  }

  async leaveGame(){

    // TODO Call API

    await this.appPages.goToHomePage();

  }
}