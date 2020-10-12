import { Component, OnInit, ViewChild } from '@angular/core';
import { GameStates } from 'src/app/model/GameStates';
import { PlayerService } from 'src/app/services/player.service';
import { GameService } from 'src/app/services/game.service';
import { AppPagesService } from 'src/app/services/app-pages.service';
import { IonSlides } from '@ionic/angular';
import { BaseGamePage } from '../baseGamePage';
import { ScoreboardComponent  } from 'src/app/components/scoreboard/scoreboard.component';
import { IRound, IPlayer } from 'src/server';

@Component({
  selector: 'app-round-scores',
  templateUrl: './round-scores.page.html',
  styleUrls: ['./round-scores.page.scss']
})
export class RoundScoresPage extends BaseGamePage {

  states: Array<string> = [GameStates.roundCompleted, GameStates.roundPending];

  @ViewChild('ScoresSlider', { static: true }) slides: IonSlides;

  slideOpts = {
    initialSlide: 0,
    speed: 400,
    slidesPerView: 1
  };
  subscription: any;

  constructor(playerService: PlayerService,
    gameService: GameService,
    appPages: AppPagesService) {

    super(playerService, gameService, appPages);
  }

  setAllowedStates(): Array<string> {
    return this.states;
  }

  async gamePageOnInit() {
    
  }

  async gamePageOnLeave(){
    
  }

  isUserGuessCorrect(previousRound: IRound, player: IPlayer){
    var imposterName = previousRound.imposter.player.name;
    var participant = previousRound.participants.filter((p) => p.player.id == player.id)[0];

    return imposterName == participant.accusation.playerName;
  }

  async goToSlide(num: number) {
    await this.slides.slideTo(num);
  }

  async goToNextRound(){
    await this.appPages.goToNewRoundPage();
  }
}