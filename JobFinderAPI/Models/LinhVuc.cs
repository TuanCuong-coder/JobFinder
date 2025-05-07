using System;
using System.Collections.Generic;

namespace JobFinderAPI.Models;

public partial class LinhVuc
{
    public int Id { get; set; }

    public string? TenLinhVuc { get; set; }

    public virtual ICollection<CongViec> CongViecs { get; set; } = new List<CongViec>();

    public virtual ICollection<LinhVucNguoiDung> LinhVucNguoiDungs { get; set; } = new List<LinhVucNguoiDung>();
}
