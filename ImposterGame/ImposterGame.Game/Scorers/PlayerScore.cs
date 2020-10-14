using ImposterGame.Model;
using System;

namespace ImposterGame.Game.Scorers
{
    public class PlayerScore : IPlayerScore
    {
        public PlayerScore(IPlayer player, int score)
        {
            Id = player.Id;
            Name = player.Name;
            Score = score;
        }

        public Guid Id { get; set; }

        public string Name { get; set; }

        public int Score { get; set; }
    }
}