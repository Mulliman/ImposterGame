using ImposterGame.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace ImposterGame.Game.Scorers
{
    /// <summary>
    /// Default scoring scheme of:
    /// 
    /// Normal player gets their wager if they guess correctly.
    /// Imposter gets 1 bonus point per correct guess if they guess the word.
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
            var isImposterGuessCorrect = round.IsGuessCorrect;

            foreach (var nonImposter in round.Participants.Where(p => !p.IsImposter))
            {
                var guessedCorrectly = nonImposter.Accusation.PlayerId == imposterId;
                var wager = nonImposter.Accusation.Wager;

                if (guessedCorrectly)
                {
                    nonImposter.ScoredPoints = nonImposter.Accusation.Wager;

                    if (isImposterGuessCorrect)
                    {
                        imposter.ScoredPoints += 1;
                    }
                }
                else if (isImposterGuessCorrect)
                {
                    imposter.ScoredPoints += wager;
                }
            }

            return round;
        }
    }
}