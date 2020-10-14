using ImposterGame.Model;
using System;

namespace ImposterGame.Game
{
    public interface IGameService
    {
        IGame CreateGame(IPlayer player);

        IGame GetGame(Guid id);

        IGame GetGame(string easyCode);

        IGame JoinGame(IGame game, IPlayer player);

        IGame LeaveGame(IGame game, IPlayer player);

        IGame SaveGame(IGame game);

        IGame StartNewRound(IGame game, IOptionGrid grid);
    }
}