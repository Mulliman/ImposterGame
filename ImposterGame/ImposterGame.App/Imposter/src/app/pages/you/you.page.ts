import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { BaseGamePage } from '../baseGamePage';
import { PlayerService } from 'src/app/services/player.service';
import { GameService } from 'src/app/services/game.service';
import { AppPagesService } from 'src/app/services/app-pages.service';
import { BaseGameFormPage } from '../baseGameFormPage';

@Component({
  selector: 'app-you',
  templateUrl: './you.page.html',
  styleUrls: ['./you.page.scss'],
})
export class YouPage extends BaseGameFormPage {
  
  constructor(playerService: PlayerService,
    gameService: GameService,
    appPages: AppPagesService,
    formBuilder: FormBuilder) {
    super(playerService, gameService, appPages, formBuilder);
  }

  setAllowedStates(): string[] {
    // No game setup yet, so all states are technically allowed.
    return null;
  }

  gamePageOnInit() {
    if(this.player){
      this.form.patchValue({
        name: this.player.name
      });
    }
  }

  instantiateForm() {
    this.form = this.formBuilder.group({
      name: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(15)]]
    });
  }

  async saveName() {
    try {

      if(!this.form.valid){
        return;
      }

      let name = this.form.get("name").value;
      await this.playerService.setCurrentPlayer(name);

      await this.appPages.goToNewGamePage();
    } catch (e) {
      alert("Error saving name.");
      console.log(e);
    }
  }

  async goToNewGame(){
    await this.appPages.goToNewGamePage();
  }

  async leaveGame(){
    await this.gameService.leaveGame(this.player, this.currentGame.easyCode);
  }
}