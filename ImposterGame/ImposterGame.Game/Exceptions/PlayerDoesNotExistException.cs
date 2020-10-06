using System;

namespace ImposterGame.Game.Exceptions
{
    public class PlayerDoesNotExistException : Exception
    {
        public Guid PlayerId { get; set; }

        public PlayerDoesNotExistException(Guid playerId)
        {
            PlayerId = playerId;
        }
    }
}