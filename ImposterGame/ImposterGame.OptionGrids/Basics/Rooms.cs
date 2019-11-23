using System;
using System.Collections.Generic;

namespace ImposterGame.OptionGrids.Basics
{
    public class Rooms : HardcodedOptionGrid
    {
        private static readonly Guid _id = new Guid("B174B999-890C-41C2-A969-86E84BC59CBC");

        public Rooms() : base(_id, "Rooms")
        {
        }

        public override IList<string> Options => new[] {
            "Lounge",
            "Kitchen",
            "Bathroom",
            "Study",
            "Nursery",
            "Greenhouse",
            "Conservatory",
            "Dining Room",
            "Library",
            "Bedroom",
            "Porch",
            "Shed",
            "Scullery",
            "Attic",
            "Basement",
            "Garage",
            "Pantry"
        };
    }
}