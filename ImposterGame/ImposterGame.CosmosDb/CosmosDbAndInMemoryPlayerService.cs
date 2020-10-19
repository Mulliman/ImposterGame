using ImposterGame.CosmosDb.Config;
using ImposterGame.Game.Players;
using Microsoft.Azure.Cosmos;
using Microsoft.Azure.Cosmos.Table;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace ImposterGame.CosmosDb
{
    public class CosmosDbAndInMemoryPlayerService : InMemoryPlayerService
    {
        private readonly CosmosConfig _config;

        private CloudStorageAccount _cosmosClient;

        public CosmosDbAndInMemoryPlayerService(IMemoryCache memoryCache, IOptions<CosmosConfig> config) : base(memoryCache)
        {
            _cosmosClient = CloudStorageAccount.Parse(config.Value.ConnectionString);
            _config = config.Value;
        }

        public override async Task<Player> CreatePlayer(string name)
        {
            var player = Player.NewPlayer(name);

            CreateCachedPlayer(player);

            var entity = new PlayerEntity(player);

            try
            {
                CloudTableClient tableClient = _cosmosClient.CreateCloudTableClient(new TableClientConfiguration());
                CloudTable table = tableClient.GetTableReference(_config.TableName);

                TableOperation operation = TableOperation.InsertOrMerge(entity);

                // Execute the operation.
                TableResult result = await table.ExecuteAsync(operation);
                var insertedEntity = result.Result as PlayerEntity;

                return insertedEntity.ToDomainObject();
            }
            catch (CosmosException ex) when (ex.StatusCode == HttpStatusCode.Conflict)
            {
                throw ex;
            }
        }

        public async override Task<Player> GetPlayer(Guid id)
        {
            var cached = GetCachedPlayer(id);

            if(cached != null)
            {
                return cached;
            }

            try
            {
                CloudTableClient tableClient = _cosmosClient.CreateCloudTableClient(new TableClientConfiguration());
                CloudTable table = tableClient.GetTableReference(_config.TableName);
                TableOperation retrieveOperation = TableOperation.Retrieve<PlayerEntity>(PlayerEntity.PlayerEntityPartitionKey, PlayerEntity.GetIdAsString(id));
                TableResult result = await table.ExecuteAsync(retrieveOperation);
                var playerEntity = result.Result as PlayerEntity;

                if(playerEntity == null)
                {
                    return null;
                }

                var player = playerEntity?.ToDomainObject();

                if (player == null)
                {
                    return null;
                }

                CreateCachedPlayer(player);
                return player;
            }
            catch (CosmosException ex) when (ex.StatusCode == HttpStatusCode.Conflict)
            {
                throw ex;
            }
        }
    }
}