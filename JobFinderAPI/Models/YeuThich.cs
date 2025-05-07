using System;
using System.Collections.Generic;

namespace JobFinderAPI.Models
{
    public partial class YeuThich
    {
        public int Id { get; set; }
        public int UngVienId { get; set; }
        public int CongViecId { get; set; }
        public DateTime NgayYeuThich { get; set; }

        public virtual NguoiDung UngVien { get; set; }
        public virtual CongViec CongViec { get; set; }
    }
}
