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

  instantiateForm() {
    this.form = this.formBuilder.group({
      gameCode: [null, [Validators.required, Validators.minLength(5), Validators.maxLength(5)]]
    });
  }

  async hostGame() {
    try {
      var newGame = await this.gameService.hostGame(this.playerService.currentPlayer);

      console.log("Hosted Game", newGame);
      
      await this.appPages.goToNewRoundPage();
    } catch (e) {
      alert(e);
    }
  }

  async joinGame() {
    try {
      if (!this.form.valid) {
        console.log("join game form invalid", gameCodeValue);
        return;
      }

      var field = this.form.value.gameCode;
      var gameCodeValue = field;

      console.log("join game", gameCodeValue);

      var newGame = await this.gameService.joinGame(this.playerService.currentPlayer, gameCodeValue);

      console.log("joined game", newGame);

      await this.appPages.goToNewRoundPage();

      console.log("gone to new round");
    } catch (e) {
      console.log(e);
    }
  }
}