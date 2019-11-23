using ImposterGame.Model;
using System;
using System.Collections.Generic;
using System.Text;

namespace ImposterGame.Game.Scorers
{
    public interface IScorer
    {
        IRound AddScoresToRound(IRound round);
    }
}