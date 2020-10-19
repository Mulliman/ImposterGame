using ImposterGame.Game.Rounds;
using ImposterGame.Model;
using System;
using System.Collections.Generic;
using System.Linq;

namespace ImposterGame.CosmosDb
{
    public class SerializableRound
    {
        public SerializableRound()
        {
        }

        public SerializableRound(IRound round)
        {
            Id = round.Id;
            Word = round.Word;
            ImpostersGuess = round.ImpostersGuess;
            IsComplete = round.IsComplete;
            AllOptions = round.AllOptions?.ToList();
            Participants = round.Participants?.Select(p => new SerializableRoundParticipant(p))?.ToList();
        }

        public Guid Id { get; set; }

        public string Word { get; set; }

        public string ImpostersGuess { get; set; }

        public bool IsComplete { get; set; }

        public List<string> AllOptions { get; set; }

        public List<SerializableRoundParticipant> Participants { get; set; }

        public IRound ToDomainModel()
        {
            return new Round
            {
               Id = Id,
               AllOptions = AllOptions,
               ImpostersGuess = ImpostersGuess,
               IsComplete = IsComplete,
               Participants = Participants?.Select(p => p.ToDomainModel())?.ToList(),
               Word = Word
            };
        }
    }
}