using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using JobFinderAPI.Models;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace JobFinderAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class YeuThichController : ControllerBase
    {
        private readonly TestTopCvContext _context;

        public YeuThichController(TestTopCvContext context)
        {
            _context = context;
        }

        [Authorize]
      [HttpPost("toggle")]
public async Task<IActionResult> ToggleYeuThich([FromBody] ToggleYeuThichRequest request)
{
    var ungVienId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
    var yeuThich = await _context.YeuThiches
        .FirstOrDefaultAsync(x => x.UngVienId == ungVienId && x.CongViecId == request.CongViecId);

    if (yeuThich != null)
    {
        _context.YeuThiches.Remove(yeuThich);
        await _context.SaveChangesAsync();
        return Ok(new { isYeuThich = false });
    }
    else
    {
        _context.YeuThiches.Add(new YeuThich
        {
            UngVienId = ungVienId,
            CongViecId = request.CongViecId,
            NgayYeuThich = DateTime.UtcNow
        });
        await _context.SaveChangesAsync();
        return Ok(new { isYeuThich = true });
    }
}

        [HttpGet("ungvien/{ungVienId}")]
        public async Task<ActionResult<IEnumerable<YeuThichDTO>>> GetYeuThichByUngVienId(int ungVienId)
        {
            var yeuThiches = await _context.YeuThiches
                .Include(yt => yt.CongViec)
                .Where(yt => yt.UngVienId == ungVienId)
                .Select(yt => new YeuThichDTO
                {
                    YeuThichId = yt.Id,
                    CongViecId = yt.CongViecId,
                    TieuDe = yt.CongViec != null ? yt.CongViec.TieuDe : null,
                    MoTa = yt.CongViec != null ? yt.CongViec.MoTa : null,
                    NgayDang = yt.CongViec != null ? yt.CongViec.NgayDang : (DateTime?)null,
                    NgayYeuThich = yt.NgayYeuThich
                })
                .ToListAsync();
            return yeuThiches;
        }

      [Authorize]
[HttpGet("check")]
public async Task<IActionResult> CheckYeuThich(int congViecId)
{
    var ungVienId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);

    var isYeuThich = await _context.YeuThiches
        .AnyAsync(x => x.UngVienId == ungVienId && x.CongViecId == congViecId);

    return Ok(new { isYeuThich });
}
    }

    // DTO yêu cầu toggle
    public class ToggleYeuThichRequest
    {
        public int UngVienId { get; set; }
        public int CongViecId { get; set; }
    }
}
