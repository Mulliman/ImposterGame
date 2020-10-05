import { Injectable, OnInit } from "@angular/core";
import { PlayerService } from '../services/player.service';
import { GameModel, GameService, GameContext } from '../services/game.service';
import { AppPagesService } from '../services/app-pages.service';
import { IPlayer } from 'src/server';
import { Game } from '../model/Game';

@Injectable({
    providedIn: 'root'
})
export abstract class BaseGamePage implements OnInit {

    states: string[] = null;

    isLoaded = false;

    // player:IPlayer;
    // currentGame:Game;
    gameContext: GameContext;
    allowedStates: string[];

    constructor(protected playerService: PlayerService,
        protected gameService: GameService,
        protected appPages: AppPagesService) { 
            console.log("Base Game ctor");

            this.allowedStates = this.setAllowedStates();
        }

    async ngOnInit() {
        
    }

    async ionViewWillEnter(){
        await this.playerService.getCurrentPlayer();
        if (this.allowedStates && !this.playerService.currentPlayer)
        {
            console.log("No player, go to you page");
            
            await this.appPages.goToYouPage();
            return;
        } 

        console.log("has player");

        this.gameContext = await this.gameService.getCurrentGameContext(this.playerService.currentPlayer);

        //await this.gameService.getCurrentGame(this.playerService.currentPlayer);
        if (this.allowedStates && !this.gameContext) {

            console.log("No game, go to game page");

            await this.appPages.goToNewGamePage();
            return;
        }

        console.log("has player and game");

        if(!this.isInAllowedState())
        {
            console.log("state is invalid");

            await this.redirectToMostAppropriatePage();
            return;
        }

        console.log("state is valid");

        await this.gamePageOnInit();

        console.log("Base game loaded");
        
        this.isLoaded = true;
    }

    ngOnDestroy() {
        this.isLoaded = false;
        this.gameContext = null;
    }

    abstract setAllowedStates(): string[];

    abstract async gamePageOnInit();

    isInAllowedState() : boolean{

        if(!this.states){
            console.log("In allowed state - No States");
            return true;
        }

        if(!this.gameContext || !this.gameContext.currentGame){
        //     console.log("In allowed state - No game");
        //     debugger;
             return false;
        }

        return true;

        // console.log("Check In allowed state");

        // var isInAllowedState = this.states.includes(this.currentGame.state);

        // console.log("In allowed state?", isInAllowedState, this.currentGame.state);

        // return isInAllowedState;
    }

    // isInAllowedState(){
    //     if(!this.allowedStates){
    //         console.log("In allowed state - No States");
    //         return true;
    //     }

    //     if(!this.currentGame){
    //         console.log("In allowed state - No gane");
    //         return false;
    //     }

    //     console.log("Check In allowed state");

    //     var isInAllowedState = this.allowedStates.includes(this.currentGame.state);

    //     console.log("In allowed state?", isInAllowedState, this.currentGame.state);

    //     return isInAllowedState;
    // }

    async redirectToMostAppropriatePage(){
        await this.appPages.ensureOnMostAppropriatePage(this.playerService.currentPlayer, this.gameContext);
    }
}