using ImposterGame.Game.Options;
using ImposterGame.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ImposterGame.Website.Models
{
    public class AllOptionGridsModel
    {
        public IEnumerable<IOptionGrid> AllOptionGrids { get; set; }

        public IEnumerable<IOptionGridGroup> AllOptionGridGroups { get; set; }
    }
}