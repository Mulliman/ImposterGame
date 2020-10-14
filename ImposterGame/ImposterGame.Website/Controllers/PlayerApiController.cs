using ImposterGame.Game.Players;
using ImposterGame.Model;
using Microsoft.AspNetCore.Mvc;
using System;

namespace ImposterGame.Website.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PlayerApiController : Controller
    {
        private readonly IPlayerService _service;

        public PlayerApiController(IPlayerService service)
        {
            _service = service;
        }

        [HttpPost("[action]")]
        public IPlayer Create(string name)
        {
            var createdPlayer = _service.CreatePlayer(name);

            return createdPlayer;
        }

        [HttpGet("[action]")]
        public IPlayer Get(Guid id)
        {
            var player = _service.GetPlayer(id);

            if (player == null)
            {
                return null;
            }

            return player;
        }
    }
}