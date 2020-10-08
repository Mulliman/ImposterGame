import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { GameModel } from './game.service';
import { GameContext } from "./gamecontext.service";
import { NavController } from '@ionic/angular';
import { GameStates } from '../model/GameStates';
import { IPlayer, IGame } from 'src/server';

@Injectable({
  providedIn: 'root'
})
export class AppPagesService {

  public routes = {
    home: "home",
    you: "you",
    newGame: "new-game",
    newRound: "new-round",
    currentRound: "current-round",
    chooseImposter: "choose-imposter",
    imposterGuess: "imposter-guess",
    goToRoundScores: "round-scores"
  };

  constructor(private navController: NavController) {
  }

  async ensureOnMostAppropriatePage(player: IPlayer, gameContext: GameContext) {
    console.log("ensureOnMostAppropriatePage");
    if (!player) {
      console.log("No player, go to you page");
      await this.goToYouPage();
      return;
    }

    if(!gameContext || !gameContext.currentGame){
      console.log("No game context or current game, go to new game");
      await this.goToNewGamePage();
      return;
    }

    var currentGame = gameContext.currentGame;

    if(currentGame.state == GameStates.roundPending){
      console.log("state is round pending, go to new round");
      
      await this.goToNewRoundPage();
      return;
    }

    if(currentGame.state == GameStates.roundStarted){
      console.log("state is roundStarted, go to round page");
      await this.goToCurrentRoundPage();
      return;
    }

    if(currentGame.state == GameStates.roundAnswered){
      console.log("state is roundAnswered, go to choose imposter page");
      await this.goToChooseImposterPage();
      return;
    }

    // TODO: Add other states here.

    //await this.goToNewGamePage();
  }

  async goToHomePage() {
    console.log("goToHomePage");
    await this.navController.navigateForward([`/${this.routes.home}`]);
  }

  async goToYouPage() {
    console.log("goToYouPage");
    await this.navController.navigateForward([`/${this.routes.you}`]);
  }

  async goToNewGamePage() {
    console.log("goToNewGamePage");
    await this.navController.navigateForward([`/${this.routes.newGame}`]);
  }

  async goToNewRoundPage() {
    console.log("goToNewRoundPage");
    await this.navController.navigateForward([`/${this.routes.newRound}`]);
  }

  async goToCurrentRoundPage() {
    console.log("goToCurrentRoundPage");
    await this.navController.navigateForward([`/${this.routes.currentRound}`]);
  }

  async goToChooseImposterPage() {
    console.log("goToChooseImposterPage");
    await this.navController.navigateForward([`/${this.routes.chooseImposter}`]);
  }

  async goToImposterGuessPage() {
    console.log("goToImposterGuessPage");
    await this.navController.navigateForward([`/${this.routes.imposterGuess}`]);
  }

  async goToRoundScoresPage() {
    console.log("goToRoundScores");
    await this.navController.navigateForward([`/${this.routes.goToRoundScores}`]);
  }
}