import { Injectable, EventEmitter } from '@angular/core';
import { IGame } from 'src/server';
import { GameFactory, Game } from '../model/Game';
import { environment } from 'src/environments/environment';
import { GamePersister } from "./gamepersister.service";
import * as signalR from "@aspnet/signalr";

@Injectable({
    providedIn: 'root'
})
export class GameContext {

    public onGameUpdated = new EventEmitter<Game>();
    public onPlayersChanged = new EventEmitter<Game>();
    public onRoundStarted = new EventEmitter<Game>();
    public onAllAnswered = new EventEmitter<Game>();
    public onAllAccused = new EventEmitter<Game>();
    public onRoundComplete = new EventEmitter<Game>();
    public onRoundCancelled = new EventEmitter<Game>();
    public onGameCancelled = new EventEmitter<Game>();
    public onKicked = new EventEmitter<Game>();
    
    private _currentGame: Game;

    public get currentGame(): Game{
        return this._currentGame;
    }

    private hubConnection: signalR.HubConnection;
    private isConnectionActive: boolean = false;

    constructor(private gamePersister: GamePersister) {
    }

    async initialiseGame(game: Game) {
        if (!this.isConnectionActive) {
            this._currentGame = game;
            this.gamePersister.setCurrentGame(game);

            await this.startConnection(game.id);

            this.onGameUpdated.emit(this.currentGame);
        }
    }
    get isGameInitialised(): boolean {
        return Boolean(this._currentGame);
    }

    //#region Update Game Context
    async updateGameFromServer(serverGame: IGame): Promise<Game> {
        if(!serverGame){
            console.error("Server game not valid");
            return;
        }

        var game = GameFactory.fromServerGame(serverGame, this.currentGame.currentPlayer);
        await this.updateGame(game);
        return this._currentGame;
    }
    async updateGame(game: Game) {
        this._currentGame = game;
        this.gamePersister.setCurrentGame(this._currentGame);
        this.onGameUpdated.emit(this._currentGame);
    }

    async endGame(){
        this._currentGame = null;
        this.gamePersister.clearSavedGame();
        this.hubConnection = null;
        await this.disconnect();
    }
    //#endregion

    //#region Signalr
    private async startConnection(gameId: string) {
        if (this.isConnectionActive) {
            return;
        }
        this.isConnectionActive = true;
        try {
            this.hubConnection = new signalR.HubConnectionBuilder()
                .withUrl(environment.apiBaseUrl + "/hubs/gamehub")
                .build();
            await this.hubConnection
                .start()
                .then(() => console.log('Connection started'))
                .catch(err => console.log('Error while starting connection: ' + err));
            await this.delay(100);
        }
        catch (e) {
            console.error("Error connecting", e);
            this.isConnectionActive = false;
        }
        try {
            await this.hubConnection.invoke("AddToGroup", gameId);
        }
        catch (e) {
            console.error("Error joining group", e);
            this.isConnectionActive = false;
        }
        await this.addListeners();
    }
    async addListeners() {
        this.addGameUpdateListener();
        this.addOnPlayersChangedListener();
        this.addStartRoundListener();
        this.addOnAllAnsweredListener();
        this.addOnAllAccusedListener();
        this.addOnScoringCompleteListener();
        this.addOnRoundCancelledListener();
        this.addOnGameCancelledListener();
        this.addOnPlayerKickedListener();
    }
    async disconnect() {
        if (this.isConnectionActive && this.hubConnection) {
            await this.hubConnection.stop();
        }

        this.isConnectionActive = false;
    }

    //#endregion

    //#region Listeners
    public addGameUpdateListener = () => {
        this.hubConnection.on('GameUpdate', (data) => {
            console.log("Signal - GameUpdate");            
            this.updateGameFromServer(data);
            this.onGameUpdated.emit(this.currentGame);
        });
    };
    public addOnPlayersChangedListener = () => {
        this.hubConnection.on('NewPlayer', (data) => {
            console.log("Signal - NewPlayer"); 
            this.updateGameFromServer(data);
            this.onPlayersChanged.emit(this.currentGame);
        });
    };
    public addStartRoundListener() {
        this.hubConnection.on('StartRound', async (data) => {
            console.log("Signal - StartRound"); 
            this.updateGameFromServer(data);
            this.onRoundStarted.emit(this.currentGame);
        });
    }
    public addOnAllAnsweredListener = () => {
        this.hubConnection.on('AllAnswered', (data) => {
            console.log("Signal - AllAnswered"); 
            this.updateGameFromServer(data);
            this.onAllAnswered.emit(this.currentGame);
        });
    };
    public addOnAllAccusedListener = () => {
        this.hubConnection.on('AllAccused', (data) => {
            console.log("Signal - AllAccused"); 
            this.updateGameFromServer(data);
            this.onAllAccused.emit(this.currentGame);
        });
    };
    public addOnScoringCompleteListener = () => {
        this.hubConnection.on('ScoringComplete', (data) => {
            console.log("Signal - ScoringComplete"); 
            this.updateGameFromServer(data);
            this.onRoundComplete.emit(this.currentGame);
        });
    };
    public addOnRoundCancelledListener = () => {
        this.hubConnection.on('RoundCancelled', (data) => {
            console.log("Signal - RoundCancelled"); 
            this.updateGameFromServer(data);
            this.onRoundCancelled.emit(this.currentGame);
        });
    };
    public addOnGameCancelledListener = () => {
        this.hubConnection.on('GameCancelled', (data) => {
            console.log("Signal - GameCancelled"); 
            this.updateGameFromServer(null);
            this.onGameCancelled.emit(null);
        });
    };
    public addOnPlayerKickedListener = () => {
        this.hubConnection.on('PlayerKicked', (data) => {
            if(this.currentGame && this.currentGame.currentPlayer && this.currentGame.currentPlayer.name == data.name){
                this.updateGameFromServer(null);
                this.onKicked.emit(null);
            }
        });
    };

    //#endregion

    async delay(ms: number) {
        await new Promise(resolve => setTimeout(() => resolve(), ms));
    }
}