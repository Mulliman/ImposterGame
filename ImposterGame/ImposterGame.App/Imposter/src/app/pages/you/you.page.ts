import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { BaseGamePage } from '../baseGamePage';
import { PlayerService } from 'src/app/services/player.service';
import { GameService } from 'src/app/services/game.service';
import { AppPagesService } from 'src/app/services/app-pages.service';
import { BaseGameFormPage } from '../baseGameFormPage';
import { UiService } from 'src/app/services/ui.service';

@Component({
  selector: 'app-you',
  templateUrl: './you.page.html',
  styleUrls: ['./you.page.scss'],
})
export class YouPage extends BaseGameFormPage {
  formSubmitting: boolean;
  
  constructor(playerService: PlayerService,
    gameService: GameService,
    appPages: AppPagesService,
    formBuilder: FormBuilder,
    private uiService: UiService) {
    super(playerService, gameService, appPages, formBuilder);
  }

  setAllowedStates(): string[] {
    // No game setup yet, so all states are technically allowed.
    return null;
  }

  gamePageOnInit() {
    if(this.playerService.currentPlayer){
      this.form.patchValue({
        name: this.playerService.currentPlayer.name
      });
    }
  }

  async gamePageOnLeave(){
    
  }

  instantiateForm() {
    this.form = this.formBuilder.group({
      name: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(10), Validators.pattern('^[a-zA-Z0-9]+$')]]
    });
  }

  async saveName() {
    try {

      if(!this.form.valid){
        return;
      }

      let name = this.form.get("name").value;

      this.formSubmitting = true;
      await this.playerService.setCurrentPlayer(name);
      this.formSubmitting = false;

      await this.appPages.goToNewGamePage();
    } catch (e) {
      this.uiService.errorToast("There was an error saving your name.");
      console.log(e);
      this.formSubmitting = false;
    }
  }

  async goToNewGame(){
    await this.appPages.goToNewGamePage();
  }

  async leaveGame(){
    await this.gameService.leaveGame(this.playerService.currentPlayer, this.gameContext.currentGame.easyCode);
  }
}