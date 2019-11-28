using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using ImposterGame.Game;
using ImposterGame.Game.Players;
using ImposterGame.Model;
using ImposterGame.Website.Controllers.Exceptions;
using ImposterGame.Website.Hubs;
using ImposterGame.Website.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace ImposterGame.Website.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GameApiController : ControllerBase
    {
        private readonly IGameService _gameService;
        private readonly IPlayerService _playerService;
        private readonly IHubContext<GameHub> _hubContext;

        public GameApiController(IGameService gameService,
            IPlayerService playerService)
            //IHubContext<GameHub> hubcontext)
        {
            _gameService = gameService;
            _playerService = playerService;
            //_hubContext = hubcontext;
        }

        [HttpPost("[action]")]
        public IGame Host(Guid playerId)
        {
            var player = _playerService.GetPlayer(playerId);

            if (player == null)
            {
                throw new ApiException("Played not found");
            }

            var updatedGame = _gameService.CreateGame(player);

            return updatedGame;
        }

        [HttpPost("[action]")]
        public async Task<IGame> Join([FromBody]JoinGameModel model)
        {
            var player = _playerService.GetPlayer(model.PlayerId);

            if (player == null)
            {
                throw new ApiException("Player does not exist");
            }

            var game = _gameService.GetGame(model.GameCode);

            var updatedGame = _gameService.JoinGame(game, player);

            //await GameHub.StartRound(_hubContext.Clients, updatedGame.Id, updatedGame);

            //await _hubContext.Clients.Groups(GameHub.GetGroupName(updatedGame.Id)).SendAsync(GameHub.GameUpdatedMethodName, game);

            return updatedGame;
        }

        [HttpGet("[action]")]
        public IGame GetGame(Guid gameId)
        {
            var game = _gameService.GetGame(gameId);

            if (game == null)
            {
                return null;
            }

            return game;
        }
    }
}