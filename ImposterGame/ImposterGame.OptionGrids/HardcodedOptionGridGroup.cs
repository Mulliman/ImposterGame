using ImposterGame.Model;
using System;
using System.Collections.Generic;
using System.Text;

namespace ImposterGame.OptionGrids
{
    public class HardcodedOptionGridGroup : IOptionGridGroup
    {
        public HardcodedOptionGridGroup()
        {
            OptionGrids = new List<IOptionGrid>();
        }

        public HardcodedOptionGridGroup(Guid id, string name)
        {
            Id = id;
            Name = name;

            OptionGrids = new List<IOptionGrid>();
        }

        public Guid Id { get; set; }

        public string Name { get; set; }

        public IList<IOptionGrid> OptionGrids { get; set; }
    }
}