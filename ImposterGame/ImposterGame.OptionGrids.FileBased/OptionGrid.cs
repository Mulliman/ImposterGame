using ImposterGame.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace ImposterGame.OptionGrids
{
    public class OptionGrid : IOptionGrid
    {
        public OptionGrid(Guid id, string name)
        {
            Id = id;
            Name = name;
        }

        public OptionGrid(Guid id, string name, IEnumerable<string> options)
        {
            Id = id;
            Name = name;

            Options = options.ToList();
        }

        public Guid Id { get; }

        public string Name { get; }

        public virtual IList<string> Options { get; }

        public string[] Groups { get; set; }
    }
}