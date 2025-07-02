using Microsoft.AspNetCore.Mvc;
using JobFinderAPI.Models;
using JobFinderAPI.Helpers;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace JobFinderAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class NguoiDungController : ControllerBase
    {
        private readonly TestTopCvContext _context;
        private readonly JwtHelper _jwtHelper;

        public NguoiDungController(TestTopCvContext context, JwtHelper jwtHelper)
        {
            _context = context;
            _jwtHelper = jwtHelper;
        }

        //lay thong tin nguoi dung
        [HttpGet("thong-tin")]
        [Authorize]
        public async Task<IActionResult> LayThongTin()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var user = await _context.NguoiDungs.FindAsync(userId);

            if (user == null)
                return NotFound(new { message = "Không tìm thấy người dùng" });

            return Ok(new
            {
                id = user.Id,
                ho_ten = user.HoTen,
                email = user.Email,
                vai_tro = user.VaiTro,
                anh_dai_dien = user.AnhDaiDien
            });
        }

        //dang nhap
        [HttpPost("dang-nhap")]
        public async Task<IActionResult> DangNhap([FromBody] DangNhapDTO dto)
        {
            var user = await _context.NguoiDungs
                .FirstOrDefaultAsync(x => x.Email == dto.Email && x.MatKhau == dto.MatKhau);

            if (user == null)
                return Unauthorized(new { message = "Email hoặc mật khẩu không đúng" });

            var token = _jwtHelper.GenerateToken(user.Id.ToString(), user.VaiTro ?? "NguoiTimViec");

            return Ok(new
            {
                message = "Đăng nhập thành công",
                token,
                user = new
                {
                    user.Id,
                    user.HoTen,
                    user.Email,
                    user.VaiTro,
                    user.AnhDaiDien
                }
            });
        }

        //dang ky
        [HttpPost("dang-ky")]
        public async Task<IActionResult> DangKy([FromBody] DangKyDTO dto)
        {
            if (await _context.NguoiDungs.AnyAsync(x => x.Email == dto.Email))
                return BadRequest(new { message = "Email đã tồn tại" });

            if (string.IsNullOrEmpty(dto.VaiTro) || (dto.VaiTro != "ung_vien" && dto.VaiTro != "nha_tuyen_dung"))
                return BadRequest(new { message = "Vai trò không hợp lệ" });

            var user = new NguoiDung
            {
                HoTen = dto.HoTen,
                Email = dto.Email,
                MatKhau = dto.MatKhau,
                VaiTro = dto.VaiTro,
                AnhDaiDien = dto.AnhDaiDien
            };

            _context.NguoiDungs.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Đăng ký thành công", user.Id });
        }

        //de xuat cong viec
        [HttpGet("so-luong-cong-viec")]
        [Authorize]
        public async Task<IActionResult> SoLuongCongViec()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var daUngTuyen = await _context.NopDons
                .CountAsync(n => n.UngVienId == userId);

            var uaThich = await _context.YeuThiches
                .CountAsync(y => y.UngVienId == userId);

            var fieldIds = await _context.LinhVucNguoiDungs
                .Where(lv => lv.NguoiDungId == userId)
                .Select(lv => lv.LinhVucId)
                .ToListAsync();

            var phuHop = await _context.CongViecs
                .CountAsync(j => fieldIds.Contains(j.LinhVucId));

            return Ok(new
            {
                daUngTuyen,
                uaThich,
                phuHop
            });
        }
    }
}
