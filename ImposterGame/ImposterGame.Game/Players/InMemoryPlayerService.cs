using Microsoft.Extensions.Caching.Memory;
using System;
using System.Threading.Tasks;

namespace ImposterGame.Game.Players
{
    public class InMemoryPlayerService : IPlayerService
    {
        protected readonly IMemoryCache MemoryCache;

        private const string PlayerCacheKey = "imposter.players.";

        public InMemoryPlayerService(IMemoryCache memoryCache)
        {
            MemoryCache = memoryCache;
        }

        public virtual Task<Player> CreatePlayer(string name)
        {
            var player = Player.NewPlayer(name);

            return Task.FromResult(CreateCachedPlayer(player));
        }

        public virtual Task<Player> GetPlayer(Guid id)
        {
            return Task.FromResult(GetCachedPlayer(id));
        }

        protected virtual Player CreateCachedPlayer(Player player)
        {
            var cacheEntry = MemoryCache.GetOrCreate(GetCacheKeyForPlayer(player), entry =>
            {
                entry.AbsoluteExpiration = DateTime.UtcNow.AddDays(10);
                return player;
            });

            return cacheEntry;
        }

        protected virtual Player GetCachedPlayer(Guid id)
        {
            var cacheEntry = MemoryCache.Get<Player>(GetCacheKeyForPlayer(id));

            return cacheEntry;
        }

        protected virtual string GetCacheKeyForPlayer(Player player)
        {
            return GetCacheKeyForPlayer(player.Id);
        }

        protected virtual string GetCacheKeyForPlayer(Guid id)
        {
            return (PlayerCacheKey + id.ToString("N")).ToLower();
        }
    }
}