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

  gamePageOnInit() {

  }

  instantiateForm() {
    this.form = this.formBuilder.group({
      gameCode: [null, [Validators.required, Validators.minLength(5), Validators.maxLength(5)]]
    });
  }

  async hostGame() {
    try {
      var newGame = await this.gameService.hostGame(this.player);

      await this.appPages.goToNewRoundPage();
    } catch (e) {
      alert(e);
    }
  }

  async joinGame() {
    try {
      if (!this.form.valid) {
        return;
      }

      var field = this.form.value.gameCode;
      var gameCodeValue = field;

      var newGame = await this.gameService.joinGame(this.player, gameCodeValue);

      await this.appPages.goToNewRoundPage();
    } catch (e) {
      console.log(e);
    }
  }
}