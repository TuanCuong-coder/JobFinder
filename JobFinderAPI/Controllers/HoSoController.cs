using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using JobFinderAPI.Models;
using System.IO;

namespace JobFinderAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HoSoController : ControllerBase
    {
        private readonly TestTopCvContext _context;
        private readonly IWebHostEnvironment _env;

        public HoSoController(TestTopCvContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        // GET: api/hoso
        [HttpGet]
        [Authorize]
        public async Task<IActionResult> LayHoSo()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var user = await _context.NguoiDungs
                .Include(x => x.LinhVucNguoiDungs)
                .ThenInclude(lv => lv.LinhVuc)
                .Where(x => x.Id == userId)
                .Select(x => new
                {
                    x.Id,
                    x.HoTen,
                    x.Email,
                    x.VaiTro,
                    AnhDaiDien = string.IsNullOrEmpty(x.AnhDaiDien) ? null : $"{Request.Scheme}://{Request.Host}/uploads/{x.AnhDaiDien}",
                    LinhVucs = x.LinhVucNguoiDungs.Select(lv => new
                    {
                        lv.LinhVuc.Id,
                        lv.LinhVuc.TenLinhVuc
                    }).ToList()
                })
                .FirstOrDefaultAsync();

            if (user == null) return NotFound(new { message = "Không tìm thấy người dùng." });

            return Ok(user);
        }

        // PUT: api/hoso
        [HttpPut]
        [Authorize]
        public async Task<IActionResult> CapNhatHoSo([FromForm] CapNhatHoSoDTO dto)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var user = await _context.NguoiDungs.FindAsync(userId);
            if (user == null) return NotFound(new { message = "Không tìm thấy người dùng." });

            if (!string.IsNullOrEmpty(dto.HoTen))
                user.HoTen = dto.HoTen;
            
            if (!string.IsNullOrEmpty(dto.Email))
                user.Email = dto.Email;

            if (!string.IsNullOrEmpty(dto.MatKhauMoi))
                user.MatKhau = dto.MatKhauMoi;

            // Upload ảnh đại diện nếu có
            if (dto.AnhDaiDien != null)
            {
                var uploadsFolder = Path.Combine(_env.WebRootPath ?? "wwwroot", "uploads");
                Directory.CreateDirectory(uploadsFolder);

                var fileName = $"{Guid.NewGuid()}_{dto.AnhDaiDien.FileName}";
                var filePath = Path.Combine(uploadsFolder, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await dto.AnhDaiDien.CopyToAsync(stream);
                }

                user.AnhDaiDien = fileName;
            }

            // Xử lý lĩnh vực: Xóa các lĩnh vực không được chọn và giữ lại các lĩnh vực đã chọn
var linhVucCu = _context.LinhVucNguoiDungs.Where(x => x.NguoiDungId == userId);
_context.LinhVucNguoiDungs.RemoveRange(linhVucCu);

if (dto.LinhVucIds != null && dto.LinhVucIds.Any())
{
    var linhVucMoi = dto.LinhVucIds.Select(id => new LinhVucNguoiDung
    {
        NguoiDungId = userId,
        LinhVucId = id
    });

    _context.LinhVucNguoiDungs.AddRange(linhVucMoi);
}


            await _context.SaveChangesAsync();

            return Ok(new { message = "Cập nhật hồ sơ thành công." });
        }
    }
}
