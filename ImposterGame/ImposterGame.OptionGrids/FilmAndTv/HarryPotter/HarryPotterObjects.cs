using System;
using System.Collections.Generic;

namespace ImposterGame.OptionGrids.FilmAndTv.HarryPotter
{
    public class HarryPotterObjects : HardcodedOptionGrid
    {
        private static readonly Guid _id = new Guid("CA74B95F-890C-41C2-A969-86E84BC59CBC");

        public HarryPotterObjects() : base(_id, "Harry Potter Objects")
        {
        }

        public override IList<string> Options => new[]
        {
            "Wand",
            "Deluminator",
            "Sword",
            "Parchment",
            "Marauders Map",
            "Wizards Chess",
            "Philosophers Stone",
            "Sorting Hat",
            "Broomstick",
            "Quill",
            "Cauldron",
            "Hogwarts Express",
            "Howler",
            "Portrait",
            "Knight Bus",
            "Snitch",
            "Chocolate Frog",
            "Diary",
            "Glasses",
            "Flying Car",
            "Portkey"
        };
    }
}