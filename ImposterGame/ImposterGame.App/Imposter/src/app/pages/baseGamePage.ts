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
        if (!this.player)
        {
            this.appPages.goToYouPage();
            return;
        } 

        this.currentGame = await this.gameService.getCurrentGame();
        if (!this.currentGame) {
            this.appPages.goToHomePage();
            return;
        }

        this.setAllowedStates();

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
            return true;
        }

        return this.allowedStates.includes(this.currentGame.state);
    }

    redirectToMostAppropriatePage(){
        this.appPages.ensureOnMostAppropriatePage(this.player, this.currentGame);
    }
}