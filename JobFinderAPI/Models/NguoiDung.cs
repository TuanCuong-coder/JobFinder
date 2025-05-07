using System;
using System.Collections.Generic;

namespace JobFinderAPI.Models;

public partial class NguoiDung
{
    public int Id { get; set; }

    public string? HoTen { get; set; }

    public string? Email { get; set; }

    public string? MatKhau { get; set; }

    public string? VaiTro { get; set; }

    public string? AnhDaiDien { get; set; }

    public virtual ICollection<CongViec> CongViecs { get; set; } = new List<CongViec>();

    public virtual ICollection<Cv> Cvs { get; set; } = new List<Cv>();

    public virtual ICollection<LinhVucNguoiDung> LinhVucNguoiDungs { get; set; } = new List<LinhVucNguoiDung>();

    public virtual ICollection<NopDon> NopDons { get; set; } = new List<NopDon>();

    public virtual ICollection<TepTin> TepTins { get; set; } = new List<TepTin>();

    public virtual ICollection<ThongBao> ThongBaos { get; set; } = new List<ThongBao>();
    public virtual ICollection<YeuThich> YeuThiches { get; set; } = new List<YeuThich>();

}
