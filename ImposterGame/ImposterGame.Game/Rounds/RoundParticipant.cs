using ImposterGame.Model;

namespace ImposterGame.Game.Rounds
{
    public class RoundParticipant : IRoundParticipant
    {
        public RoundParticipant(IPlayer player, bool isImposter)
        {
            Player = player;
            IsImposter = isImposter;
        }

        public IPlayer Player { get; }

        public bool IsImposter { get;  }

        public string Answer { get; set; }

        public IAccusation Accusation { get; set; }

        public int ScoredPoints { get; set; }
    }
}