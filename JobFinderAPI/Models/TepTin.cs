using System;
using System.Collections.Generic;

namespace JobFinderAPI.Models;

public partial class TepTin
{
    public int Id { get; set; }

    public int? NguoiDungId { get; set; }

    public string? DuongDan { get; set; }

    public string? TenTapTin { get; set; }

    public string? Loai { get; set; }

    public DateTime? NgayTai { get; set; }

    public virtual NguoiDung? NguoiDung { get; set; }
}
