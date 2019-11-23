using Microsoft.Extensions.Caching.Memory;
using System;

namespace ImposterGame.Game.Players
{
    public class InMemoryPlayerService : IPlayerService
    {
        private readonly IMemoryCache _memoryCache;

        private const string PlayerCacheKey = "imposter.players.";

        public InMemoryPlayerService(IMemoryCache memoryCache)
        {
            _memoryCache = memoryCache;
        }

        public Player CreatePlayer(string name)
        {
            var player = Player.NewPlayer(name);

            var cacheEntry = _memoryCache.GetOrCreate(GetCacheKeyForPlayer(player), entry =>
            {
                return player;
            });

            return player;
        }

        public Player GetPlayer(Guid id)
        {
            var cacheEntry = _memoryCache.Get<Player>(GetCacheKeyForPlayer(id));

            return cacheEntry;
        }

        private string GetCacheKeyForPlayer(Player player)
        {
            return GetCacheKeyForPlayer(player.Id);
        }

        private string GetCacheKeyForPlayer(Guid id)
        {
            return (PlayerCacheKey + id.ToString("N")).ToLower();
        }
    }
}