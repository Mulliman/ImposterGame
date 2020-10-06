using System;

namespace ImposterGame.Website.Models
{
    public class AddAnswerModel
    {
        public Guid GameId { get; set; }

        public Guid PlayerId { get; set; }

        public string Word { get; set; }
    }
}