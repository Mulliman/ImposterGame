import { IGame, IPlayer } from 'src/server';

export interface Game extends IGame{
    isHost: boolean;
    isImposter?: boolean;
    currentPlayer: IPlayer;
}

export class GameFactory{
    static fromServerGame(serverGame: IGame, player: IPlayer): Game{
        var game = serverGame as Game;
        game.isHost = serverGame.host.id == player.id;
        game.currentPlayer = player;
        game.isImposter = this.isCurrentlyImposter(game, player);

        return game;
    }

    static isCurrentlyImposter(game: Game, player: IPlayer ){
        if(!game.currentRound || !game.currentRound.imposter || !game.currentRound.imposter.player){
            return null;
        }

        return game.currentRound.imposter.player.name == player.name;
    }
}