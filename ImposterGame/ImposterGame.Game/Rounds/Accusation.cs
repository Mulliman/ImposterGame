using ImposterGame.Model;
using System;

namespace ImposterGame.Game.Rounds
{
    public class Accusation : IAccusation
    {
        public Accusation()
        {
        }

        public Accusation(Guid playerId, string playerName, int wager)
        {
            PlayerId = playerId;
            PlayerName = playerName;
            Wager = wager;
        }

        public Accusation(IRoundParticipant participant, int wager)
        {
            PlayerId = participant.Player.Id;
            PlayerName = participant.Player.Name;
            Wager = wager;
        }

        public Guid PlayerId { get; set; }

        public string PlayerName { get; set; }

        public int Wager { get; set; }
    }
}