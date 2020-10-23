using ImposterGame.Game;
using ImposterGame.Game.Exceptions;
using ImposterGame.Game.Players;
using ImposterGame.Model;
using ImposterGame.Website.Controllers.Exceptions;
using ImposterGame.Website.Hubs;
using ImposterGame.Website.Models;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace ImposterGame.Website.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GameApiController : ControllerBase
    {
        private readonly IGameService _gameService;
        private readonly IPlayerService _playerService;
        private readonly IGameNotifier _gameNotifier;

        public GameApiController(IGameService gameService,
            IPlayerService playerService,
            IGameNotifier gameNotifier)
        {
            _gameService = gameService;
            _playerService = playerService;
            _gameNotifier = gameNotifier;
        }

        [HttpPost("[action]")]
        public async Task<IGame> Host(Guid playerId)
        {
            var player = await _playerService.GetPlayer(playerId);

            if (player == null)
            {
                throw new ApiException("Played not found");
            }

            var updatedGame = await _gameService.CreateGame(player);

            return updatedGame;
        }

        [HttpPost("[action]")]
        public async Task<IGame> Join([FromBody]JoinGameModel model)
        {
            var player = await _playerService.GetPlayer(model.PlayerId);

            if (player == null)
            {
                throw new ApiException("Player does not exist");
            }

            var game = await _gameService.GetGame(model.GameCode);

            var updatedGame = await _gameService.JoinGame(game, player);

            await _gameNotifier.SendPlayerJoined(updatedGame);

            return updatedGame;
        }

        [HttpGet("[action]")]
        public async Task<IGame> GetGame(Guid gameId)
        {
            var game = await _gameService.GetGame(gameId);

            if (game == null)
            {
                return null;
            }

            return game;
        }

        [HttpDelete("[action]")]
        public async Task<IGame> CancelCurrentRound(Guid gameId)
        {
            var game = await _gameService.GetGame(gameId);

            var updatedGame = await _gameService.CancelRound(game);

            await _gameNotifier.SendRoundCancelled(updatedGame);

            return updatedGame;
        }

        [HttpPost("[action]")]
        public async Task<IGame> Leave([FromBody]JoinGameModel model)
        {
            var player = await _playerService.GetPlayer(model.PlayerId);

            if (player == null)
            {
                throw new PlayerDoesNotExistException(model.PlayerId);
            }

            var game = await _gameService.GetGame(model.GameCode);
            var gameId = game.Id;

            var mustCancelRound = !game.CanLeaveWithoutRoundCancellation;
            var mustCancelGame = game.Host.Id == model.PlayerId;

            var updatedGame = await _gameService.LeaveGame(game, player);

            await _gameNotifier.SendPlayerJoined(updatedGame);

            if (model.WasKicked)
            {
                await _gameNotifier.SendPlayerKicked(game.Id, player);
            }
            
            if (mustCancelGame)
            {
                await _gameNotifier.SendGameCancelled(gameId);
            }
            else if (mustCancelRound)
            {
                await _gameNotifier.SendRoundCancelled(updatedGame);
            }

            return updatedGame;
        }

        [HttpGet("[action]")]
        public string Test()
        {
            return "Hello, World!";
        }
    }
}