namespace JobFinderAPI.Models
{
    public class NguoiDungDTO
    {
        public string HoTen { get; set; }
        public string Email { get; set; }
        public string MatKhau { get; set; }
        public string VaiTro { get; set; } // 'ung_vien' hoặc 'nha_tuyen_dung'
        public string? AnhDaiDien { get; set; }
    }
}
