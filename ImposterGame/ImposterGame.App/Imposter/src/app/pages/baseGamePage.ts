import { Injectable, OnInit } from "@angular/core";
import { PlayerService } from '../services/player.service';
import { GameModel, GameService } from '../services/game.service';
import { GameContext } from "../services/gamecontext.service";
import { AppPagesService } from '../services/app-pages.service';
import { IPlayer } from 'src/server';
import { Game } from '../model/Game';
import { Subscription } from 'rxjs';
import { UiService } from '../services/ui.service';

@Injectable({
    providedIn: 'root'
})
export abstract class BaseGamePage implements OnInit {

    states: string[] = null;

    isLoaded = false;

    ticks: number;

    public gameContext: GameContext;
    allowedStates: string[];
    protected subscriptions = new Subscription();

    constructor(public playerService: PlayerService,
        public gameService: GameService,
        public appPages: AppPagesService) { 
            this.allowedStates = this.setAllowedStates();
        }

    async ngOnInit() {
        
    }

    async ionViewWillEnter(){
        this.ticks = new Date().getTime();

        console.log("ionViewWillEnter ticks set to - " + this.ticks);
        console.log("ionViewWillEnter location = " + window.location.href);
        
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

    async ionViewWillLeave(){
        this.isLoaded = false;
        await this.gamePageOnLeave();
    }

    ngOnDestroy() {
        this.isLoaded = false;
        if(this.gameContext && this.subscriptions){
            this.subscriptions.unsubscribe();
        }
    }

    abstract setAllowedStates(): string[];

    abstract async gamePageOnInit();

    abstract async gamePageOnLeave();

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
            return false;
        }

        console.log("Check In allowed state");

        var isInAllowedState = this.states.includes(this.gameContext.currentGame.state);

        console.log("In allowed state?", isInAllowedState, this.gameContext.currentGame.state);

        return isInAllowedState;
    }

    async redirectToMostAppropriatePage(){
        await this.appPages.ensureOnMostAppropriatePage(this.playerService.currentPlayer, this.gameContext);
    }

    async doRefresh($event){
        this.appPages.reloadApp();
    }
}