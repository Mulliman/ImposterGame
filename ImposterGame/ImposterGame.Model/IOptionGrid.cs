using System;
using System.Collections.Generic;
using System.Text;

namespace ImposterGame.Model
{
    public interface IOptionGrid
    {
        Guid Id { get; }

        string Name { get; }

        IList<string> Options { get; }
    }
}