using ImposterGame.Model;
using System;
using System.Collections.Generic;
using System.Text;

namespace ImposterGame.Game.Scorers
{
    public class ScoreboardRow : IScoreboardRow
    {
        public ScoreboardRow(IPlayer player, int score, int currentRoundScore = 0)
        {
            Player = player;
            Score = score;
        }

        public IPlayer Player { get; set; }

        public int Score { get; set; }

        public int CurrentRoundScore { get; set; }
    }
}
