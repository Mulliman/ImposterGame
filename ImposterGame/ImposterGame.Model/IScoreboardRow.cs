using System;
using System.Collections.Generic;
using System.Text;

namespace ImposterGame.Model
{
    public interface IScoreboardRow
    {
        IPlayer Player { get; set; }

        int Score { get; set; }

        int CurrentRoundScore { get; set; }
    }
}