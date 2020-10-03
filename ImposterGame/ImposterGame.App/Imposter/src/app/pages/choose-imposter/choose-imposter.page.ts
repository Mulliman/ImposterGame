import { Component, OnInit, ViewChild } from '@angular/core';
import { Round, GameService } from 'src/app/services/game.service';
import { IonSlides } from '@ionic/angular';
import { PlayerService } from 'src/app/services/player.service';
import { FormBuilder } from '@angular/forms';
import { AppPagesService } from 'src/app/services/app-pages.service';
import { GameStates } from 'src/app/model/GameStates';
import { BaseGamePage } from '../baseGamePage';
import { IPlayer, IRound } from 'src/server';

@Component({
  selector: 'app-choose-imposter',
  templateUrl: './choose-imposter.page.html',
  styleUrls: ['./choose-imposter.page.scss'],
})
export class ChooseImposterPage extends BaseGamePage {

  currentRound: IRound;
  isImposter: boolean;
  yourAnswer: string;
  selectedImposter: IPlayer;
  selectedWager: number;

  @ViewChild('ChooseImposterSlider', { static: true }) slides: IonSlides;

  slideOpts = {
    initialSlide: 1,
    speed: 400,
    slidesPerView: 1
  };
  
  constructor(playerService: PlayerService,
    gameService: GameService,
    appPages: AppPagesService) {
    super(playerService, gameService, appPages);
  }

  setAllowedStates(): string[] {
    return [GameStates.roundAnswered];
  }

  gamePageOnInit() {
    this.currentRound = this.gameContext.currentGame.currentRound;
    this.isImposter = this.currentRound.imposter.player.name == this.playerService.currentPlayer.name;
  }

  async goToSlide(num: number) {
    await this.slides.slideTo(num);
  }

  setSelectedPlayer(player: IPlayer) {
    this.selectedImposter = player;
  }

  setWager(amount: number) {
    this.selectedWager = amount;
  }

  async submitAnswer() {
    
  }
}