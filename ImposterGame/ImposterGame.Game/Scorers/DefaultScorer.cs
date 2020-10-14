using ImposterGame.Model;
using System;
using System.Linq;

namespace ImposterGame.Game.Scorers
{
    /// <summary>
    /// Default scoring scheme of:
    /// 
    /// Normal player gets their wager if they guess correctly.
    /// Normal player gets 1 team point if they find the imposter.
    /// Imposter gets 1 point if they are not identified.
    /// Imposter gets 1 bonus point if they guess the word.
    /// Imposter gets wager if player guesses incorrectly and the imposter guesses the word.
    /// 
    /// </summary>
    public class DefaultScorer : IScorer
    {
        public IRound AddScoresToRound(IRound round)
        {
            if (round == null) throw new ArgumentNullException(nameof(round));

            var imposter = round.Imposter;
            var imposterId = round.Imposter.Player.Id;
            var isImposterGuessCorrect = round.IsImpostersGuessCorrect;

            foreach (var nonImposter in round.Participants.Where(p => !p.IsImposter))
            {
                var accuserGuessedCorrectly = nonImposter.Accusation.PlayerId == imposterId;
                var wager = nonImposter.Accusation.Wager;

                // Normal player gets 1 team point if they find the imposter.
                if (!round.WasImposterFound)
                {
                    nonImposter.ScoredPoints += 1;
                }

                if (accuserGuessedCorrectly)
                {
                    // Normal player gets their wager if they guess correctly.
                    nonImposter.ScoredPoints = nonImposter.Accusation.Wager;
                }
                else if (isImposterGuessCorrect && isImposterGuessCorrect)
                {
                    // Imposter gets wager if player guesses incorrectly and the imposter guesses the word.
                    imposter.ScoredPoints += wager;
                }
            }

            // Imposter gets 1 point if they are not identified.
            if (!round.WasImposterFound)
            {
                imposter.ScoredPoints += 1;
            }

            // Imposter gets 1 bonus point if they guess the word.
            if (isImposterGuessCorrect)
            {
                imposter.ScoredPoints += 1;
            }

            return round;
        }
    }
}