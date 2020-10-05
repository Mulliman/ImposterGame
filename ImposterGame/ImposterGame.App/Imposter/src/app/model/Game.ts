import { IGame, IPlayer } from 'src/server';

export interface Game extends IGame{
    isHost: boolean;
    currentPlayer: IPlayer;
}

export class GameFactory{
    static fromServerGame(serverGame: IGame, player: IPlayer): Game{
        var game = serverGame as Game;
        game.isHost = serverGame.host.id == player.id;
        game.currentPlayer = player;

        console.log("fromServerGame - server game", serverGame);
        console.log("fromServerGame - updated game", game);
        
        return game;
    }
}