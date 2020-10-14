using System;
using System.Collections.Generic;

namespace ImposterGame.OptionGrids.Basics
{
    public class Colours : HardcodedOptionGrid
    {
        private static readonly Guid _id = new Guid("A174B999-890C-41C2-A969-86E84BC59CBC");

        public Colours() : base(_id, "Colours")
        {
        }

        public override IList<string> Options => new[] {
            "Red",
            "Yellow",
            "Blue",
            "Green",
            "Orange",
            "Purple",
            "Brown",
            "Pink",
            "Gold",
            "Silver",
            "Grey",
            "White",
            "Black",
            "Maroon",
            "Beige",
            "Navy"
        };
    }
}