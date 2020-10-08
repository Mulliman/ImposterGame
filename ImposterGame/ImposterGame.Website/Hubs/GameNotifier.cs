using ImposterGame.Model;
using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace ImposterGame.Website.Hubs
{
    public class GameNotifier : IGameNotifier
    {
        private readonly IHubContext<GameHub> _hubContext;

        public GameNotifier(IHubContext<GameHub> context)
        {
            _hubContext = context;
        }

        public async Task SendGameUpdated(IGame game)
        {
            await _hubContext.Clients.Groups(GameHub.GetGroupName(game.Id)).SendAsync(GameHub.GameUpdatedMethodName, game);
        }

        public async Task SendPlayerJoined(IGame game)
        {
            await _hubContext.Clients.Groups(GameHub.GetGroupName(game.Id)).SendAsync(GameHub.NewPlayerMethodName, game);
        }

        public async Task SendNewRoundStarted(IGame game)
        {
            await _hubContext.Clients.Groups(GameHub.GetGroupName(game.Id)).SendAsync(GameHub.StartRoundMethodName, game);
        }

        public async Task SendAllAnswered(IGame game)
        {
            await _hubContext.Clients.Groups(GameHub.GetGroupName(game.Id)).SendAsync(GameHub.AllAnsweredMethodName, game);
        }

        public async Task SendAllAccused(IGame game)
        {
            await _hubContext.Clients.Groups(GameHub.GetGroupName(game.Id)).SendAsync(GameHub.AllAccusedMethodName, game);
        }

        public async Task SendScoringComplete(IGame game)
        {
            await _hubContext.Clients.Groups(GameHub.GetGroupName(game.Id)).SendAsync(GameHub.ScoringCompleteMethodName, game);
        }
    }
}