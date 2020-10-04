using ImposterGame.Model;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ImposterGame.Game.OptionGrids
{
    public interface IOptionGridService
    {
        void ClearCachedData();
        Task<IEnumerable<IOptionGridGroup>> GetAllOptionGridGroups();
        Task<IEnumerable<IOptionGrid>> GetAllOptionGrids();
        Task<IOptionGrid> GetOptionGrid(Guid id);
        Task<IOptionGridGroup> GetOptionGridGroup(Guid id);
    }
}