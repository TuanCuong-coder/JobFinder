using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using JobFinderAPI.Models;

namespace JobFinderAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LinhVucController : ControllerBase
    {
        private readonly TestTopCvContext _context;
        public LinhVucController(TestTopCvContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> LayDanhSachLinhVuc()
        {
            var list = await _context.LinhVucs
                .Select(x => new {
                    x.Id,
                    x.TenLinhVuc
                }).ToListAsync();

            return Ok(list);
        }
    }
}
