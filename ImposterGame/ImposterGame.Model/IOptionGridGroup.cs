using System;
using System.Collections.Generic;

namespace ImposterGame.Model
{
    public interface IOptionGridGroup
    {
        Guid Id { get; set; }

        string Name { get; set; }

        IList<IOptionGrid> OptionGrids { get; set; }
    }
}