using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ImposterGame.Game;
using ImposterGame.Game.Exceptions;
using ImposterGame.Game.OptionGrids;
using ImposterGame.Game.Players;
using ImposterGame.Model;
using ImposterGame.Website.Hubs;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace ImposterGame.Website.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoundApiController : ControllerBase
    {
        private readonly IGameService _gameService;
        private readonly IPlayerService _playerService;
        private readonly IOptionGridService _optionGridService;
        private readonly IHubContext<GameHub> _hubContext;

        public RoundApiController(IGameService gameService,
            IPlayerService playerService,
            IOptionGridService optionGridService,
            IHubContext<GameHub> hubcontext)
        {
            _gameService = gameService;
            _playerService = playerService;
            _optionGridService = optionGridService;
            _hubContext = hubcontext;
        }

        [HttpPost("[action]")]
        public async Task<IGame> NewRound(Guid gameId, Guid gridId)
        {
            var game = await StartNewRound(gameId, gridId);

            await _hubContext.Clients.Group(GameHub.GetGroupName(game.Id)).SendAsync("StartRound", game);

            return game;
        }

        private async Task<IGame> StartNewRound(Guid gameId, Guid gridId)
        {
            var game = _gameService.GetGame(gameId);

            if (game == null)
            {
                throw new GameDoesNotExistException(gameId);
            }

            var grid = await _optionGridService.GetOptionGrid(gridId);

            if(grid == null)
            {
                throw new GridDoesNotExistException(gridId);
            }

            return _gameService.StartNewRound(game, grid);
        }
    }
}