using ImposterGame.Model;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Threading.Tasks;

namespace ImposterGame.Website.Hubs
{
    public class GameHub : Hub
    {
        public const string GameUpdatedMethodName = "GameUpdate";
        public const string NewPlayerMethodName = "NewPlayer";
        public const string StartRoundMethodName = "StartRound";
        public const string AllAnsweredMethodName = "AllAnswered";
        public const string AllAccusedMethodName = "AllAccused";
        public const string ScoringCompleteMethodName = "ScoringComplete";
        public const string RoundCancelledMethodName = "RoundCancelled";
        public const string GameCancelledMethodName = "GameCancelled";
        public const string PlayerKickedMethodName = "PlayerKicked";

        public async Task SendGameUpdate(Guid gameId, IGame game)
        {
            await Clients.Group(GetGroupName(gameId)).SendAsync(GameUpdatedMethodName, game);
        }

        public async Task StartRound(Guid gameId, IGame game)
        {
            await Clients.Group(GetGroupName(gameId)).SendAsync(StartRoundMethodName, game);
        }

        public async Task SendPlayerJoined(Guid gameId, IGame game)
        {
            await Clients.Group(GetGroupName(gameId)).SendAsync(NewPlayerMethodName, game);
        }

        public async Task SendAllAnswered(Guid gameId, IGame game)
        {
            await Clients.Group(GetGroupName(gameId)).SendAsync(AllAnsweredMethodName, game);
        }

        public async Task SendAllAccused(Guid gameId, IGame game)
        {
            await Clients.Group(GetGroupName(gameId)).SendAsync(AllAccusedMethodName, game);
        }

        public async Task SendScoringComplete(Guid gameId, IGame game)
        {
            await Clients.Group(GetGroupName(gameId)).SendAsync(ScoringCompleteMethodName, game);
        }

        public async Task SendRoundCancelled(Guid gameId, IGame game)
        {
            await Clients.Group(GetGroupName(gameId)).SendAsync(RoundCancelledMethodName, game);
        }

        public async Task SendGameCancelled(Guid gameId, IGame game)
        {
            await Clients.Group(GetGroupName(gameId)).SendAsync(GameCancelledMethodName, game);
        }

        public async Task SendPlayerKicked(Guid gameId, IPlayer player)
        {
            await Clients.Group(GetGroupName(gameId)).SendAsync(PlayerKickedMethodName, player);
        }

        public Task AddToGroup(Guid gameId)
        => Groups.AddToGroupAsync(Context.ConnectionId, GetGroupName(gameId));

        public Task RemoveFromGroup(Guid gameId)
            => Groups.RemoveFromGroupAsync(Context.ConnectionId, GetGroupName(gameId));

        public static string GetGroupName(Guid gameId)
        {
            return gameId.ToString();
        }
    }
}