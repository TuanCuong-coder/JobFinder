using System;
using System.Collections.Generic;

namespace JobFinderAPI.Models;

public partial class ThongBao
{
    public int Id { get; set; }

    public int? NguoiNhanId { get; set; }

    public string? NoiDung { get; set; }

    public string? Loai { get; set; }

    public string? TrangThai { get; set; }

    public DateTime? ThoiGian { get; set; }
    // public int? CongViecId { get; set; }

    public virtual NguoiDung? NguoiNhan { get; set; }
    // public virtual CongViec? CongViec { get; set; }

}
