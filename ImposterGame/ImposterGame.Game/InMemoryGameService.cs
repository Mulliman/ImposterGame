using ImposterGame.Model;
using Microsoft.Extensions.Caching.Memory;
using System;

namespace ImposterGame.Game
{
    public class InMemoryGameService : IGameService
    {
        private readonly IMemoryCache _memoryCache;

        private const string GameCacheKey = "imposter.games.";

        public InMemoryGameService(IMemoryCache memoryCache)
        {
            _memoryCache = memoryCache;
        }

        public IGame CreateGame(IPlayer player)
        {
            if (player == null) throw new ArgumentNullException(nameof(player));

            var game = new Game(player);

            var cacheEntry = _memoryCache.GetOrCreate(GetCacheKeyForGame(game), entry =>
            {
                return game;
            });

            return game;
        }

        public IGame GetGame(Guid id)
        {
            var cacheEntry = _memoryCache.Get<IGame>(GetCacheKeyForGame(id));

            return cacheEntry;
        }

        public IGame GetGame(string easyCode)
        {
            var cacheEntry = _memoryCache.Get<IGame>(GetCacheKeyForGame(easyCode));

            return cacheEntry;
        }

        public IGame JoinGame(IGame game, IPlayer player)
        {
            if (game == null) throw new ArgumentNullException(nameof(game));
            if (player == null) throw new ArgumentNullException(nameof(player));

            game.AddPlayer(player);

            SaveGame(game);

            return game;
        }

        public IGame LeaveGame(IGame game, IPlayer player)
        {
            game.RemovePlayer(player);

            if (!game.CanLeaveWithoutRoundCancellation)
            {
                game.CancelCurrentRound();
            }

            if (game.Host.Id == player.Id)
            {
                DestroyGame(game);

                return null;
            }

            SaveGame(game);

            return game;
        }

        public IGame StartNewRound(IGame game, IOptionGrid grid)
        {
            game.NewRound(grid);

            SaveGame(game);

            return game;
        }

        public IGame SaveGame(IGame game)
        {
            var updated = _memoryCache.Set(GetCacheKeyForGame(game), game);

            return updated; ;
        }

        public void DestroyGame(IGame game)
        {
            _memoryCache.Remove(GetCacheKeyForGame(game));
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