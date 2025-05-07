using System;
using System.Collections.Generic;

namespace JobFinderAPI.Models;

public partial class CongViec
{
    public int Id { get; set; }

    public string? TieuDe { get; set; }

    public string? MoTa { get; set; }

    public int? LinhVucId { get; set; }

    public int? HinhThucId { get; set; }

    public int? NhaTuyenDungId { get; set; }

    public DateTime? NgayDang { get; set; }

    public virtual HinhThucLamViec? HinhThuc { get; set; }

    public virtual LinhVuc? LinhVuc { get; set; }

    public virtual NguoiDung? NhaTuyenDung { get; set; }

    public virtual ICollection<NopDon> NopDons { get; set; } = new List<NopDon>();
    public virtual ICollection<YeuThich> YeuThiches { get; set; } = new List<YeuThich>();

}
