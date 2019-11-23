using System;

namespace ImposterGame.Model
{
    public interface IAccusation
    {
        Guid PlayerId { get; set; }

        string PlayerName { get; }

        int Wager { get; }
    }
}