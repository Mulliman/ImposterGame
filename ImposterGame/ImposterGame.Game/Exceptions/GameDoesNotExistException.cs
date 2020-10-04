using System;

namespace ImposterGame.Game.Exceptions
{
    public class GameDoesNotExistException : Exception
    {
        public Guid GameId { get; set; }

        public GameDoesNotExistException(Guid gameId)
        {
            GameId = gameId;
        }
    }
}