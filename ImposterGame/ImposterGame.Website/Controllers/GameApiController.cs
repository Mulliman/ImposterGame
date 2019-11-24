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
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ImposterGame.Website.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GameApiController : ControllerBase
    {
        private readonly IGameService _gameService;
        private readonly IPlayerService _playerService;

        public GameApiController(IGameService gameService, IPlayerService playerService)
        {
            _gameService = gameService;
            _playerService = playerService;
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
    }
}