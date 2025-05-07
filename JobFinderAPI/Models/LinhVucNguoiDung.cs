using System;
using System.Collections.Generic;

namespace JobFinderAPI.Models;

public partial class LinhVucNguoiDung
{
    public int Id { get; set; }

    public int? NguoiDungId { get; set; }

    public int? LinhVucId { get; set; }

    public virtual LinhVuc? LinhVuc { get; set; }

    public virtual NguoiDung? NguoiDung { get; set; }
}
