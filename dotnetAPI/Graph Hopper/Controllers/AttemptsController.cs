using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Graph_Hopper.Models;
using Microsoft.Extensions.Logging;

namespace Graph_Hopper.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AttemptsController : ControllerBase
    {
        private readonly GraphHopperContext _context;
        private readonly ILogger _logger;

        public AttemptsController(GraphHopperContext context, ILogger<PlayersController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: api/Attempts
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Attempt>>> GetAttempts()
        {
            return await _context.Attempts.ToListAsync();
        }

        // GET: api/Attempts/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Attempt>> GetAttempt(long id)
        {
            var attempt = await _context.Attempts.FindAsync(id);

            if (attempt == null)
            {
                return NotFound();
            }

            return attempt;
        }

        // GET: api/Attempts/PlayerId=4
        [HttpGet("PlayerId={playerId}")]
        public async Task<ActionResult<IEnumerable<Attempt>>> GetAttemptsByPlayerId(long playerId)
        {
            var attempts = await _context.Attempts.Where(p => p.PlayerId == playerId).ToListAsync();

            if (attempts.Count == 0)
            {
                return NotFound();
            }

            return attempts;
        }

        // GET: api/Attempts/LastLevel/PlayerId=4
        [HttpGet("LastLevel/PlayerId={playerId}")]
        public async Task<ActionResult<object>> GetLastLevelAttemptsByPlayerId(long playerId)
        {
            DbSet<Attempt> attempts = _context.Attempts;
            DbSet<Level> levels = _context.Levels;

            var joined = attempts
                .Where(attempt => attempt.PlayerId == playerId)
                .Join(levels,
                    attempt => attempt.LevelId,
                    level => level.Id,
                    ((attempt, level) => new
                    {
                        attempt.PlayerId,
                        AttemptId = attempt.Id,
                        LevelId = level.Id,
                        level.LevelName,
                        level.Difficulty,

                    }));
            var result = await joined
                .Where(p => p.Difficulty == joined.Max(p => p.Difficulty))
                .ToListAsync();
            
            _logger.LogInformation("result: Type is {0}", result.GetType());

            if (result.Count == 0)
            {
                return NotFound();
            }

            return result;
        }



        // PUT: api/Attempts/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAttempt(long id, Attempt attempt)
        {
            if (id != attempt.Id)
            {
                return BadRequest();
            }

            _context.Entry(attempt).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AttemptExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // PATCH: api/Attempts/EndAttempt/4
        [HttpPatch("EndAttempt/{id}")]
        public async Task<IActionResult> EndAttempt(long id)
        {
            var attempt = await _context.Attempts.FindAsync(id);

            if (attempt == null)
            {
                return NotFound();
            }

            attempt.EndedAt = DateTime.Now;
            _context.Entry(attempt).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // POST: api/Attempts
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPost]
        public async Task<ActionResult<Attempt>> PostAttempt(Attempt attempt)
        {
            _context.Attempts.Add(attempt);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetAttempt), new { id = attempt.Id }, attempt);
        }

        // DELETE: api/Attempts/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Attempt>> DeleteAttempt(long id)
        {
            var attempt = await _context.Attempts.FindAsync(id);
            if (attempt == null)
            {
                return NotFound();
            }

            _context.Attempts.Remove(attempt);
            await _context.SaveChangesAsync();

            return attempt;
        }

        private bool AttemptExists(long id)
        {
            return _context.Attempts.Any(e => e.Id == id);
        }
    }
}
