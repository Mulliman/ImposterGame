import { IGame, IPlayer } from 'src/server';

export interface Game extends IGame{
    isHost: boolean;
    currentPlayer: IPlayer;
}