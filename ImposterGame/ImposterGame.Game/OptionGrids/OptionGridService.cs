using ImposterGame.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ImposterGame.Game.OptionGrids
{
    public class OptionGridService : IOptionGridService
    {
        private readonly IEnumerable<IOptionGridProvider> _optionGridProviders;
        private Dictionary<Guid, IOptionGridGroup> _allGridGroups;
        private Dictionary<Guid, IOptionGrid> _allGrids;

        public OptionGridService(IEnumerable<IOptionGridProvider> optionGridProviders)
        {
            _optionGridProviders = optionGridProviders;
        }

        public async Task<IOptionGrid> GetOptionGrid(Guid id)
        {
            if (_allGrids.ContainsKey(id))
            {
                return _allGrids[id];
            }

            var foundGrids = await Task.WhenAll(_optionGridProviders.Select(p => p.GetOptionGrid(id)));

            return foundGrids.FirstOrDefault(g => g != null);
        }

        public async Task<IOptionGridGroup> GetOptionGridGroup(Guid id)
        {
            if (_allGridGroups.ContainsKey(id))
            {
                return _allGridGroups[id];
            }

            var foundGridGroups = await Task.WhenAll(_optionGridProviders.Select(p => p.GetOptionGridGroup(id)));

            return foundGridGroups.FirstOrDefault(g => g != null);
        }

        public async Task<IEnumerable<IOptionGrid>> GetAllOptionGrids()
        {
            if (_allGrids != null)
            {
                return _allGrids.Select(gg => gg.Value); ;
            }

            var groupedGrids = await Task.WhenAll(_optionGridProviders.Select(p => p.GetAllOptionGrids()));

            var flattenedGrids = groupedGrids.SelectMany(g => g);

            _allGrids = flattenedGrids.ToDictionary(fg => fg.Id, fg => fg); ;

            return flattenedGrids;
        }

        public async Task<IEnumerable<IOptionGridGroup>> GetAllOptionGridGroups()
        {
            if (_allGridGroups != null)
            {
                return _allGridGroups.Select(gg => gg.Value);
            }

            var groupedGrids = await Task.WhenAll(_optionGridProviders.Select(p => p.GetAllOptionGridGroups()));

            var flattenedGridGroups = groupedGrids.SelectMany(g => g);

            _allGridGroups = flattenedGridGroups.ToDictionary(fg => fg.Id, fg => fg);

            return flattenedGridGroups;
        }

        public void ClearCachedData()
        {
            _allGrids = null;
            _allGridGroups = null;
        }
    }
}