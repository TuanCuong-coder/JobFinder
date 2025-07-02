using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using JobFinderAPI.Models;
using System.Linq;
using System.Threading.Tasks;

namespace JobFinderAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CongViecController : ControllerBase
    {
        private readonly TestTopCvContext _context;

        public CongViecController(TestTopCvContext context)
        {
            _context = context;
        }

        // GET api/CongViec
        [HttpGet]
        public async Task<IActionResult> LayTatCaCongViec()
        {
            var list = await _context.CongViecs
                .Include(cv => cv.LinhVuc)
                .Include(cv => cv.HinhThuc)
                .Include(cv => cv.NhaTuyenDung)
                .Select(cv => new {
                    cv.Id,
                    cv.TieuDe,
                    cv.MoTa,
                    linhVuc = new { cv.LinhVuc.Id, cv.LinhVuc.TenLinhVuc },
                    hinhThuc = new { cv.HinhThuc.Id, cv.HinhThuc.TenHinhThuc },
                    nhaTuyenDung = cv.NhaTuyenDung.HoTen,
                    cv.NgayDang
                })
                .ToListAsync();

            return Ok(list);
        }
        
    // GET api/CongViec/{id}
        [HttpGet("{id}")]
    public async Task<IActionResult> LayChiTietCongViec(int id)
        {
            var congViec = await _context.CongViecs
            .Include(cv => cv.LinhVuc)
            .Include(cv => cv.HinhThuc)
            .Include(cv => cv.NhaTuyenDung)
            .Where(cv => cv.Id == id)
            .Select(cv => new {
            cv.Id,
            cv.TieuDe,
            cv.MoTa,
            linhVuc = new { cv.LinhVuc.Id, cv.LinhVuc.TenLinhVuc },
            hinhThuc = new { cv.HinhThuc.Id, cv.HinhThuc.TenHinhThuc },
            nhaTuyenDung = cv.NhaTuyenDung.HoTen,
            cv.NgayDang
        })
        .FirstOrDefaultAsync();
        if (congViec == null)
        return NotFound();
        return Ok(congViec);
        }

        // goi y cong viec
        [HttpGet("goi-y")]
        [Authorize]
        public async Task<IActionResult> GoiYCongViec()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var fieldIds = await _context.LinhVucNguoiDungs
                .Where(x => x.NguoiDungId == userId)
                .Select(x => x.LinhVucId)
                .ToListAsync();
            var suggestions = await _context.CongViecs
                .Where(cv => fieldIds.Contains(cv.LinhVucId))
                .Select(cv => new {
                    cv.Id,
                    cv.TieuDe,
                    cv.MoTa,
                    linhVuc = new { cv.LinhVuc.Id, cv.LinhVuc.TenLinhVuc },
                    cv.NgayDang
                })
                .ToListAsync();
            return Ok(suggestions);
        }
    }
}
