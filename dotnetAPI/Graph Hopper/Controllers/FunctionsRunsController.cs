using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Graph_Hopper.Models;

namespace Graph_Hopper.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FunctionsRunsController : ControllerBase
    {
        private readonly GraphHopperContext _context;

        public FunctionsRunsController(GraphHopperContext context)
        {
            _context = context;
        }

        // GET: api/FunctionsRuns
        [HttpGet]
        public async Task<ActionResult<IEnumerable<FunctionsRun>>> GetFunctionsRuns()
        {
            return await _context.FunctionsRuns.ToListAsync();
        }

        // GET: api/FunctionsRuns/5
        [HttpGet("{id}")]
        public async Task<ActionResult<FunctionsRun>> GetFunctionsRun(long id)
        {
            var functionsRun = await _context.FunctionsRuns.FindAsync(id);

            if (functionsRun == null)
            {
                return NotFound();
            }

            return functionsRun;
        }

        // PUT: api/FunctionsRuns/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutFunctionsRun(long id, FunctionsRun functionsRun)
        {
            if (id != functionsRun.Id)
            {
                return BadRequest();
            }

            _context.Entry(functionsRun).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!FunctionsRunExists(id))
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

        // POST: api/FunctionsRuns
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPost]
        public async Task<ActionResult<FunctionsRun>> PostFunctionsRun(FunctionsRun functionsRun)
        {
            _context.FunctionsRuns.Add(functionsRun);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetFunctionsRun), new { id = functionsRun.Id }, functionsRun);
        }

        // DELETE: api/FunctionsRuns/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<FunctionsRun>> DeleteFunctionsRun(long id)
        {
            var functionsRun = await _context.FunctionsRuns.FindAsync(id);
            if (functionsRun == null)
            {
                return NotFound();
            }

            _context.FunctionsRuns.Remove(functionsRun);
            await _context.SaveChangesAsync();

            return functionsRun;
        }

        private bool FunctionsRunExists(long id)
        {
            return _context.FunctionsRuns.Any(e => e.Id == id);
        }
    }
}
