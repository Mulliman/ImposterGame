import { Component, OnInit } from '@angular/core';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  hasJoinedGame: boolean;

  constructor(private gameService: GameService) { }

  async ngOnInit() {
    this.hasJoinedGame = this.gameService.hasJoinedGame;
  }

}
