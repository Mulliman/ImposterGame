import { OnInit, NgZone } from '@angular/core';
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

  constructor(protected playerService: PlayerService, protected gameService: GameService) { }

  async ngOnInit() {
    this.player = await this.playerService.getCurrentPlayer();
    this.currentGameContext = await this.gameService.getCurrentGameContext(this.player);

    await this.updateScope();

    if (this.currentGameContext) {
      this.subscriptions.add(this.currentGameContext.onGameUpdated.subscribe((game: Game) => this.updateScope()));
    }
  }

  async ionViewDidEnter(){
      console.log("COMPONENT ENTERED");
      
    await this.updateScope();
  }

  protected abstract async updateScope();

  async ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
