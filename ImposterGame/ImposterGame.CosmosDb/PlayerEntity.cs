using ImposterGame.Game.Players;
using ImposterGame.Model;
using Microsoft.Azure.Cosmos.Table;
using System;

namespace ImposterGame.CosmosDb
{
    public class PlayerEntity : TableEntity
    {
        public const string PlayerEntityPartitionKey = "Players";

        public PlayerEntity()
        {
        }

        public PlayerEntity(IPlayer player) : base(PlayerEntityPartitionKey, GetIdAsString(player.Id))
        {
            PlayerId = player.Id;
            Name = player.Name;
        }

        public Guid PlayerId { get; set; }

        public string Name { get; set; }

        public Player ToDomainObject()
        {
            return new Player { Id = PlayerId, Name = Name };
        }

        public static string GetIdAsString(Guid id)
        {
            return id.ToString();
        }
    }
}