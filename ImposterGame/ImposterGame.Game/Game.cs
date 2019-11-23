using ImposterGame.Model;
using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;
using ImposterGame.Game.Scorers;
using ImposterGame.Game.Rounds;
using ImposterGame.Game.Exceptions;

namespace ImposterGame.Game
{
    public class Game : IGame
    {
        public Game(IPlayer host)
        {
            Id = Guid.NewGuid();
            EasyCode = GetEasyCodeFromId(Id);
            Players = new List<IPlayer>
            {
                host
            };
            Host = host;

            PreviousRounds = new List<IRound>();

            // Always default scorer for now.
            Scorer = new DefaultScorer();
        }

        public IScorer Scorer { get; set; }

        public Guid Id { get; set; }

        public string EasyCode { get; set; }

        public IPlayer Host { get; }

        public IList<IPlayer> Players { get; set; }

        public IRound CurrentRound { get; set; }

        public IList<IRound> PreviousRounds { get; set; }

        public IEnumerable<IScoreboardRow> Scores => GetScoreboard();

        public string State => GetState();

        public void AddPlayer(IPlayer player)
        {
            if (player == null) throw new ArgumentNullException(nameof(player));
            if (player.Id == Guid.Empty) throw new ArgumentNullException(nameof(player.Id));
            if (player.Name == null) throw new ArgumentNullException(nameof(player.Name));

            if (Players.Any(p => p.Id == player.Id))
            {
                // The player is already added.
                return;
            }

            if (Players.Any(p => p.Name.ToLower() == player.Name.ToLower()))
            {
                throw new PlayerWithSameNameAlreadyExistsException(player.Name);
            }

            Players.Add(player);
        }

        public void RemovePlayer(IPlayer player)
        {
            if (player == null) throw new ArgumentNullException(nameof(player));
            if (player.Id == Guid.Empty) throw new ArgumentNullException(nameof(player.Id));

            Players = Players.Where(p => p.Id != player.Id).ToList();
        }

        public void NewRound(IOptionGrid optionGrid)
        {
            if (optionGrid == null) throw new ArgumentNullException(nameof(optionGrid));

            if (CurrentRound != null)
            {
                PreviousRounds.Add(CurrentRound);
            }

            var newRound = Round.NewRound(optionGrid, Players);

            CurrentRound = newRound;
        }

        public void CancelCurrentRound()
        {
            if (CurrentRound == null)
            {
                return;
            }

            CurrentRound = null;
        }

        public static string GetEasyCodeFromId(Guid id)
        {
            return string.Join("", id.ToString("N").Take(5)).ToLower();
        }

        public void ScoreRound(string guess)
        {
            var imposter = CurrentRound.Participants.First(p => p.IsImposter);

            CurrentRound.ImpostersGuess = guess;

            CurrentRound = Scorer.AddScoresToRound(CurrentRound);
            CurrentRound.IsComplete = true;
        }

        private IEnumerable<IScoreboardRow> GetScoreboard()
        {
            var dict = Players.ToDictionary(p => p, p => new ScoreboardRow(p, 0, 0));

            foreach (var roundParticipant in PreviousRounds.SelectMany(r => r.Participants))
            {
                if (dict.ContainsKey(roundParticipant.Player))
                {
                    dict[roundParticipant.Player].Score += roundParticipant.ScoredPoints;
                }
            }

            if (CurrentRound != null && CurrentRound.Participants.Any(p => p.ScoredPoints > 0))
            {
                foreach (var participant in CurrentRound.Participants)
                {
                    if (dict.ContainsKey(participant.Player))
                    {
                        dict[participant.Player].Score += participant.ScoredPoints;
                        dict[participant.Player].CurrentRoundScore += participant.ScoredPoints;
                    }
                }
            }

            return dict.OrderBy(d => d.Value.Score).Select(d => d.Value);
        }

        public bool CanLeaveWithoutRoundCancellation => CurrentRound == null || CurrentRound.IsComplete;

        private string GetState()
        {
            if (CurrentRound == null)
            {
                return GameStates.RoundPendingValue;
            }

            if (CurrentRound.IsComplete)
            {
                return GameStates.RoundCompletedValue;
            }

            if (CurrentRound.AllAnswered)
            {
                return GameStates.RoundAnsweredValue;
            }

            if (CurrentRound.AllAccused)
            {
                return GameStates.RoundAccusedValue;
            }

            return GameStates.RoundStartedValue;
        }
    }
}