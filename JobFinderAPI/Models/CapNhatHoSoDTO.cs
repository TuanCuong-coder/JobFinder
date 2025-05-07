using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace JobFinderAPI.Models
{
    public class CapNhatHoSoDTO
    {
        [Required]
        public string HoTen { get; set; }

        [Required]
        public string Email { get; set; }

        public string? MatKhauMoi { get; set; }

        public IFormFile? AnhDaiDien { get; set; }

        public List<int>? LinhVucIds { get; set; }
    }
}
