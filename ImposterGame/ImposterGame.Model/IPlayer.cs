using System;

namespace ImposterGame.Model
{
    public interface IPlayer
    {
        Guid Id { get; }

        string Name { get; }
    }
}