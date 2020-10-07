import { Component, NgZone, ChangeDetectionStrategy, Input, ChangeDetectorRef } from '@angular/core';
import { GameService } from 'src/app/services/game.service';
import { PlayerService } from 'src/app/services/player.service';
import { BaseGameComponent } from '../BaseGameComponent';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent extends BaseGameComponent {

  // isInRound: boolean;
  // isImposter: boolean;
  isLoaded: boolean;

  constructor(playerService: PlayerService,
    gameService: GameService) {
    super(playerService, gameService);
  }

  protected async updateScope() {
    this.isLoaded = true;
  }
}