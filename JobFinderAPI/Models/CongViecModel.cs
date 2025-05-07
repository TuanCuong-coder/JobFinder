namespace JobFinderAPI.Models
{
    public class CongViecModel
    {
        public string TieuDe { get; set; } = null!;
        public string MoTa { get; set; } = null!;
        public int LinhVucId { get; set; }
        public int HinhThucId { get; set; }
    }
}
