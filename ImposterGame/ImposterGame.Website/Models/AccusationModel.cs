using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ImposterGame.Website.Models
{
    public class AccusationModel
    {
        public Guid GameId { get; set; }

        public Guid PlayerId { get; set; }

        public Guid AccusedPlayerId { get; set; }

        public int Wager { get; set; }
    }
}