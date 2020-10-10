import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
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

  constructor(private navController: NavController,
    @Inject(DOCUMENT) private document: Document) {
  }

  reloadApp(){
    this.document.location.href = '/';
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
    await this.navController.navigateForward([`/${this.routes.home}`], this.getNoCachingParams());
  }

  async goToYouPage() {
    console.log("goToYouPage");
    await this.navController.navigateForward([`/${this.routes.you}`], this.getNoCachingParams());
  }

  async goToNewGamePage() {
    console.log("goToNewGamePage");
    await this.navController.navigateForward([`/${this.routes.newGame}`], this.getNoCachingParams());
  }

  async goToNewRoundPage() {
    console.log("goToNewRoundPage");
    await this.navController.navigateForward([`/${this.routes.newRound}`], this.getNoCachingParams());
  }

  async goToCurrentRoundPage() {
    console.log("goToCurrentRoundPage");
    await this.navController.navigateForward([`/${this.routes.currentRound}`], this.getNoCachingParams());
  }

  async goToChooseImposterPage() {
    console.log("goToChooseImposterPage");
    await this.navController.navigateForward([`/${this.routes.chooseImposter}`], this.getNoCachingParams());
  }

  async goToImposterGuessPage() {
    console.log("goToImposterGuessPage");
    await this.navController.navigateForward([`/${this.routes.imposterGuess}`], this.getNoCachingParams());
  }

  async goToRoundScoresPage() {
    console.log("goToRoundScores");
    //await this.navController.navigateForward([`/${this.routes.goToRoundScores}`]);

    this.document.location.href = `/${this.routes.goToRoundScores}`;
  }

  private getNoCachingParams(){
    return {queryParams: { nocache: new Date().getTime() }};
  }
}