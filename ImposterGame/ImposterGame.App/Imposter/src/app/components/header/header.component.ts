import { Component, OnInit } from '@angular/core';
import { GameService } from 'src/app/services/game.service';
import { PlayerService } from 'src/app/services/player.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  isInRound: boolean;
  isImposter: boolean;
  isLoaded: boolean;

  constructor(private playerService: PlayerService,
     private gameService: GameService) { }

  async ngOnInit() {
    var player = await this.playerService.getCurrentPlayer();
    var currentGame = await this.gameService.getCurrentGame(player);

    if(!player || !currentGame || !currentGame.currentRound || !currentGame.currentRound.imposter){
      this.isInRound = false;
    } else{
      this.isImposter = currentGame.currentRound.imposter.player.name === player.name;
      this.isInRound = true;
    }

    this.isLoaded = true;
  }
}