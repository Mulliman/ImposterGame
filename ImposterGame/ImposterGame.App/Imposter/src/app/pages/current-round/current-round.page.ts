import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseGameFormPage } from '../baseGameFormPage';
import { PlayerService } from 'src/app/services/player.service';
import { GameService, Round } from 'src/app/services/game.service';
import { AppPagesService } from 'src/app/services/app-pages.service';
import { FormBuilder, Validators } from '@angular/forms';
import { GameStates } from 'src/app/model/GameStates';
import { IonSlides } from '@ionic/angular';
import { IRound } from 'src/server';

@Component({
  selector: 'app-current-round',
  templateUrl: './current-round.page.html',
  styleUrls: ['./current-round.page.scss'],
})
export class CurrentRoundPage extends BaseGameFormPage {

  currentRound: IRound;
  isImposter: boolean;
  yourAnswer: string;

  @ViewChild('NewRoundSlider', { static: true }) slides: IonSlides;

  slideOpts = {
    initialSlide: 1,
    speed: 400,
    slidesPerView: 1
  };

  constructor(playerService: PlayerService,
    gameService: GameService,
    appPages: AppPagesService,
    formBuilder: FormBuilder) {
    super(playerService, gameService, appPages, formBuilder);
  }

  setAllowedStates(): string[] {
    return [GameStates.roundStarted];
  }

  gamePageOnInit() {
    this.setScopeFromGameContext();
  }

  async gamePageOnContextUpdated(){
    console.log("gamePageOnContextUpdated", this.gameContext);

    this.setScopeFromGameContext();
  }

  setScopeFromGameContext(){
    console.log("setScopeFromGameContext");

    var hasRequiredData = this.gameContext.currentGame 
      && this.gameContext.currentGame.currentRound 
      && this.gameContext.currentGame.currentRound.imposter 
      && this.gameContext.currentGame.currentRound.imposter.player

    if(hasRequiredData)
    {
      this.currentRound = this.gameContext.currentGame.currentRound;
      this.isImposter = this.currentRound.imposter.player.name == this.playerService.currentPlayer.name;
    }
  }

  instantiateForm() {
    this.form = this.formBuilder.group({
      answer: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(50)]]
    });
  }

  async goToSlide(num: number) {
    await this.slides.slideTo(num);
  }

  async submitAnswer() {
    if(!this.form.valid){
      return;
    }

    this.yourAnswer = this.form.value.answer;

    await this.gameService.submitAnswer(this.playerService.currentPlayer, this.yourAnswer);
  }

  async simulateRoundEnd(){
    //this.currentGame.state = GameStates.roundAnswered;

    //this.gameService.setCurrentGame(this.gameService.currentGame);

    await this.appPages.goToChooseImposterPage();
  }
}