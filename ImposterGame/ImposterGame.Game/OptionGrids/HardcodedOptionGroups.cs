using ImposterGame.Model;
using System;
using System.Collections.Generic;

namespace ImposterGame.Game.Options
{
    public static class HardcodedOptionGroups
    {
        public static IDictionary<Guid, IOptionGridGroup> AllOptionGridGroups = new Dictionary<Guid, IOptionGridGroup>();

        public static IDictionary<Guid, IOptionGrid> AllOptionGrids = new Dictionary<Guid, IOptionGrid>();

        public static void RegisterOptionGrid(IOptionGrid grid, params IOptionGridGroup[] groups)
        {
            AllOptionGrids.Add(grid.Id, grid);

            foreach(var group in groups)
            {
                var hasOptionGroup = AllOptionGridGroups.ContainsKey(group.Id);

                if(!hasOptionGroup)
                {
                    AllOptionGridGroups.Add(group.Id, group);
                }

                AllOptionGridGroups[group.Id].OptionGrids.Add(grid);
            }
        }
    }
}