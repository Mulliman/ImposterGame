import { Component, OnInit } from '@angular/core';
import { BaseGameFormPage } from '../baseGameFormPage';
import { PlayerService } from 'src/app/services/player.service';
import { GameService } from 'src/app/services/game.service';
import { AppPagesService } from 'src/app/services/app-pages.service';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-new-game',
  templateUrl: './new-game.page.html',
  styleUrls: ['./new-game.page.scss'],
})
export class NewGamePage extends BaseGameFormPage {
  submittingHost: boolean;
  submittingJoin: boolean;

  constructor(playerService: PlayerService,
    gameService: GameService,
    appPages: AppPagesService,
    formBuilder: FormBuilder) {
    super(playerService, gameService, appPages, formBuilder);
  }

  setAllowedStates(): string[] {
    return null;
  }

  async gamePageOnInit() {
    if(!this.playerService.currentPlayer){
      await this.appPages.goToYouPage();
    }
  }

  async gamePageOnLeave(){
    
  }

  instantiateForm() {
    this.form = this.formBuilder.group({
      gameCode: [null, [Validators.required, Validators.minLength(5), Validators.maxLength(5), Validators.pattern('^[a-zA-Z0-9]+$')]]
    });
  }

  async hostGame() {
    try {
      this.submittingHost = true;
      var newGame = await this.gameService.hostGame(this.playerService.currentPlayer);
      this.submittingHost = false;

      await this.appPages.goToNewRoundPage();
    } catch (e) {
      this.submittingHost = false;
    }
  }

  async joinGame() {
    try {
      if (!this.form.valid) {
        console.error("join game form invalid", gameCodeValue);
        return;
      }

      var field = this.form.value.gameCode;
      var gameCodeValue = field;

      this.submittingJoin = true;
      var newGame = await this.gameService.joinGame(this.playerService.currentPlayer, gameCodeValue);
      this.submittingJoin = false;

      await this.appPages.goToNewRoundPage();
    } catch (e) {
      this.submittingJoin = false;
      console.log(e);
    }
  }
}