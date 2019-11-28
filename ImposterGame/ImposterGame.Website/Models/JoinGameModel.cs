using System;

namespace ImposterGame.Website.Models
{
    public class JoinGameModel
    {
        public Guid PlayerId { get; set; }

        public string GameCode { get; set; }
    }
}