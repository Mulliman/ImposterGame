using ImposterGame.Model;
using System;

namespace ImposterGame.Game.Options
{
    public class SpecificOptionGridSelector : IOptionGridSelector
    {
        public SpecificOptionGridSelector(Guid id)
        {
            Id = id;
        }

        public Guid Id { get; }

        public IOptionGrid GetOptionGrid()
        {
            return HardcodedOptionGroups.AllOptionGrids[Id];
        }
    }
}