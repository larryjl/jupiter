using System;

namespace Graph_Hopper.Models
{
    public class Attempt
    {
        public long Id { get; set; }
        public long PlayerId { get; set; }
        public long LevelId { get; set; }
        public DateTime StartedAt { get; set; }
        public DateTime EndedAt { get; set; }
        public string StartPosition { get; set; }
        public string TargetPosition { get; set; }

        public Attempt()
        {
            StartedAt = DateTime.Now;
        }
    }
}
