using System;
using System.Collections.Generic;

namespace ImposterGame.Model
{
    public interface IOptionGrid
    {
        Guid Id { get; }

        string Name { get; }

        IList<string> Options { get; }
    }
}