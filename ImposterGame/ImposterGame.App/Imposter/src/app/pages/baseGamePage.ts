import { Injectable, OnInit } from "@angular/core";
import { PlayerService } from '../services/player.service';
import { GameModel, GameService } from '../services/game.service';
import { GameContext } from "../services/gamecontext.service";
import { AppPagesService } from '../services/app-pages.service';
import { IPlayer } from 'src/server';
import { Game } from '../model/Game';
import { Subscription } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export abstract class BaseGamePage implements OnInit {

    states: string[] = null;

    isLoaded = false;

    ticks: number;

    // player:IPlayer;
    // currentGame:Game;
    gameContext: GameContext;
    allowedStates: string[];
    protected subscriptions = new Subscription();

    constructor(protected playerService: PlayerService,
        protected gameService: GameService,
        protected appPages: AppPagesService) { 
            this.allowedStates = this.setAllowedStates();
        }

    async ngOnInit() {
        
    }

    async ionViewWillEnter(){
        this.ticks = new Date().getTime();

        console.log("ionViewWillEnter ticks set to - " + this.ticks);
        
        await this.playerService.getCurrentPlayer();
        if (this.allowedStates && !this.playerService.currentPlayer)
        {
            console.log("No player, go to you page");
            
            await this.appPages.goToYouPage();
            return;
        } 

        this.gameContext = await this.gameService.getCurrentGameContext(this.playerService.currentPlayer);
        if(this.gameContext){
            this.subscriptions.add(this.gameContext.onGameUpdated.subscribe((game: Game) => this.gamePageOnContextUpdated()));
          }

        if (this.allowedStates && !this.gameContext) {
            await this.appPages.goToNewGamePage();
            return;
        }

        if(!this.isInAllowedState())
        {
            await this.redirectToMostAppropriatePage();
            return;
        }

        await this.gamePageOnInit();
        
        this.isLoaded = true;
    }

    ngOnDestroy() {
        this.isLoaded = false;
        if(this.gameContext && this.subscriptions){
            this.subscriptions.unsubscribe();
        }
    }

    abstract setAllowedStates(): string[];

    abstract async gamePageOnInit();

    async gamePageOnContextUpdated()
    {
        console.log("gamePageOnUpdated - BASE");
    }

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