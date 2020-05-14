using System;
using Microsoft.CodeAnalysis.CSharp.Syntax;

namespace Graph_Hopper.Models
{
    public class Player
    {
        public long Id { get; set; }
        public string UserName { get; set; }
        public byte Grade { get; set; }
        public DateTime Created { get; set; }
        public DateTime LoginFirst { get; set; }
        public DateTime LoginLast { get; set; }

        public Player()
        {
            var current = DateTime.Now;
            Created = current;
            LoginFirst = current;
            LoginLast = current;
        }
    }
}
