using System;
using System.Collections.Generic;
using System.Text;

namespace ImposterGame.Game.Exceptions
{
    public class PlayerWithSameNameAlreadyExistsException : Exception
    {
        public string Name { get; set; }

        public PlayerWithSameNameAlreadyExistsException(string name)
        {
            Name = name;
        }
    }
}