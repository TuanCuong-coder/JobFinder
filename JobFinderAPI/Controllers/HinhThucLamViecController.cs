using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using JobFinderAPI.Models;

namespace JobFinderAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HinhThucLamViecController : ControllerBase
    {
        private readonly TestTopCvContext _context;

        public HinhThucLamViecController(TestTopCvContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var list = await _context.HinhThucLamViecs
                .Select(ht => new {
                    ht.Id,
                    Ten = ht.TenHinhThuc
                })
                .ToListAsync();

            return Ok(list);
        }
    }
}
