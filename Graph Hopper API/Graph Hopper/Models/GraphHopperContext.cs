using Microsoft.EntityFrameworkCore;

namespace Graph_Hopper.Models
{
    public class GraphHopperContext : DbContext
    {
        public GraphHopperContext(DbContextOptions<GraphHopperContext> options)
            : base(options)
        {
        }

        public DbSet<Player> Players { get; set; }
        public DbSet<Attempt> Attempts { get; set; }
        public DbSet<Level> Levels { get; set; }
        public DbSet<FunctionsRun> FunctionsRuns { get; set; }
    }
}
