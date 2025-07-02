using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using JobFinderAPI.Models;
using Newtonsoft.Json;

namespace JobFinderAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CVController : ControllerBase
    {
        private readonly TestTopCvContext _context;

        public CVController(TestTopCvContext context)
        {
            _context = context;
        }

        // Lấy danh sách tất cả CV của người dùng
        [HttpGet]
        public async Task<IActionResult> GetListCV()
        {
            try
            {
                var cvs = await _context.Cvs
                    .Select(cv => new
                    {
                        id = cv.Id,
                        tieuDe = cv.TieuDe,
                        anhDaiDien = cv.AnhDaiDien,
                        ngayTao = cv.NgayTao
                    })
                    .OrderByDescending(cv => cv.ngayTao)
                    .ToListAsync();

                return Ok(cvs);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Lỗi server: " + ex.Message);
            }
        }

        // Lấy chi tiết 1 CV
        [HttpGet("{id}")]
        public async Task<IActionResult> GetCVById(int id)
        {
            try
            {
                var cv = await _context.Cvs
                    .Where(c => c.Id == id)
                    .Select(c => new
                    {
                        id = c.Id,
                        tieuDe = c.TieuDe,
                        noiDung = c.NoiDung,
                        anhDaiDien = c.AnhDaiDien,
                        ngayTao = c.NgayTao
                    })
                    .FirstOrDefaultAsync();

                if (cv == null)
                    return NotFound("Không tìm thấy CV");

                return Ok(cv);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Lỗi server: " + ex.Message);
            }
        }

        // Tạo mới CV
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreateCV([FromBody] CreateCVRequest request)
        {   
            try
            {
                var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

                var cv = new Cv
                {
                    UngVienId = userId,
                    TieuDe = request.TieuDe,
                    NoiDung = request.NoiDung,
                    AnhDaiDien = request.AnhDaiDien,
                    NgayTao = DateTime.Now
                };

                _context.Cvs.Add(cv);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Tạo CV thành công", id = cv.Id });
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Lỗi server: " + ex.Message);
            }
        }

        // Cập nhật CV
        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateCV(int id, [FromBody] UpdateCVRequest request)
        {
            try
            {
                var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

                var cv = await _context.Cvs.FirstOrDefaultAsync(c => c.Id == id && c.UngVienId == userId);
                if (cv == null)
                    return NotFound("Không tìm thấy CV");

                cv.TieuDe = request.TieuDe ?? cv.TieuDe;
                cv.NoiDung = request.NoiDung ?? cv.NoiDung;
                cv.AnhDaiDien = request.AnhDaiDien ?? cv.AnhDaiDien;
                await _context.SaveChangesAsync();

                return Ok(new { message = "Cập nhật CV thành công" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Lỗi server: " + ex.Message);
            }
        }

        // Xóa CV
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteCV(int id)
        {
            try
            {
                var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

                var cv = await _context.Cvs.FirstOrDefaultAsync(c => c.Id == id && c.UngVienId == userId);
                if (cv == null)
                    return NotFound("Không tìm thấy CV");

                _context.Cvs.Remove(cv);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Xóa CV thành công" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Lỗi server: " + ex.Message);
            }
        }

        // Xem CV - NTD(bất kỳ Nhà Tuyển Dụng nào cũng có thể xem)
        [HttpGet("xem-cv-ntd/{cvId}")]
        public async Task<IActionResult> XemCVTuNhaTuyenDung(int cvId)
        {
            try
            {
                // Tìm CV và thông tin ứng viên
                var cv = await _context.Cvs
                    .Include(c => c.UngVien)
                    .FirstOrDefaultAsync(c => c.Id == cvId);

                if (cv == null)
                    return NotFound("Không tìm thấy CV");

                // Trả về chi tiết CV cho tất cả người dùng
                return Ok(new
                {
                    id = cv.Id,
                    tieuDe = cv.TieuDe,
                    noiDung = cv.NoiDung,
                    anhDaiDien = cv.AnhDaiDien,
                    ngayTao = cv.NgayTao,
                    ungVien = new
                    {
                        hoTen = cv.UngVien.HoTen,
                        email = cv.UngVien.Email
                    }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Lỗi server: " + ex.Message);
            }
        }
    }
    
    public class CreateCVRequest
    {
        public string TieuDe { get; set; } = string.Empty;
        public string NoiDung { get; set; } = string.Empty;
        public string? AnhDaiDien { get; set; }
    }

    public class UpdateCVRequest
    {
        public string? TieuDe { get; set; }
        public string? NoiDung { get; set; }
        public string? AnhDaiDien { get; set; }
    }
}
