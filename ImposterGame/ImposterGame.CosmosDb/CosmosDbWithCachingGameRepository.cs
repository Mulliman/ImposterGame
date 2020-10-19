using ImposterGame.CosmosDb.Config;
using ImposterGame.Game;
using ImposterGame.Model;
using Microsoft.Azure.Cosmos;
using Microsoft.Azure.Cosmos.Table;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Options;
using System;
using System.Net;
using System.Threading.Tasks;

namespace ImposterGame.CosmosDb
{
    public class CosmosDbWithCachingGameRepository : CosmosDbGameRepository
    {
        private const string GameCacheKey = "imposter.games.";
        private readonly IMemoryCache _memoryCache;

        public CosmosDbWithCachingGameRepository(IMemoryCache memoryCache, IOptions<CosmosConfig> config) : base(config)
        {
            _memoryCache = memoryCache;
        }

        public async override Task<IGame> Create(IGame game)
        {
            var cacheEntry = _memoryCache.GetOrCreate(GetCacheKeyForGame(game), entry =>
            {
                return game;
            });

            var created = await base.Create(game);

            return created;
        }

        public async override Task Delete(Guid id)
        {
            _memoryCache.Remove(GetCacheKeyForGame(id));
            await base.Delete(id);
        }

        public async override Task<IGame> Get(Guid id)
        {
            var easyCode = Game.Game.GetEasyCodeFromId(id);

            return await Get(easyCode);
        }

        public async override Task<IGame> Get(string easyCode)
        {
            var cacheEntry = _memoryCache.Get<IGame>(GetCacheKeyForGame(easyCode));

            if(cacheEntry != null)
            {
                return cacheEntry;
            }

            var persisted = await base.Get(easyCode);

            var newlyCached = _memoryCache.GetOrCreate(GetCacheKeyForGame(persisted), entry =>
            {
                return persisted;
            });

            return newlyCached;
        }

        public async override Task<IGame> Save(IGame game)
        {
            var savedGame = await base.Save(game);
            var updated = _memoryCache.Set(GetCacheKeyForGame(savedGame), savedGame);
            return updated;
        }

        private string GetCacheKeyForGame(IGame game)
        {
            return GetCacheKeyForGame(game.Id);
        }

        private string GetCacheKeyForGame(Guid id)
        {
            return (GameCacheKey + Game.Game.GetEasyCodeFromId(id)).ToLower();
        }

        private string GetCacheKeyForGame(string easyCode)
        {
            return (GameCacheKey + easyCode).ToLower();
        }
    }
}