using System;
using System.Collections.Generic;
using System.Text;

namespace ImposterGame.Model
{
    public interface IRound
    {
        Guid Id { get; }

        string Word { get; }

        string ImpostersGuess { get; set; }

        bool IsImpostersGuessCorrect { get; }

        bool WasImposterFound { get; }

        IList<string> AllOptions { get; }

        IList<IRoundParticipant> Participants { get; }

        IRoundParticipant Imposter { get; }

        bool AllAnswered { get; }

        bool AllAccused { get; }

        bool IsComplete { get; set; }
        IEnumerable<IPlayerScore> RoundScores { get; }
    }
}