using System;
using System.Collections.Generic;
using System.Text;

namespace ImposterGame.Model
{
    public interface IGame
    {
        Guid Id { get; set; }

        string EasyCode { get; set; }

        IPlayer Host { get; }

        IList<IPlayer> Players { get; set; }

        IRound CurrentRound { get; set; }

        IList<IRound> PreviousRounds { get; set; }

        IEnumerable<IPlayerScore> GameScores { get; }

        string State { get; }

        bool CanLeaveWithoutRoundCancellation { get; }

        void AddPlayer(IPlayer player);

        void RemovePlayer(IPlayer player);

        void NewRound(IOptionGrid optionGrid);

        void CancelCurrentRound();

        void ScoreRound(string guess);
    }
}
