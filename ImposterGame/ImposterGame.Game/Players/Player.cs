using ImposterGame.Model;
using System;

namespace ImposterGame.Game.Players
{
    public class Player : IPlayer
    {
        public Guid Id { get; set; }

        public string Name { get; set; }

        public static Player NewPlayer(string name)
        {
            return new Player
            {
                Id = Guid.NewGuid(),
                Name = name
            };
        }
    }
}