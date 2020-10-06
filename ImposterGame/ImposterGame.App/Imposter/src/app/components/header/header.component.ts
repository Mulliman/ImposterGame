import { Component, OnInit } from '@angular/core';
import { GameService } from 'src/app/services/game.service';
import { GameContext } from "src/app/services/gamecontext.service";
import { PlayerService } from 'src/app/services/player.service';
import { IPlayer } from 'src/server';
import { Game } from 'src/app/model/Game';

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
    var currentGameContext = await this.gameService.getCurrentGameContext(player);

    this.initComponent(currentGameContext, player);

    if(currentGameContext){
      currentGameContext.onGameUpdated.subscribe((game: Game) => this.initComponent(currentGameContext, player));
    }
  }

  private async initComponent(currentGameContext: GameContext, player: IPlayer){
    console.log("initComponent", currentGameContext, player);
    
    var hasImposterSet = !currentGameContext 
      || !currentGameContext.currentGame 
      || !currentGameContext.currentGame.currentRound 
      || !currentGameContext.currentGame.currentRound.imposter;

    if(!player || hasImposterSet){
      console.log("not in round");
      this.isInRound = false;
    } else{
      console.log("in round");
      this.isImposter = currentGameContext.currentGame.currentRound.imposter.player.name === player.name;
      this.isInRound = true;
    }

    this.isLoaded = true;
  }
}