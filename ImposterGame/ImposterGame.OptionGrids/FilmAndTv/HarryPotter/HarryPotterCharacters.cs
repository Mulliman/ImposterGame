using System;
using System.Collections.Generic;
using System.Text;

namespace ImposterGame.OptionGrids.FilmAndTv.HarryPotter
{
    class HarryPotterCharacters : HardcodedOptionGrid
    {
        private static readonly Guid _id = new Guid("CA74B95F-890C-41C2-A969-86E84BC59CBD");

        public HarryPotterCharacters() : base(_id, "Harry Potter Characters")
        {
        }

        public override IList<string> Options => new[]
        {
            "Harry Potter",
            "Hermione Grainger",
            "Ron Weasley",
            "Luna Lovegood",
            "Fred Weasley",
            "George Weasley",
            "Ginny Weasley",
            "Draco Malfoy",
            "Albus Dumbledore",
            "Serverus Snape",
            "Sirius Black",
            "Voldemort",
            "Bellatrix Lestrange",
            "Rubeus Hagrid",
            "Dobby",
            "Remus Lupin",
            "Peter Pettigrew",
            "Minerva McGonagall",
            "Dolores Umbridge",
            "James Potter",
            "Lily Potter"
        };
    }
}