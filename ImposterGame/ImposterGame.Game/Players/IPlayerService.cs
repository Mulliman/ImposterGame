using System;

namespace ImposterGame.Game.Players
{
    public interface IPlayerService
    {
        Player CreatePlayer(string name);

        Player GetPlayer(Guid id);
    }
}