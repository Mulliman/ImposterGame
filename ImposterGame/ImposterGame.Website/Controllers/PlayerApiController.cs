using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ImposterGame.Game.Players;
using ImposterGame.Model;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

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