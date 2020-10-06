﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ImposterGame.Game;
using ImposterGame.Game.Exceptions;
using ImposterGame.Game.OptionGrids;
using ImposterGame.Game.Players;
using ImposterGame.Model;
using ImposterGame.Website.Hubs;
using ImposterGame.Website.Models;
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
        private readonly IGameNotifier _gameNotifier;

        public RoundApiController(IGameService gameService,
            IPlayerService playerService,
            IOptionGridService optionGridService,
            IGameNotifier gameNotifier)
        {
            _gameService = gameService;
            _playerService = playerService;
            _optionGridService = optionGridService;
            _gameNotifier = gameNotifier;
        }

        [HttpPost("[action]")]
        public async Task<IGame> NewRound(Guid gameId, Guid gridId)
        {
            var game = await StartNewRound(gameId, gridId);

            await _gameNotifier.SendNewRoundStarted(game);

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

        [HttpPost("[action]")]
        public async Task<IGame> AddAnswer([FromBody] AddAnswerModel model)
        {
            var game = _gameService.GetGame(model.GameId);

            if (game == null)
            {
                throw new GameDoesNotExistException(model.GameId);
            }

            var participant = game.CurrentRound.Participants.FirstOrDefault(p => p.Player.Id == model.PlayerId);

            if (participant == null)
            {
                throw new PlayerDoesNotExistException(model.PlayerId);
            }

            participant.Answer = model.Word;

            var savedGame = _gameService.SaveGame(game);

            if (game.CurrentRound.AllAnswered)
            {
                await _gameNotifier.SendAllAnswered(savedGame);
            }

            return savedGame;
        }
    }
}