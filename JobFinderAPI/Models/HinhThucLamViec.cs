using System;
using System.Collections.Generic;

namespace JobFinderAPI.Models;

public partial class HinhThucLamViec
{
    public int Id { get; set; }

    public string? TenHinhThuc { get; set; }

    public virtual ICollection<CongViec> CongViecs { get; set; } = new List<CongViec>();
}
