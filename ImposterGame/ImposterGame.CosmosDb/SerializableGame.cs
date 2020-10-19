using ImposterGame.Game.Players;
using ImposterGame.Model;
using System;
using System.Collections.Generic;
using System.Linq;

namespace ImposterGame.CosmosDb
{
    public class SerializableGame
    {
        public SerializableGame()
        {
            Players = new List<Player>();
            PreviousRounds = new List<SerializableRound>();
        }

        public SerializableGame(IGame game)
        {
            Id = game.Id;
            EasyCode = game.EasyCode;
            Host = new Player { Id = game.Host.Id, Name = game.Host.Name };
            Players = game.Players.Select(p => new Player { Id = p.Id, Name = p.Name }).ToList();

            CurrentRound = game.CurrentRound != null ? new SerializableRound(game.CurrentRound) : null;
            PreviousRound = game.PreviousRound != null ? new SerializableRound(game.PreviousRound) : null;
            PreviousRounds = game.PreviousRounds?.Select(pr => new SerializableRound(pr)).ToList();
        }

        public Guid Id { get; set; }

        public string EasyCode { get; set; }

        public Player Host { get; set; }

        public List<Player> Players { get; set; }

        public SerializableRound CurrentRound { get; set; }

        public SerializableRound PreviousRound { get; set; }

        public List<SerializableRound> PreviousRounds { get; set; }

        public IGame ToDomainModel()
        {
            return new Game.Game(Host)
            {
                Id = Id,
                EasyCode = EasyCode,
                Players = Players?.Select(p => p as IPlayer)?.ToList(),
                CurrentRound = CurrentRound?.ToDomainModel(),
                PreviousRound = PreviousRound?.ToDomainModel(),
                PreviousRounds = PreviousRounds?.Select(pr => pr.ToDomainModel())?.ToList()
            };
        }
    }
}