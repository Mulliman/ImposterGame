import { Component, OnInit, ViewChild } from '@angular/core';
import { Round, GameService } from 'src/app/services/game.service';
import { IonSlides, IonCard } from '@ionic/angular';
import { PlayerService } from 'src/app/services/player.service';
import { FormBuilder } from '@angular/forms';
import { AppPagesService } from 'src/app/services/app-pages.service';
import { GameStates } from 'src/app/model/GameStates';
import { BaseGamePage } from '../baseGamePage';
import { IPlayer, IRound } from 'src/server';
import { GameHelpers } from 'src/app/model/Game';

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
  hasSubmitted: boolean;

  @ViewChild('ChooseImposterSlider', { static: true }) slides: IonSlides;

  slideOpts = {
    initialSlide: 1,
    speed: 400,
    slidesPerView: 1
  };
  isSubmitting: boolean;
  
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

    var currentParticipant = GameHelpers.getPlayersParticipant(this.gameContext.currentGame);

    if(currentParticipant.accusation){
      this.selectedImposter = GameHelpers.getPlayerFromId(this.gameContext.currentGame, currentParticipant.accusation.playerId);

      if(this.selectedImposter){
        this.goToSlide(2);
      }

      this.selectedWager = currentParticipant.accusation.wager;
    }
    
    this.hasSubmitted = GameHelpers.hasAccused(this.gameContext.currentGame);
  }

  async gamePageOnLeave(){
  }

  async goToSlide(num: number) {
    await this.slides.slideTo(num);
  }

  setSelectedPlayer(selectedPlayer: IPlayer) {
    console.log("setSelectedPlayer", selectedPlayer);

    this.selectedImposter = selectedPlayer;
  }

  setWager(amount: number) {
    this.selectedWager = amount;
  }

  async submitAnswer() {
    try {
      this.isSubmitting = true;
      await this.gameService.submitAccusation(this.playerService.currentPlayer, this.selectedImposter.id, this.selectedWager);
      this.isSubmitting = false;
      this.hasSubmitted = true;
    } catch{
      this.isSubmitting = false;
    }
  }
}