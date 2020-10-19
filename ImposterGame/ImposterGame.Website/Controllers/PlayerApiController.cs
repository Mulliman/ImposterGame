using ImposterGame.Game.Players;
using ImposterGame.Model;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

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
        public async Task<IPlayer> Create(string name)
        {
            var createdPlayer = await _service.CreatePlayer(name);

            return createdPlayer;
        }

        [HttpGet("[action]")]
        public async Task<IPlayer> Get(Guid id)
        {
            var player = await _service.GetPlayer(id);

            if (player == null)
            {
                return null;
            }

            return player;
        }
    }
}