namespace JobFinderAPI.Models
{
    public class DangKyDTO
    {
        public string HoTen { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string MatKhau { get; set; } = null!;
        public string VaiTro { get; set; } = null!;
        public string? AnhDaiDien { get; set; }
    }
}
