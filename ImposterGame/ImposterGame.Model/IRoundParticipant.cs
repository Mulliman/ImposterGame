namespace ImposterGame.Model
{
    public interface IRoundParticipant
    {
        IPlayer Player { get; }

        bool IsImposter { get; }

        string Answer { get; set; }

        bool HasAnswered => Answer != null;

        IAccusation Accusation { get; set; }

        int ScoredPoints { get; set; }
    }
}