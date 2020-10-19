using ImposterGame.Model;
using Microsoft.Azure.Cosmos.Table;
using Newtonsoft.Json;
using System;

namespace ImposterGame.CosmosDb
{
    public class GameEntity : TableEntity
    {
        public const string GameEntityPartitionKey = "Games";

        public GameEntity()
        {
        }

        public GameEntity(IGame game) : base(GameEntityPartitionKey, game.EasyCode)
        {
            GameId = game.Id;
            EasyCode = game.EasyCode;

            var serializableGame = new SerializableGame(game);
            var serializedGame = JsonConvert.SerializeObject(serializableGame);
            Json = serializedGame;
        }

        public Guid GameId { get; set; }

        public string EasyCode { get; set; }

        public string Json { get; set; }

        public IGame ToDomainObject()
        {
            if(Json == null)
            {
                return null;
            }

            var serializableGame = JsonConvert.DeserializeObject<SerializableGame>(Json);

            return serializableGame.ToDomainModel();
        }
    }
}