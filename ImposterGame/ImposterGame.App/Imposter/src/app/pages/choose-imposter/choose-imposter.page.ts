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

  timerInterval;
  timer: number = 1;
  
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

    // this.timerInterval = setInterval(() => this.timer++, 1000);
  }

  getDisplayTime() 
  {
    var minutes = Math.floor(this.timer / 60);
    var seconds = this.timer - minutes * 60; 

    return this.padStringLeft(minutes, "0", 2) + ":" + this.padStringLeft(seconds, "0", 2);
  };

  async gamePageOnLeave(){
    clearInterval(this.timerInterval);
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
    await this.gameService.submitAccusation(this.playerService.currentPlayer, this.selectedImposter.id, this.selectedWager);
    this.hasSubmitted = true;
  }

  private padStringLeft(string,pad,length) {
    return (new Array(length+1).join(pad)+string).slice(-length);
  }
}