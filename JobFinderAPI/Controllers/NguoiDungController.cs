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

        [HttpPost("dang-ky")]
        public async Task<IActionResult> DangKy([FromBody] DangKyDTO dto)
        {
            if (await _context.NguoiDungs.AnyAsync(x => x.Email == dto.Email))
                return BadRequest(new { message = "Email đã tồn tại" });

         
            var user = new NguoiDung
            {
                HoTen = dto.HoTen,
                Email = dto.Email,
                MatKhau = dto.MatKhau,
                VaiTro = dto.VaiTro,
                AnhDaiDien = dto.AnhDaiDien // AnhDaiDien có thể là null
            };

            _context.NguoiDungs.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Đăng ký thành công", user.Id });
        }

        // Đăng nhập
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

[HttpGet("thong-tin")]
[Authorize]
public async Task<IActionResult> LayThongTin()
{
    var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
    var user = await _context.NguoiDungs.FindAsync(userId);

  
    return Ok(new
    {
        id = user.Id,
        ho_ten = user.HoTen,
        email = user.Email,
        vai_tro = user.VaiTro,
        anh_dai_dien = user.AnhDaiDien
    });
}

        // GET api/NguoiDung/so-luong-cong-viec
        [HttpGet("so-luong-cong-viec")]
        [Authorize]
public async Task<IActionResult> SoLuongCongViec()
{
    var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);


    var fieldIds = await _context.LinhVucNguoiDungs
        .Where(lv => lv.NguoiDungId == userId)
        .Select(lv => lv.LinhVucId)
        .ToListAsync();

    var phuHop = await _context.CongViecs
        .CountAsync(j => fieldIds.Contains(j.LinhVucId));

    return Ok(new {
        phuHop
    });
}

    }
}
