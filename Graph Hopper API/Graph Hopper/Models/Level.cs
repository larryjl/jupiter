using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Graph_Hopper.Models
{
    public class Level
    {
        public long Id { get; set; }
        public string LevelName { get; set; }
        public byte Difficulty { get; set; }
    }
}
