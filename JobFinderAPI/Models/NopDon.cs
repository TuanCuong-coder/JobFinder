using System;
using System.Collections.Generic;

namespace JobFinderAPI.Models;

public partial class NopDon
{
    public int Id { get; set; }

    public int? CongViecId { get; set; }

    public int? UngVienId { get; set; }

    public int? CvId { get; set; }

    public DateTime? NgayNop { get; set; }

    public bool? DaXem { get; set; }

    public virtual CongViec? CongViec { get; set; }

    public virtual Cv? Cv { get; set; }

    public virtual NguoiDung? UngVien { get; set; }
}
