﻿using ImposterGame.Model;
using System.Threading.Tasks;

namespace ImposterGame.Website.Hubs
{
    public interface IGameNotifier
    {
        Task SendNewRoundStarted(IGame game);
        Task SendPlayerJoined(IGame game);
    }
}