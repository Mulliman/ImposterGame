using System;

namespace ImposterGame.Game.Exceptions
{
    public class GridDoesNotExistException : Exception
    {
        public Guid GridId { get; set; }

        public GridDoesNotExistException(Guid gridId)
        {
            GridId = gridId;
        }
    }
}