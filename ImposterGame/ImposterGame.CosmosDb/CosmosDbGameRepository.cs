using ImposterGame.CosmosDb.Config;
using ImposterGame.Game;
using ImposterGame.Model;
using Microsoft.Azure.Cosmos;
using Microsoft.Azure.Cosmos.Table;
using Microsoft.Extensions.Options;
using System;
using System.Net;
using System.Threading.Tasks;

namespace ImposterGame.CosmosDb
{
    public class CosmosDbGameRepository : IGameRepository
    {
        private readonly CosmosConfig _config;

        private CloudStorageAccount _cosmosClient;

        public CosmosDbGameRepository(IOptions<CosmosConfig> config)
        {
            _cosmosClient = CloudStorageAccount.Parse(config.Value.ConnectionString);
            _config = config.Value;
        }

        public async Task<IGame> Create(IGame game)
        {
            var storethis = new GameEntity(game);

            try
            {
                CloudTableClient tableClient = _cosmosClient.CreateCloudTableClient(new TableClientConfiguration());
                CloudTable table = tableClient.GetTableReference(_config.TableName);

                TableOperation operation = TableOperation.InsertOrMerge(storethis);

                // Execute the operation.
                TableResult result = await table.ExecuteAsync(operation);
                var insertedEntity = result.Result as GameEntity;

                return insertedEntity.ToDomainObject();
            }
            catch (CosmosException ex) when (ex.StatusCode == HttpStatusCode.Conflict)
            {
                throw ex;
            }
        }

        public async Task Delete(Guid id)
        {
            CloudTableClient tableClient = _cosmosClient.CreateCloudTableClient(new TableClientConfiguration());
            CloudTable table = tableClient.GetTableReference(_config.TableName);

            var easyCode = Game.Game.GetEasyCodeFromId(id);
            var existing = await GetEntity(easyCode);

            if(existing == null)
            {
                return; 
            }

            TableOperation operation = TableOperation.Delete(existing);

            // Execute the operation.
            await table.ExecuteAsync(operation);
        }

        public async Task<IGame> Get(Guid id)
        {
            var easyCode = Game.Game.GetEasyCodeFromId(id);

            return await Get(easyCode);
        }

        public async Task<IGame> Get(string easyCode)
        {
            var game = await GetEntity(easyCode);
            return game?.ToDomainObject();
        }

        public async Task<IGame> Save(IGame game)
        {
            var storethis = new GameEntity(game);

            try
            {
                CloudTableClient tableClient = _cosmosClient.CreateCloudTableClient(new TableClientConfiguration());
                CloudTable table = tableClient.GetTableReference(_config.TableName);

                TableOperation operation = TableOperation.InsertOrReplace(storethis);

                // Execute the operation.
                TableResult result = await table.ExecuteAsync(operation);
                var insertedEntity = result.Result as GameEntity;

                return insertedEntity.ToDomainObject();
            }
            catch (CosmosException ex) when (ex.StatusCode == HttpStatusCode.Conflict)
            {
                throw ex;
            }
        }

        private async Task<GameEntity> GetEntity(string easyCode)
        {
            try
            {
                CloudTableClient tableClient = _cosmosClient.CreateCloudTableClient(new TableClientConfiguration());
                CloudTable table = tableClient.GetTableReference(_config.TableName);
                TableOperation retrieveOperation = TableOperation.Retrieve<GameEntity>(GameEntity.GameEntityPartitionKey, easyCode);
                TableResult result = await table.ExecuteAsync(retrieveOperation);
                var game = result.Result as GameEntity;

                return game;
            }
            catch (CosmosException ex) when (ex.StatusCode == HttpStatusCode.Conflict)
            {
                throw ex;
            }
        }
    }
}