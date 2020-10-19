using System;
using System.Threading.Tasks;

namespace ImposterGame.Game.Players
{
    public interface IPlayerService
    {
        Task<Player> CreatePlayer(string name);

        Task<Player> GetPlayer(Guid id);
    }
}