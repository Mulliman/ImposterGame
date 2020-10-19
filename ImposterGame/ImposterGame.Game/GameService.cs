using ImposterGame.Model;
using System;
using System.Threading.Tasks;

namespace ImposterGame.Game
{
    public class GameService : IGameService
    {
        private readonly IGameRepository _repo;

        public GameService(IGameRepository repo)
        {
            _repo = repo;
        }

        public async Task<IGame> CreateGame(IPlayer player)
        {
            if (player == null) throw new ArgumentNullException(nameof(player));

            var game = new Game(player);

            return await _repo.Create(game);
        }

        public async Task<IGame> GetGame(Guid id)
        {
            return await _repo.Get(id);
        }

        public async Task<IGame> GetGame(string easyCode)
        {
            return await _repo.Get(easyCode);
        }

        public async Task<IGame> JoinGame(IGame game, IPlayer player)
        {
            if (game == null) throw new ArgumentNullException(nameof(game));
            if (player == null) throw new ArgumentNullException(nameof(player));

            game.AddPlayer(player);

            await SaveGame(game);

            return game;
        }

        public async Task<IGame> LeaveGame(IGame game, IPlayer player)
        {
            game.RemovePlayer(player);

            if (!game.CanLeaveWithoutRoundCancellation)
            {
                game.CancelCurrentRound();
            }

            if (game.Host.Id == player.Id)
            {
                await _repo.Delete(game.Id);

                return null;
            }

            await SaveGame(game);

            return game;
        }

        public async Task<IGame> SaveGame(IGame game)
        {
           return await _repo.Save(game);
        }

        public async Task<IGame> StartNewRound(IGame game, IOptionGrid grid)
        {
            game.NewRound(grid);

            await SaveGame(game);

            return game;
        }
    }
}