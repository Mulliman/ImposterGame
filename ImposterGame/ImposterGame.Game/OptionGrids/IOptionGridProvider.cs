﻿using ImposterGame.Model;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ImposterGame.Game.OptionGrids
{
    public interface IOptionGridProvider
    {
        Task<IOptionGrid> GetOptionGrid(Guid id);

        Task<IOptionGridGroup> GetOptionGridGroup(Guid id);

        Task<IEnumerable<IOptionGrid>> GetAllOptionGrids();

        Task<IEnumerable<IOptionGridGroup>> GetAllOptionGridGroups();
    }
}