using System.Collections.Generic;

namespace ImposterGame.Model
{
    public interface IAccusationStatistics
    {
        IEnumerable<IAccusationStatisticsParticipant> AccusedParticipants { get; }

        bool SplitVoteWithNoImposter { get; }

        IRoundParticipant SuspectedImposter { get; }
    }
}