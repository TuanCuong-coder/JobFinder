using JobFinderAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace JobFinderAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BaiDangController : ControllerBase
    {
        private readonly TestTopCvContext _context;

        public BaiDangController(TestTopCvContext context)
        {
            _context = context;
        }

        [HttpGet]
        [Authorize(Roles = "nha_tuyen_dung")]
        public async Task<IActionResult> LayDanhSachBaiDang()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var list = await _context.CongViecs
                .Where(cv => cv.NhaTuyenDungId == userId)
                .Include(cv => cv.LinhVuc)
                .Include(cv => cv.HinhThuc)
                .OrderByDescending(cv => cv.NgayDang)
                .Select(cv => new
                {
                    cv.Id,
                    cv.TieuDe,
                    LinhVuc = cv.LinhVuc!.TenLinhVuc,
                    HinhThuc = cv.HinhThuc!.TenHinhThuc,
                    cv.NgayDang
                })
                .ToListAsync();

            return Ok(list);
        }


        [HttpPost]
        [Authorize(Roles = "nha_tuyen_dung")]
        public async Task<IActionResult> TaoBaiDang([FromBody] TaoBaiDangModel model)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var congViec = new CongViec
            {
                TieuDe = model.TieuDe,
                MoTa = model.MoTa,
                LinhVucId = model.LinhVucId,
                HinhThucId = model.HinhThucId,
                NhaTuyenDungId = userId,
                NgayDang = DateTime.Now
            };

            _context.CongViecs.Add(congViec);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Tạo bài đăng thành công", congViec.Id });
        }


        [HttpGet("{id}")]
        [Authorize(Roles = "nha_tuyen_dung")]
        public async Task<IActionResult> LayChiTietBaiDang(int id)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var cv = await _context.CongViecs
                .Include(c => c.LinhVuc)
                .Include(c => c.HinhThuc)
                .FirstOrDefaultAsync(c => c.Id == id && c.NhaTuyenDungId == userId);

            if (cv == null)
                return NotFound();

            return Ok(new
            {
                cv.Id,
                cv.TieuDe,
                cv.MoTa,
                LinhVuc = new { cv.LinhVucId, Ten = cv.LinhVuc!.TenLinhVuc },
                HinhThuc = new { cv.HinhThucId, Ten = cv.HinhThuc!.TenHinhThuc },
                cv.NgayDang
            });
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "nha_tuyen_dung")]
        public async Task<IActionResult> SuaBaiDang(int id, [FromBody] CongViecModel model)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var cv = await _context.CongViecs
                .FirstOrDefaultAsync(c => c.Id == id && c.NhaTuyenDungId == userId);

            if (cv == null)
                return NotFound();

            cv.TieuDe = model.TieuDe;
            cv.MoTa = model.MoTa;
            cv.LinhVucId = model.LinhVucId;
            cv.HinhThucId = model.HinhThucId;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Cập nhật bài đăng thành công" });
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "nha_tuyen_dung")]
        public async Task<IActionResult> XoaBaiDang(int id)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var cv = await _context.CongViecs
                .FirstOrDefaultAsync(c => c.Id == id && c.NhaTuyenDungId == userId);

            if (cv == null)
                return NotFound(new { message = "Không tìm thấy bài đăng." });

            try
            {
                // Xoá các đơn ứng tuyển liên quan trước
                var donUngTuyens = await _context.NopDons
                    .Where(nd => nd.CongViecId == id)
                    .ToListAsync();

                _context.NopDons.RemoveRange(donUngTuyens);

                // Xoá bài đăng
                _context.CongViecs.Remove(cv);

                await _context.SaveChangesAsync();

                return Ok(new { message = "Xoá bài đăng thành công" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "Lỗi khi xoá bài đăng",
                    error = ex.Message
                });
            }
        }
    }
}
