import { IGame, IPlayer, IRoundParticipant } from 'src/server';

export interface Game extends IGame{
    isHost: boolean;
    isImposter?: boolean;
    wasImposterLastRound?: boolean;
    currentPlayer: IPlayer;
}

export class GameFactory{
    static fromServerGame(serverGame: IGame, player: IPlayer): Game{
        var game = serverGame as Game;
        game.isHost = serverGame.host.id == player.id;
        game.currentPlayer = player;
        game.isImposter = this.isCurrentlyImposter(game, player);
        game.wasImposterLastRound = this.wasImposterLastRound(game, player);
        return game;
    }

    static isCurrentlyImposter(game: Game, player: IPlayer ){
        if(!game.currentRound || !game.currentRound.imposter || !game.currentRound.imposter.player){
            return null;
        }

        return game.currentRound.imposter.player.name == player.name;
    }

    static wasImposterLastRound(game: Game, player: IPlayer ){
        if(!game.previousRound || !game.previousRound.imposter || !game.previousRound.imposter.player){
            return null;
        }

        return game.previousRound.imposter.player.name == player.name;
    }
}

export class GameHelpers{
    public static getPlayerFromId(game: Game, playerId:string) : IPlayer{
        if(!game || !game.players){
            return null;
        }

        var matchingPlayers = game.players.filter(p => p.id == playerId);

        if(!matchingPlayers){
            return null;
        }

        return matchingPlayers[0];
    }

    public static getPlayersParticipant(game: Game) : IRoundParticipant{
        if(!game || !game.currentPlayer){
            return null;
        }

        if(!game.currentRound || !game.currentRound.participants){
            return null;
        }

        var matchingPlayers = game.currentRound.participants.filter(p => p.player && p.player.id == game.currentPlayer.id);

        if(!matchingPlayers){
            return null;
        }

        return matchingPlayers[0];
    }

    public static hasAccused(game: Game) : boolean{
        var participant = this.getPlayersParticipant(game);

        if(!participant){
            return false;
        }

        return !!participant.accusation;
    }
}