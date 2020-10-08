using ImposterGame.Model;
using System;
using System.Collections.Generic;
using System.Text;

namespace ImposterGame.Game.Rounds
{
    public class Accusation : IAccusation
    {
        public Accusation(IRoundParticipant participant, int wager)
        {
            PlayerId = participant.Player.Id;
            PlayerName = participant.Player.Name;
            Wager = wager;
        }

        public Guid PlayerId { get; set; }

        public string PlayerName { get; }

        public int Wager { get; }
    }
}