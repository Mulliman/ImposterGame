using ImposterGame.Model;
using System.Threading.Tasks;

namespace ImposterGame.Website.Hubs
{
    public interface IGameNotifier
    {
        Task SendAllAccused(IGame game);
        Task SendAllAnswered(IGame game);
        Task SendGameUpdated(IGame game);
        Task SendNewRoundStarted(IGame game);
        Task SendPlayerJoined(IGame game);
    }
}