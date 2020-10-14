using ImposterGame.Model;
using System;
using System.Collections.Generic;
using System.Linq;

namespace ImposterGame.OptionGrids
{
    public class OptionGridGroup : IOptionGridGroup
    {
        public OptionGridGroup()
        {
            OptionGrids = new List<IOptionGrid>();
        }

        public OptionGridGroup(Guid id, string name)
        {
            Id = id;
            Name = name;

            OptionGrids = new List<IOptionGrid>();
        }

        public OptionGridGroup(Guid id, string name, IEnumerable<IOptionGrid> grids)
        {
            Id = id;
            Name = name;

            OptionGrids = grids.ToList();
        }

        public Guid Id { get; set; }

        public string Name { get; set; }

        public IList<IOptionGrid> OptionGrids { get; set; }
    }
}