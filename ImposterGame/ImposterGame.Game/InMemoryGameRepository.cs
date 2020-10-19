using ImposterGame.Model;
using Microsoft.Extensions.Caching.Memory;
using System;
using System.Threading.Tasks;

namespace ImposterGame.Game
{
    public class InMemoryGameRepository : IGameRepository
    {
        private readonly IMemoryCache _memoryCache;

        private const string GameCacheKey = "imposter.games.";

        public InMemoryGameRepository(IMemoryCache memoryCache)
        {
            _memoryCache = memoryCache;
        }

        public async Task<IGame> Create(IGame game)
        {
            var cacheEntry = _memoryCache.GetOrCreate(GetCacheKeyForGame(game), entry =>
            {
                return game;
            });

            return game;
        }

        public async Task Delete(Guid id)
        {
            _memoryCache.Remove(GetCacheKeyForGame(id));
        }

        public async Task<IGame> Get(Guid id)
        {
            var cacheEntry = _memoryCache.Get<IGame>(GetCacheKeyForGame(id));

            return cacheEntry;
        }

        public async Task<IGame> Get(string easyCode)
        {
            var cacheEntry = _memoryCache.Get<IGame>(GetCacheKeyForGame(easyCode));

            return cacheEntry;
        }

        public async Task<IGame> Save(IGame game)
        {
            var updated = _memoryCache.Set(GetCacheKeyForGame(game), game);

            return updated; ;
        }

        private string GetCacheKeyForGame(IGame game)
        {
            return GetCacheKeyForGame(game.Id);
        }

        private string GetCacheKeyForGame(Guid id)
        {
            return (GameCacheKey + Game.GetEasyCodeFromId(id)).ToLower();
        }

        private string GetCacheKeyForGame(string easyCode)
        {
            return (GameCacheKey + easyCode).ToLower();
        }
    }
}