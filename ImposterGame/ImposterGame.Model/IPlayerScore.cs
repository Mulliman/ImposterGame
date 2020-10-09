using System;

namespace ImposterGame.Model
{
    public interface IPlayerScore
    {
        Guid Id { get; set; }

        string Name { get; set; }

        int Score { get; set; }
    }
}