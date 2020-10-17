using ImposterGame.Model;
using Microsoft.AspNetCore.SignalR;
using System;
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
            if (game != null)
            {
                await _hubContext.Clients.Groups(GameHub.GetGroupName(game.Id)).SendAsync(GameHub.GameUpdatedMethodName, game);
            }
        }

        public async Task SendPlayerJoined(IGame game)
        {
            if (game != null)
            {
                await _hubContext.Clients.Groups(GameHub.GetGroupName(game.Id)).SendAsync(GameHub.NewPlayerMethodName, game);
            }
        }

        public async Task SendNewRoundStarted(IGame game)
        {
            if (game != null)
            {
                await _hubContext.Clients.Groups(GameHub.GetGroupName(game.Id)).SendAsync(GameHub.StartRoundMethodName, game);
            }
        }

        public async Task SendAllAnswered(IGame game)
        {
            if (game != null)
            {
                await _hubContext.Clients.Groups(GameHub.GetGroupName(game.Id)).SendAsync(GameHub.AllAnsweredMethodName, game);
            }
        }

        public async Task SendAllAccused(IGame game)
        {
            if (game != null)
            {
                await _hubContext.Clients.Groups(GameHub.GetGroupName(game.Id)).SendAsync(GameHub.AllAccusedMethodName, game);
            }
        }

        public async Task SendScoringComplete(IGame game)
        {
            if (game != null)
            {
                await _hubContext.Clients.Groups(GameHub.GetGroupName(game.Id)).SendAsync(GameHub.ScoringCompleteMethodName, game);
            }
        }

        public async Task SendRoundCancelled(IGame game)
        {
            if (game != null)
            {
                await _hubContext.Clients.Groups(GameHub.GetGroupName(game.Id)).SendAsync(GameHub.RoundCancelledMethodName, game);
            }
        }

        public async Task SendGameCancelled(Guid gameId)
        {
            await _hubContext.Clients.Groups(GameHub.GetGroupName(gameId)).SendAsync(GameHub.GameCancelledMethodName);
        }

        public async Task SendPlayerKicked(Guid gameId, IPlayer player)
        {
            await _hubContext.Clients.Groups(GameHub.GetGroupName(gameId)).SendAsync(GameHub.PlayerKickedMethodName, player);
        }
    }
}