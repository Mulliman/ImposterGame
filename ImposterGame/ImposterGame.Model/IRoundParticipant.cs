using System;
using System.Collections.Generic;
using System.Text;

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