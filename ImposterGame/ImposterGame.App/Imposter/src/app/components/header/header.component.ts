import { Component, OnInit } from '@angular/core';
import { GameService } from 'src/app/services/game.service';
import { GameContext } from "src/app/services/gamecontext.service";
import { PlayerService } from 'src/app/services/player.service';
import { IPlayer } from 'src/server';
import { Game } from 'src/app/model/Game';
import { Subscription } from 'rxjs';

export abstract class BaseGameComponent implements OnInit {

  protected subscriptions = new Subscription();
  protected player: IPlayer;
  protected currentGameContext: GameContext;

  constructor(private playerService: PlayerService,
    private gameService: GameService) { }

  async ngOnInit() {
    this.player = await this.playerService.getCurrentPlayer();
    this.currentGameContext = await this.gameService.getCurrentGameContext(this.player);

    await this.updateScope();

    if(this.currentGameContext)
    {
      this.subscriptions.add(this.currentGameContext.onGameUpdated.subscribe((game: Game) => this.updateScope()));
    }
  }

  protected abstract async updateScope();

  async ngOnDestroy () {
   this.subscriptions.unsubscribe();
  }
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent extends BaseGameComponent {

  isInRound: boolean;
  isImposter: boolean;
  isLoaded: boolean;

  constructor(playerService: PlayerService,
    gameService: GameService) {
    super(playerService, gameService);
  }

  protected async updateScope() {
    console.log("initComponent", this.currentGameContext, this.player);

    var hasImposterSet = !this.currentGameContext
      || !this.currentGameContext.currentGame
      || !this.currentGameContext.currentGame.currentRound
      || !this.currentGameContext.currentGame.currentRound.imposter;

    if (!this.player || hasImposterSet) {
      console.log("not in round");
      this.isInRound = false;
    } else {
      console.log("in round");
      this.isImposter = this.currentGameContext.currentGame.currentRound.imposter.player.name === this.player.name;
      this.isInRound = true;
    }

    this.isLoaded = true;
  }
}