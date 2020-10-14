using ImposterGame.Game.Scorers;
using ImposterGame.Model;
using System;
using System.Collections.Generic;
using System.Linq;

namespace ImposterGame.Game.Rounds
{
    public class Round : IRound
    {
        private const int DefaultAmountOfRoundOptions = 16;
        private AccusationStatistics _accusationStatistics;

        private Round()
        {
            Participants = new List<IRoundParticipant>();
        }

        public Guid Id { get; private set; }

        public string Word { get; private set; }

        public string ImpostersGuess { get; set; }

        public bool IsImpostersGuessCorrect => Word != null && ImpostersGuess != null && Word.Equals(ImpostersGuess, StringComparison.OrdinalIgnoreCase);

        public bool WasImposterFound => AccusationStatistics != null
            && AccusationStatistics.SuspectedImposter != null
            && AccusationStatistics.SuspectedImposter == Imposter;

        public IAccusationStatistics AccusationStatistics
        {
            get
            {
                if (_accusationStatistics != null)
                {
                    return _accusationStatistics;
                }

                if (!AllAccused)
                {
                    return null;
                }

                var accusedParticipants = new List<AccusationStatisticsParticipant>();

                var groups = Participants.GroupBy(p => p.Accusation.PlayerId);

                foreach (var group in groups)
                {
                    var participant = Participants.FirstOrDefault(p => p.Player.Id == group.Key);

                    accusedParticipants.Add(new AccusationStatisticsParticipant(participant, group.Select(g => g.Player.Name)));
                }

                _accusationStatistics = new AccusationStatistics(accusedParticipants);

                return _accusationStatistics;
            }
        }

        public IList<string> AllOptions { get; private set; }

        public IList<IRoundParticipant> Participants { get; private set; }

        public IRoundParticipant Imposter => Participants.First(p => p.IsImposter);

        public IEnumerable<IPlayerScore> RoundScores => Participants.Select(p => new PlayerScore(p.Player, p.ScoredPoints)).OrderByDescending(p => p.Score);

        public bool AllAnswered => Participants.All(p => p.HasAnswered);

        public bool AllAccused => Participants.All(p => p.Accusation != null);

        public bool IsComplete { get; set; }

        public static Round NewRound(IOptionGrid optionGrid, IEnumerable<IPlayer> players)
        {
            var optionsInThisRound = GetOptionsForThisRound(optionGrid);

            var round = new Round
            {
                AllOptions = optionsInThisRound,
                Id = Guid.NewGuid()
            };

            round.Word = optionsInThisRound.OrderBy(x => Guid.NewGuid()).First();

            var list = players.ToList();
            var imposter = list.OrderBy(x => Guid.NewGuid()).First();

            foreach (var player in players)
            {
                var isImposter = imposter.Name == player.Name;
                round.Participants.Add(new RoundParticipant(player, isImposter));
            }

            return round;
        }

        protected static List<string> GetOptionsForThisRound(IOptionGrid optionGrid)
        {
            var options = optionGrid.Options.OrderBy(x => Guid.NewGuid()).Take(DefaultAmountOfRoundOptions);

            return options.ToList();
        }
    }
}