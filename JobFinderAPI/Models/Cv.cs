using System;
using System.Collections.Generic;

namespace JobFinderAPI.Models;

public partial class Cv
{
    public int Id { get; set; }

    public int? UngVienId { get; set; }

    public string? TieuDe { get; set; }

    public string? NoiDung { get; set; }

    public DateTime? NgayTao { get; set; }

    public string? AnhDaiDien { get; set; }

    public virtual ICollection<NopDon> NopDons { get; set; } = new List<NopDon>();

    public virtual NguoiDung? UngVien { get; set; }
}
