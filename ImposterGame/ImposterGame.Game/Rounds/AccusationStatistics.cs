using ImposterGame.Model;
using System.Collections.Generic;
using System.Linq;

namespace ImposterGame.Game.Rounds
{
    public class AccusationStatistics : IAccusationStatistics
    {
        private readonly List<AccusationStatisticsParticipant> _accusedParticipants;

        public AccusationStatistics()
        {
            _accusedParticipants = new List<AccusationStatisticsParticipant>();
        }
        public AccusationStatistics(IEnumerable<AccusationStatisticsParticipant> accusationStatisticsParticipants)
        {
            _accusedParticipants = accusationStatisticsParticipants.ToList();
        }

        public IRoundParticipant SuspectedImposter => GetSuspectedImposter();

        public bool SplitVoteWithNoImposter => _accusedParticipants.Any() && SuspectedImposter == null;

        public IEnumerable<IAccusationStatisticsParticipant> AccusedParticipants => _accusedParticipants;

        public void AddAccusedParticipant(AccusationStatisticsParticipant participant)
        {
            _accusedParticipants.Add(participant);
        }

        private IRoundParticipant GetSuspectedImposter()
        {
            var currentTopScore = 0;
            var currentTopScorers = new List<AccusationStatisticsParticipant>();

            foreach (var accused in _accusedParticipants)
            {
                if (accused.AmountOfAccusations > currentTopScore)
                {
                    currentTopScore = accused.AmountOfAccusations;
                    currentTopScorers = new List<AccusationStatisticsParticipant>(new[] { accused });
                }
                else if (accused.AmountOfAccusations == currentTopScore)
                {
                    currentTopScorers.Add(accused);
                }
            }

            if (currentTopScorers.Count > 1)
            {
                var imposter = currentTopScorers.FirstOrDefault(ap => ap.Participant.IsImposter);

                // If one of the most accused is the imposter, then that counts as the imposter found.
                if (imposter != null)
                {
                    return imposter.Participant;
                }

                // If no consensus, return null and this will be marked as undecided.
                return null;
            }
            else
            {
                return currentTopScorers.FirstOrDefault()?.Participant;
            }
        }
    }
}