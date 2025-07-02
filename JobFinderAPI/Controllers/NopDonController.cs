using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using JobFinderAPI.Models;
using System.Threading.Tasks;
using System.Linq;

namespace JobFinderAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class NopDonController : ControllerBase
    {
        private readonly TestTopCvContext _context;

        public NopDonController(TestTopCvContext context)
        {
            _context = context;
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> NopDon([FromBody] NopDon model)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            model.UngVienId = userId;
            model.NgayNop = DateTime.Now;
            model.DaXem = false;

            _context.NopDons.Add(model);
            await _context.SaveChangesAsync();

            // Gọi procedure tạo thông báo cho nhà tuyển dụng
            await _context.Database.ExecuteSqlRawAsync(
                "EXEC TaoThongBaoNopCV @p0, @p1, @p2",
                model.UngVienId, model.CongViecId, model.CvId
            );

            return Ok(new { message = "Nộp đơn thành công!" });
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> LayDanhSachNopDon()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var list = await _context.NopDons
                .Include(nd => nd.CongViec)
                .Include(nd => nd.Cv)
                .Where(nd => nd.UngVienId == userId)
                .Select(nd => new
                {
                    nd.Id,
                    congViec = new { nd.CongViec.Id, nd.CongViec.TieuDe },
                    cv = new { nd.Cv.Id, nd.Cv.TieuDe },
                    nd.NgayNop,
                    nd.DaXem
                })
                .ToListAsync();

            return Ok(list);
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> CapNhatNopDon(int id, [FromBody] NopDon model)
        {
            var nopDon = await _context.NopDons.FindAsync(id);
            if (nopDon == null) return NotFound();

            nopDon.CvId = model.CvId;
            nopDon.CongViecId = model.CongViecId;
            nopDon.DaXem = model.DaXem;

            await _context.SaveChangesAsync();
            return Ok(new { message = "Cập nhật thành công!" });
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> XoaNopDon(int id)
        {
            var nopDon = await _context.NopDons.FindAsync(id);
            if (nopDon == null) return NotFound();

            _context.NopDons.Remove(nopDon);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Xóa đơn ứng tuyển thành công!" });
        }

    [HttpGet("ung-vien-da-ung-tuyen/{congViecId}")]
    [Authorize]
    public async Task<IActionResult> LayUngVienTheoCongViec(int congViecId)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var congViec = await _context.CongViecs.FindAsync(congViecId);
        if (congViec == null) return NotFound("Không tìm thấy công việc.");
        if (congViec.NhaTuyenDungId != userId)
            return Forbid("Bạn không có quyền xem danh sách ứng viên công việc này.");

        var danhSach = await _context.NopDons
        .Where(nd => nd.CongViecId == congViecId)
        .Include(nd => nd.UngVien)
        .Include(nd => nd.Cv)
        .ToListAsync();

    // Gọi procedure tạo thông báo cho ứng viên
    foreach (var nopDon in danhSach)
    {
        // Chỉ tạo thông báo nếu chưa xem
        if (nopDon.DaXem == false)
        {
            nopDon.DaXem = true; // Cập nhật trạng thái đã xem
            await _context.Database.ExecuteSqlRawAsync(
                "EXEC TaoThongBaoXemCV @p0, @p1",
                parameters: [congViecId, nopDon.UngVienId]
            );
        }
    }
    await _context.SaveChangesAsync();
    // Trả về kết quả
    var ketQua = danhSach.Select(nd => new
    {
        ungVienId = nd.UngVienId,
        hoTen = nd.UngVien.HoTen,
        email = nd.UngVien.Email,
        anhDaiDien = nd.UngVien.AnhDaiDien,
        cvId = nd.CvId,
        cvTieuDe = nd.Cv.TieuDe,
        ngayNop = nd.NgayNop
    });
    return Ok(ketQua);
    }
    }
}
