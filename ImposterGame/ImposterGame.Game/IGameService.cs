using ImposterGame.Model;
using System;
using System.Threading.Tasks;

namespace ImposterGame.Game
{
    public interface IGameService
    {
        Task<IGame> CreateGame(IPlayer player);

        Task<IGame> GetGame(Guid id);

        Task<IGame> GetGame(string easyCode);

        Task<IGame> JoinGame(IGame game, IPlayer player);

        Task<IGame> LeaveGame(IGame game, IPlayer player);

        Task<IGame> SaveGame(IGame game);

        Task<IGame> StartNewRound(IGame game, IOptionGrid grid);
    }
}