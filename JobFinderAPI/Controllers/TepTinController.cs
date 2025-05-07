using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using JobFinderAPI.Models;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class TepTinController : ControllerBase
{
    private readonly TestTopCvContext _context;
    private readonly IWebHostEnvironment _env;

    public TepTinController(TestTopCvContext context, IWebHostEnvironment env)
    {
        _context = context;
        _env = env;
    }

    [HttpPost("upload")]
    public async Task<IActionResult> UploadImage([FromForm] IFormFile file)
    {
        if (file == null || !file.ContentType.StartsWith("image/"))
            return BadRequest("Chỉ được upload ảnh");

        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        var fileName = $"{Guid.NewGuid()}_{file.FileName}";
        var filePath = Path.Combine(_env.WebRootPath, "uploads", fileName);

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        var tepTin = new TepTin
        {
            NguoiDungId = userId,
            DuongDan = "/uploads/" + fileName,
            TenTapTin = file.FileName,
            Loai = "image"
        };

        _context.TepTins.Add(tepTin);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Tải ảnh thành công", id = tepTin.Id });
    }

    [HttpGet]
    public async Task<IActionResult> GetUserFiles()
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var files = await _context.TepTins
            .Where(f => f.NguoiDungId == userId && f.Loai == "image")
            .OrderByDescending(f => f.NgayTai)
            .Select(f => new {
                id = f.Id,
                tenTapTin = f.TenTapTin,
                duongDan = f.DuongDan,
                ngayTai = f.NgayTai
            }).ToListAsync();

        return Ok(files);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteFile(int id)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var file = await _context.TepTins.FirstOrDefaultAsync(f => f.Id == id && f.NguoiDungId == userId);
        if (file == null)
            return NotFound("Không tìm thấy tệp");

        var path = Path.Combine(_env.WebRootPath, file.DuongDan.TrimStart('/'));
        if (System.IO.File.Exists(path))
            System.IO.File.Delete(path);

        _context.TepTins.Remove(file);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Xoá tệp thành công" });
    }


// lay file theo id 
    [HttpGet("{id}")]
public async Task<IActionResult> GetFileById(int id)
{
    var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    var file = await _context.TepTins
        .Where(f => f.Id == id && f.NguoiDungId == userId)
        .Select(f => new {
            id = f.Id,
            tenTapTin = f.TenTapTin,
            duongDan = f.DuongDan,
            ngayTai = f.NgayTai
        })
        .FirstOrDefaultAsync();

    if (file == null)
        return NotFound("Không tìm thấy tệp");

    return Ok(file);
}

}
