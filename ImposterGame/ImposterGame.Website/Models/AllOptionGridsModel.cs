using ImposterGame.Model;
using System.Collections.Generic;

namespace ImposterGame.Website.Models
{
    public class AllOptionGridsModel
    {
        public IEnumerable<IOptionGrid> AllOptionGrids { get; set; }

        public IEnumerable<IOptionGridGroup> AllOptionGridGroups { get; set; }
    }
}