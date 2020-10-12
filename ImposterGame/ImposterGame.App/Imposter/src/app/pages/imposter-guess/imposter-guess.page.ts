import { Component, OnInit } from '@angular/core';
import { BaseGamePage } from '../baseGamePage';
import { PlayerService } from 'src/app/services/player.service';
import { GameService } from 'src/app/services/game.service';
import { AppPagesService } from 'src/app/services/app-pages.service';
import { GameStates } from 'src/app/model/GameStates';

@Component({
  selector: 'app-imposter-guess',
  templateUrl: './imposter-guess.page.html',
  styleUrls: ['./imposter-guess.page.scss'],
})
export class ImposterGuessPage extends BaseGamePage {

  isLoaded: boolean;
  selectedOption:string;

  constructor(playerService: PlayerService,
    gameService: GameService,
    appPages: AppPagesService) {
    super(playerService, gameService, appPages);
  }

  setAllowedStates(): string[] {
    return [GameStates.roundAnswered];
  }

  gamePageOnInit() {
    this.isLoaded = true;
  }

  async gamePageOnLeave(){
    
  }

  async answerSelected(answer: string) {
    console.log("answerSelected", answer);
    this.selectedOption = answer;
  }

  async submitAnswer(){
    var finishedGame = await this.gameService.submitImposterGuessAndScoreRound(this.playerService.currentPlayer, this.selectedOption);
    this.appPages.goToRoundScoresPage();
  }
}