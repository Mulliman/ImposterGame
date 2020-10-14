using ImposterGame.Model;

namespace ImposterGame.Game.Scorers
{
    public interface IScorer
    {
        IRound AddScoresToRound(IRound round);
    }
}