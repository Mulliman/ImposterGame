using System.Collections.Generic;

namespace ImposterGame.Model
{
    public interface IAccusationStatisticsParticipant
    {
        IEnumerable<string> AccusedByNames { get; set; }

        int AmountOfAccusations { get; }

        IRoundParticipant Participant { get; }
    }
}