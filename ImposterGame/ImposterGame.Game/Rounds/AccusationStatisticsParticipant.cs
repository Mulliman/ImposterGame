using ImposterGame.Model;
using System.Collections.Generic;
using System.Linq;

namespace ImposterGame.Game.Rounds
{
    public class AccusationStatisticsParticipant : IAccusationStatisticsParticipant
    {
        public AccusationStatisticsParticipant(IRoundParticipant participant, IEnumerable<string> accusedByNames)
        {
            Participant = participant;
            AccusedByNames = accusedByNames;
        }

        public IRoundParticipant Participant { get; }

        public int AmountOfAccusations => AccusedByNames.Count();

        public IEnumerable<string> AccusedByNames { get; set; }
    }
}