using ImposterGame.Model;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace ImposterGame.Game
{
    public interface IGameRepository
    {
        Task<IGame> Get(Guid id);

        Task<IGame> Get(string easyCode);

        Task<IGame> Create(IGame game);

        Task<IGame> Save(IGame game);

        Task Delete(Guid id);
    }
}