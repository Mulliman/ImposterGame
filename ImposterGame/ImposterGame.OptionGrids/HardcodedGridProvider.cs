using ImposterGame.Game.OptionGrids;
using ImposterGame.Model;
using ImposterGame.OptionGrids.Basics;
using ImposterGame.OptionGrids.FilmAndTv.HarryPotter;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ImposterGame.OptionGrids
{
    public class HardcodedGridProvider : IOptionGridProvider
    {
        public static IDictionary<Guid, HardcodedOptionGridGroup> AllOptionGridGroups = new Dictionary<Guid, HardcodedOptionGridGroup>();
        public static IDictionary<Guid, HardcodedOptionGrid> AllOptionGrids = new Dictionary<Guid, HardcodedOptionGrid>();

        static HardcodedGridProvider()
        {
            RegisterOptionGrid(new HarryPotterObjects(), new FilmsAndTvGroup());
            RegisterOptionGrid(new HarryPotterCharacters(), new FilmsAndTvGroup());
            RegisterOptionGrid(new Rooms(), new BasicsGroup());
            RegisterOptionGrid(new Colours(), new BasicsGroup());
        }

        public async Task<IEnumerable<IOptionGridGroup>> GetAllOptionGridGroups()
        {
            return AllOptionGridGroups.Select(x => x.Value);
        }

        public async Task<IEnumerable<IOptionGrid>> GetAllOptionGrids()
        {
            return AllOptionGrids.Select(x => x.Value);
        }

        public async Task<IOptionGrid> GetOptionGrid(Guid id)
        {
            if (!AllOptionGrids.ContainsKey(id))
            {
                return null;
            }

            return AllOptionGrids[id];
        }

        public async Task<IOptionGridGroup> GetOptionGridGroup(Guid id)
        {
            if (!AllOptionGridGroups.ContainsKey(id))
            {
                return null;
            }

            return AllOptionGridGroups[id];
        }

        public static void RegisterOptionGrid(HardcodedOptionGrid grid, params HardcodedOptionGridGroup[] groups)
        {
            AllOptionGrids.Add(grid.Id, grid);

            foreach (var group in groups)
            {
                var hasOptionGroup = AllOptionGridGroups.ContainsKey(group.Id);

                if (!hasOptionGroup)
                {
                    AllOptionGridGroups.Add(group.Id, group);
                }

                AllOptionGridGroups[group.Id].OptionGrids.Add(grid);
            }
        }
    }
}