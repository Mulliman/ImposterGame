using ImposterGame.Game.Players;
using ImposterGame.Game.Rounds;
using ImposterGame.Model;

namespace ImposterGame.CosmosDb
{
    public class SerializableRoundParticipant
    {
        public SerializableRoundParticipant()
        {
        }

        public SerializableRoundParticipant(IRoundParticipant participant)
        {
            Player = new Player { Id = participant.Player.Id, Name = participant.Player.Name };
            IsImposter = participant.IsImposter;
            Answer = participant.Answer;
            Accusation = participant.Accusation != null ? new Accusation(participant.Accusation.PlayerId, participant.Accusation.PlayerName, participant.Accusation.Wager) : null;
            ScoredPoints = participant.ScoredPoints;
        }

        public Player Player { get; set; }

        public bool IsImposter { get; set; }

        public string Answer { get; set; }

        public Accusation Accusation { get; set; }

        public int ScoredPoints { get; set; }

        public IRoundParticipant ToDomainModel()
        {
            return new RoundParticipant(Player, IsImposter)
            {
                Accusation = Accusation,
                Answer = Answer,
                ScoredPoints = ScoredPoints
            };
        }
    }
}