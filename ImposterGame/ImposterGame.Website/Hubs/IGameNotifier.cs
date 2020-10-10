using ImposterGame.Model;
using System;
using System.Threading.Tasks;

namespace ImposterGame.Website.Hubs
{
    public interface IGameNotifier
    {
        Task SendAllAccused(IGame game);
        Task SendAllAnswered(IGame game);
        Task SendGameCancelled(Guid gameId);
        Task SendGameUpdated(IGame game);
        Task SendNewRoundStarted(IGame game);
        Task SendPlayerJoined(IGame game);
        Task SendRoundCancelled(IGame game);
        Task SendScoringComplete(IGame game);
    }
}