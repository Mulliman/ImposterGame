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

    currentGame: Game;
    private hubConnection: signalR.HubConnection;
    private isConnectionActive: boolean = false;

    constructor(private gamePersister: GamePersister) {
    }

    async start(game: Game) {
        if (!this.isConnectionActive) {
            this.currentGame = game;
            this.gamePersister.setCurrentGame(game);
            //this.callback = onUpdatedCallback;
            await this.startConnection(game.id);
            this.onGameUpdated.emit(this.currentGame);
        }
    }
    get hasGameStarted(): boolean {
        return Boolean(this.currentGame);
    }

    //#region Update Game Context
    async updateGameFromServer(serverGame: IGame): Promise<Game> {
        var game = GameFactory.fromServerGame(serverGame, this.currentGame.currentPlayer);
        await this.updateGame(game);
        return game;
    }
    async updateGame(game: Game) {
        this.currentGame = game;
        this.gamePersister.setCurrentGame(game);
        this.onGameUpdated.emit(this.currentGame);
    }
    //#endregion

    //#region Signalr
    private async startConnection(gameId: string) {
        if (this.isConnectionActive) {
            console.log("startConnection - already active");
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
        this.addOnNewPlayerListener();
        this.addStartRoundListener();
        this.addOnAllAnsweredListener();
    }
    async disconnect() {
        if (this.isConnectionActive && this.hubConnection) {
            await this.hubConnection.stop();
        }
    }
    //#endregion

    //#region Listeners
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
    //#endregion

    async delay(ms: number) {
        await new Promise(resolve => setTimeout(() => resolve(), ms));
    }
}