using Microsoft.AspNetCore.Mvc;
using JobFinderAPI.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace JobFinderAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ThongBaoController : ControllerBase
    {
        private readonly TestTopCvContext _context;

        public ThongBaoController(TestTopCvContext context)
        {
            _context = context;
        }

        // Lấy danh sách thông báo cho nhà tuyển dụng (loại: 'nop_cv')
        [HttpGet("NhaTuyenDung")]
        [Authorize]
        public async Task<IActionResult> LayThongBaoNhaTuyenDung()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var thongBao = await _context.ThongBaos
                .Where(tb => tb.NguoiNhanId == userId && tb.Loai == "nop_cv")
                .OrderByDescending(tb => tb.ThoiGian)
                .Select(tb => new
                {
                    tb.Id,
                    tb.NoiDung,
                    tb.Loai,
                    tb.TrangThai,
                    tb.ThoiGian
                })
                .ToListAsync();

            return Ok(thongBao);
        }

        // Lấy danh sách thông báo cho ứng viên (loại: 'xem_cv')
        [HttpGet("UngVien")]
        [Authorize]
        public async Task<IActionResult> LayThongBaoUngVien()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var thongBao = await _context.ThongBaos
                .Where(tb => tb.NguoiNhanId == userId && tb.Loai == "xem_cv")
                .OrderByDescending(tb => tb.ThoiGian)
                .Select(tb => new
                {
                    tb.Id,
                    tb.NoiDung,
                    tb.Loai,
                    tb.TrangThai,
                    tb.ThoiGian
                })
                .ToListAsync();

            return Ok(thongBao);
        }
        
        // Đánh dấu 1 thông báo là đã đọc
        [HttpPost("DanhDauDaDoc/{id}")]
        [Authorize]
        public async Task<IActionResult> DanhDauDaDoc(int id)
        {
            var thongBao = await _context.ThongBaos.FindAsync(id);
            if (thongBao == null)
                return NotFound(new { message = "Không tìm thấy thông báo" });

            thongBao.TrangThai = "da_doc";
            await _context.SaveChangesAsync();

            return Ok(new { message = "Đã đánh dấu đã đọc" });
        }

        // Lấy tổng số thông báo chưa đọc
        [HttpGet("ChuaDoc")]
        [Authorize]
        public async Task<IActionResult> DemThongBaoChuaDoc()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var soLuong = await _context.ThongBaos
                .CountAsync(tb => tb.NguoiNhanId == userId && tb.TrangThai == "chua_doc");

            return Ok(new { soLuong });
        }
    }
}
