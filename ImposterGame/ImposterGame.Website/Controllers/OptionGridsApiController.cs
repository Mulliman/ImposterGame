using System.Threading.Tasks;
using ImposterGame.Game.OptionGrids;
using ImposterGame.Website.Models;
using Microsoft.AspNetCore.Mvc;

namespace ImposterGame.Website.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OptionGridsApiController : Controller
    {
        private readonly IOptionGridService _optionGridService;

        public OptionGridsApiController(IOptionGridService optionGridService)
        {
            _optionGridService = optionGridService;
        }

        [HttpGet("[action]")]
        public async Task<AllOptionGridsModel> GetAllGridData()
        {
            var grids = await _optionGridService.GetAllOptionGrids();
            var groups =  await _optionGridService.GetAllOptionGridGroups();

            return new AllOptionGridsModel
            {
                AllOptionGridGroups = groups,
                AllOptionGrids = grids
            };
        }
    }
}