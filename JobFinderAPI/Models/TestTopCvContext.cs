using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace JobFinderAPI.Models;

public partial class TestTopCvContext : DbContext
{
    public TestTopCvContext()
    {
    }

    public TestTopCvContext(DbContextOptions<TestTopCvContext> options)
        : base(options)
    {
    }

    public virtual DbSet<CongViec> CongViecs { get; set; }

    public virtual DbSet<Cv> Cvs { get; set; }

    public virtual DbSet<HinhThucLamViec> HinhThucLamViecs { get; set; }

    public virtual DbSet<LinhVuc> LinhVucs { get; set; }

    public virtual DbSet<LinhVucNguoiDung> LinhVucNguoiDungs { get; set; }

    public virtual DbSet<NguoiDung> NguoiDungs { get; set; }

    public virtual DbSet<NopDon> NopDons { get; set; }

    public virtual DbSet<TepTin> TepTins { get; set; }

    public virtual DbSet<ThongBao> ThongBaos { get; set; }
    public virtual DbSet<YeuThich> YeuThiches { get; set; } 

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("Server=TUANCUONG;Database=TestTopCV;User Id=sa;Password=123456;TrustServerCertificate=True;");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<CongViec>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Cong_vie__3213E83FA6F726C8");

            entity.ToTable("Cong_viec");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.HinhThucId).HasColumnName("hinh_thuc_id");
            entity.Property(e => e.LinhVucId).HasColumnName("linh_vuc_id");
            entity.Property(e => e.MoTa).HasColumnName("mo_ta");
            entity.Property(e => e.NgayDang)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime")
                .HasColumnName("ngay_dang");
            entity.Property(e => e.NhaTuyenDungId).HasColumnName("nha_tuyen_dung_id");
            entity.Property(e => e.TieuDe)
                .HasMaxLength(255)
                .HasColumnName("tieu_de");

            entity.HasOne(d => d.HinhThuc).WithMany(p => p.CongViecs)
                .HasForeignKey(d => d.HinhThucId)
                .HasConstraintName("FK__Cong_viec__hinh___59063A47");

            entity.HasOne(d => d.LinhVuc).WithMany(p => p.CongViecs)
                .HasForeignKey(d => d.LinhVucId)
                .HasConstraintName("FK__Cong_viec__linh___5812160E");

            entity.HasOne(d => d.NhaTuyenDung).WithMany(p => p.CongViecs)
                .HasForeignKey(d => d.NhaTuyenDungId)
                .HasConstraintName("FK__Cong_viec__nha_t__59FA5E80");
        });

        modelBuilder.Entity<Cv>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__CV__3213E83FE72B5FBE");

            entity.ToTable("CV");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.AnhDaiDien)
                .HasMaxLength(255)
                .HasColumnName("anh_dai_dien");
            entity.Property(e => e.NgayTao)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime")
                .HasColumnName("ngay_tao");
            entity.Property(e => e.NoiDung).HasColumnName("noi_dung");
            entity.Property(e => e.TieuDe)
                .HasMaxLength(255)
                .HasColumnName("tieu_de");
            entity.Property(e => e.UngVienId).HasColumnName("ung_vien_id");

            entity.HasOne(d => d.UngVien).WithMany(p => p.Cvs)
                .HasForeignKey(d => d.UngVienId)
                .HasConstraintName("FK__CV__ung_vien_id__5070F446");
        });

        modelBuilder.Entity<HinhThucLamViec>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Hinh_thu__3213E83FB487129A");

            entity.ToTable("Hinh_thuc_lam_viec");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.TenHinhThuc)
                .HasMaxLength(50)
                .HasColumnName("ten_hinh_thuc");
        });

        modelBuilder.Entity<LinhVuc>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Linh_vuc__3213E83F72376934");

            entity.ToTable("Linh_vuc");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.TenLinhVuc)
                .HasMaxLength(100)
                .HasColumnName("ten_linh_vuc");
        });

        modelBuilder.Entity<LinhVucNguoiDung>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Linh_vuc__3213E83F6CBD175B");

            entity.ToTable("Linh_vuc_nguoi_dung");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.LinhVucId).HasColumnName("linh_vuc_id");
            entity.Property(e => e.NguoiDungId).HasColumnName("nguoi_dung_id");

            entity.HasOne(d => d.LinhVuc).WithMany(p => p.LinhVucNguoiDungs)
                .HasForeignKey(d => d.LinhVucId)
                .HasConstraintName("FK__Linh_vuc___linh___6A30C649");

            entity.HasOne(d => d.NguoiDung).WithMany(p => p.LinhVucNguoiDungs)
                .HasForeignKey(d => d.NguoiDungId)
                .HasConstraintName("FK__Linh_vuc___nguoi__693CA210");
        });

        modelBuilder.Entity<NguoiDung>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Nguoi_du__3213E83FD498E8C8");

            entity.ToTable("Nguoi_dung");

            entity.HasIndex(e => e.Email, "UQ__Nguoi_du__AB6E616437104F3E").IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.AnhDaiDien)
                .HasMaxLength(255)
                .HasColumnName("anh_dai_dien");
            entity.Property(e => e.Email)
                .HasMaxLength(100)
                .HasColumnName("email");
            entity.Property(e => e.HoTen)
                .HasMaxLength(100)
                .HasColumnName("ho_ten");
            entity.Property(e => e.MatKhau)
                .HasMaxLength(100)
                .HasColumnName("mat_khau");
            entity.Property(e => e.VaiTro)
                .HasMaxLength(20)
                .HasColumnName("vai_tro");
        });

        modelBuilder.Entity<NopDon>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Nop_don__3213E83F354191DA");

            entity.ToTable("Nop_don");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.CongViecId).HasColumnName("cong_viec_id");
            entity.Property(e => e.CvId).HasColumnName("cv_id");
            entity.Property(e => e.DaXem)
                .HasDefaultValue(false)
                .HasColumnName("da_xem");
            entity.Property(e => e.NgayNop)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime")
                .HasColumnName("ngay_nop");
            entity.Property(e => e.UngVienId).HasColumnName("ung_vien_id");

            entity.HasOne(d => d.CongViec).WithMany(p => p.NopDons)
                .HasForeignKey(d => d.CongViecId)
                .HasConstraintName("FK__Nop_don__cong_vi__5DCAEF64");

            entity.HasOne(d => d.Cv).WithMany(p => p.NopDons)
                .HasForeignKey(d => d.CvId)
                .HasConstraintName("FK__Nop_don__cv_id__5FB337D6");

            entity.HasOne(d => d.UngVien).WithMany(p => p.NopDons)
                .HasForeignKey(d => d.UngVienId)
                .HasConstraintName("FK__Nop_don__ung_vie__5EBF139D");
        });

        modelBuilder.Entity<TepTin>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Tep_tin__3213E83F97FC0EA4");

            entity.ToTable("Tep_tin");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.DuongDan)
                .HasMaxLength(255)
                .HasColumnName("duong_dan");
            entity.Property(e => e.Loai)
                .HasMaxLength(20)
                .HasColumnName("loai");
            entity.Property(e => e.NgayTai)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime")
                .HasColumnName("ngay_tai");
            entity.Property(e => e.NguoiDungId).HasColumnName("nguoi_dung_id");
            entity.Property(e => e.TenTapTin)
                .HasMaxLength(255)
                .HasColumnName("ten_tap_tin");

            entity.HasOne(d => d.NguoiDung).WithMany(p => p.TepTins)
                .HasForeignKey(d => d.NguoiDungId)
                .HasConstraintName("FK__Tep_tin__nguoi_d__5441852A");
        });

        modelBuilder.Entity<ThongBao>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Thong_ba__3213E83FDC6C18CB");

            entity.ToTable("Thong_bao");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Loai)
                .HasMaxLength(50)
                .HasColumnName("loai");
            entity.Property(e => e.NguoiNhanId).HasColumnName("nguoi_nhan_id");
            entity.Property(e => e.NoiDung).HasColumnName("noi_dung");
            entity.Property(e => e.ThoiGian)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime")
                .HasColumnName("thoi_gian");
            entity.Property(e => e.TrangThai)
                .HasMaxLength(20)
                .HasDefaultValue("chua_doc")
                .HasColumnName("trang_thai");

            entity.HasOne(d => d.NguoiNhan).WithMany(p => p.ThongBaos)
                .HasForeignKey(d => d.NguoiNhanId)
                .HasConstraintName("FK__Thong_bao__nguoi__6477ECF3");
    //              // Thêm mối quan hệ giữa ThongBao và CongViec
    // entity.HasOne(d => d.CongViec) // Thêm mối quan hệ với CongViec
    //     .WithMany() // Nếu bạn muốn có navigation property từ CongViec đến ThongBao, bạn có thể thay `WithMany()` thành `.WithMany(cv => cv.ThongBaos)`
    //     .HasForeignKey(d => d.CongViecId)
    //     .HasConstraintName("FK_ThongBao_CongViec"); // Tên ràng buộc khóa ngoại
        });
modelBuilder.Entity<YeuThich>(entity =>
{
    entity.HasKey(e => e.Id).HasName("PK__Yeu_thic__3213E83F12345678"); // tên PK tùy DB tự generate

    entity.ToTable("Yeu_thich");

    entity.Property(e => e.Id).HasColumnName("id");
    entity.Property(e => e.UngVienId).HasColumnName("ung_vien_id");
    entity.Property(e => e.CongViecId).HasColumnName("cong_viec_id");
    entity.Property(e => e.NgayYeuThich)
        .HasDefaultValueSql("(getdate())")
        .HasColumnType("datetime")
        .HasColumnName("ngay_yeu_thich");

    entity.HasOne(d => d.UngVien)
        .WithMany(p => p.YeuThiches)
        .HasForeignKey(d => d.UngVienId)
        .HasConstraintName("FK_YeuThich_NguoiDung");

    entity.HasOne(d => d.CongViec)
        .WithMany(p => p.YeuThiches)
        .HasForeignKey(d => d.CongViecId)
        .HasConstraintName("FK_YeuThich_CongViec");
});

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
