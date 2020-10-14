using ImposterGame.Game.OptionGrids;
using ImposterGame.Model;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace ImposterGame.OptionGrids.FileBased
{
    public class OptionGridJsonFormat
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string[] Options { get; set; }
        public string[] Groups { get; set; }
    }

    public class FileBasedGridProvider : IOptionGridProvider
    {
        public static IDictionary<Guid, OptionGridGroup> AllOptionGridGroups = new Dictionary<Guid, OptionGridGroup>();
        public static IDictionary<Guid, OptionGrid> AllOptionGrids = new Dictionary<Guid, OptionGrid>();

        public FileBasedGridProvider(string rootFolderPath)
        {
            var files = Directory.GetFiles(rootFolderPath, "*", SearchOption.AllDirectories);

            foreach(var fileName in files)
            {
                using (StreamReader file = File.OpenText(fileName))
                {
                    var serializer = new Newtonsoft.Json.JsonSerializer();
                    var grid = (OptionGridJsonFormat)serializer.Deserialize(new JsonTextReader(file), typeof(OptionGridJsonFormat));

                    var optionGrid = new OptionGrid(grid.Id, grid.Name, grid.Options)
                    {
                        Groups = grid.Groups
                    };

                    AllOptionGrids.Add(optionGrid.Id, optionGrid);
                }
            }

            var gridNameMap = new Dictionary<string, List<OptionGrid>>();

            foreach(var grid in AllOptionGrids)
            {
                foreach(var group in grid.Value.Groups)
                {
                    if(!gridNameMap.ContainsKey(group))
                    {
                        gridNameMap[group] = new List<OptionGrid>();
                    }

                    gridNameMap[group].Add(grid.Value);
                }
            }

            foreach (var group in gridNameMap)
            {
                var guid = Guid.NewGuid();
                AllOptionGridGroups.Add(guid, new OptionGridGroup(guid, group.Key, group.Value));
            }
        }

        public async Task<IEnumerable<IOptionGridGroup>> GetAllOptionGridGroups()
        {
            return AllOptionGridGroups.Select(x => x.Value);
        }

        public async Task<IEnumerable<IOptionGrid>> GetAllOptionGrids()
        {
            return AllOptionGrids.Select(x => x.Value);
        }

        public async Task<IOptionGrid> GetOptionGrid(Guid id)
        {
            if (!AllOptionGrids.ContainsKey(id))
            {
                return null;
            }

            return AllOptionGrids[id];
        }

        public async Task<IOptionGridGroup> GetOptionGridGroup(Guid id)
        {
            if(!AllOptionGridGroups.ContainsKey(id))
            {
                return null;
            }

            return AllOptionGridGroups[id];
        }
    }
}