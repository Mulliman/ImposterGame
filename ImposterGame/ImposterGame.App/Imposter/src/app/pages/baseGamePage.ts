import { Injectable, OnInit } from "@angular/core";
import { PlayerModel, PlayerService } from '../services/player.service';
import { GameModel, GameService } from '../services/game.service';
import { AppPagesService } from '../services/app-pages.service';

@Injectable({
    providedIn: 'root'
})
export abstract class BaseGamePage implements OnInit {

    isLoaded = false;

    player:PlayerModel;
    currentGame:GameModel;
    allowedStates: string[];

    constructor(protected playerService: PlayerService,
        protected gameService: GameService,
        protected appPages: AppPagesService) { }

    async ngOnInit() {
        this.player = await this.playerService.getCurrentPlayer();
        if (this.allowedStates && !this.player)
        {
            this.appPages.goToYouPage();
            return;
        } 

        this.currentGame = await this.gameService.getCurrentGame();
        if (this.allowedStates && !this.currentGame) {
            this.appPages.goToHomePage();
            return;
        }

        this.allowedStates = this.setAllowedStates();

        if(!this.isInAllowedState())
        {
            this.redirectToMostAppropriatePage();
            return;
        }

        await this.gamePageOnInit();

        this.isLoaded = true;
    }

    abstract setAllowedStates(): string[];

    abstract async gamePageOnInit();

    isInAllowedState(){
        if(!this.allowedStates){
            console.log("In allowed state - No States");
            return true;
        }

        if(!this.currentGame){
            return false;
        }

        var isInAllowedState = this.allowedStates.includes(this.currentGame.state);

        console.log("In allowed state?", isInAllowedState, this.currentGame.state);

        return isInAllowedState;
    }

    redirectToMostAppropriatePage(){
        this.appPages.ensureOnMostAppropriatePage(this.player, this.currentGame);
    }
}