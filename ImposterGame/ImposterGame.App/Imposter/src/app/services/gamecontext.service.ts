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
        var game = GameFactory.fromServerGame(serverGame, this.currentGame.currentPlayer);
        await this.updateGame(game);
        return this._currentGame;
    }
    async updateGame(game: Game) {
        this._currentGame = game;
        this.gamePersister.setCurrentGame(this._currentGame);
        this.onGameUpdated.emit(this._currentGame);
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
        this.addOnNewPlayerListener();
        this.addStartRoundListener();
        this.addOnAllAnsweredListener();
        this.addOnAllAccusedListener();
        this.addOnScoringCompleteListener();
    }
    async disconnect() {
        
        if (this.isConnectionActive && this.hubConnection) {
            await this.hubConnection.stop();
        }
    }
    //#endregion

    //#region Listeners
    public addGameUpdateListener = () => {
        this.hubConnection.on('GameUpdate', (data) => {
            this.updateGameFromServer(data);
            this.onGameUpdated.emit(this.currentGame);
        });
    };
    public addOnNewPlayerListener = () => {
        this.hubConnection.on('NewPlayer', (data) => {
            this.updateGameFromServer(data);
            this.onPlayersChanged.emit(this.currentGame);
        });
    };
    public addStartRoundListener() {
        this.hubConnection.on('StartRound', async (data) => {
            this.updateGameFromServer(data);
            this.onRoundStarted.emit(this.currentGame);
        });
    }
    public addOnAllAnsweredListener = () => {
        this.hubConnection.on('AllAnswered', (data) => {
            this.updateGameFromServer(data);
            this.onAllAnswered.emit(this.currentGame);
        });
    };
    public addOnAllAccusedListener = () => {
        this.hubConnection.on('AllAccused', (data) => {
            this.updateGameFromServer(data);
            this.onAllAccused.emit(this.currentGame);
        });
    };
    public addOnScoringCompleteListener = () => {
        this.hubConnection.on('ScoringComplete', (data) => {
            this.updateGameFromServer(data);
            this.onRoundComplete.emit(this.currentGame);
        });
    };
    
    //#endregion

    async delay(ms: number) {
        await new Promise(resolve => setTimeout(() => resolve(), ms));
    }
}