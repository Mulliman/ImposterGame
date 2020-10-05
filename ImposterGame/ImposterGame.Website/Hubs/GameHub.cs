using ImposterGame.Model;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ImposterGame.Website.Hubs
{
    public class GameHub : Hub
    {
        public const string GameUpdatedMethodName = "GameUpdate";
        public const string NewPlayerMethodName = "NewPlayer";
        public const string StartRoundMethodName = "StartRound";

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

        #region old
        //public async Task SendGameUpdate(Guid gameId, IGame game)
        //{
        //    await SendGameUpdate((IHubClients)Clients, gameId, game);
        //}

        //public static async Task SendGameUpdate(IHubClients clients, Guid gameId, IGame game)
        //{
        //    await clients.Group(GetGroupName(gameId)).SendAsync(GameUpdatedMethodName, game);
        //}

        //public async Task SendPlayerJoined(Guid gameId, IGame game)
        //{
        //    await SendPlayerJoined((IHubClients)Clients, gameId, game);
        //}

        //public static async Task SendPlayerJoined(IHubClients clients, Guid gameId, IGame game)
        //{
        //    await clients.Group(GetGroupName(gameId)).SendAsync(NewPlayerMethodName, game);
        //}

        //public async Task StartRound(Guid gameId, IGame game)
        //{
        //    await StartRound((IHubClients)Clients, gameId, game);
        //}

        //public static async Task StartRound(IHubClients clients, Guid gameId, IGame game)
        //{
        //    await clients.Group(GetGroupName(gameId)).SendAsync(StartRoundMethodName, game);
        //}
        #endregion

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