create database TestTopCV
go 
use TestTopCV 
go

CREATE TABLE Nguoi_dung (
    id INT PRIMARY KEY IDENTITY,
    ho_ten NVARCHAR(100),
    email NVARCHAR(100) UNIQUE,
    mat_khau NVARCHAR(100),
    vai_tro NVARCHAR(20), -- 'ung_vien' hoặc 'nha_tuyen_dung'
    anh_dai_dien NVARCHAR(255)
);

--Lĩnh vực công việc
CREATE TABLE Linh_vuc (
    id INT PRIMARY KEY IDENTITY,
    ten_linh_vuc NVARCHAR(100)
);

--Hình thức làm việc
CREATE TABLE Hinh_thuc_lam_viec (
    id INT PRIMARY KEY IDENTITY,
    ten_hinh_thuc NVARCHAR(50)
);

--CV online
CREATE TABLE CV (
    id INT PRIMARY KEY IDENTITY,
    ung_vien_id INT FOREIGN KEY REFERENCES Nguoi_dung(id),
    tieu_de NVARCHAR(255),
    noi_dung NVARCHAR(MAX),
    ngay_tao DATETIME DEFAULT GETDATE(),
    anh_dai_dien NVARCHAR(255)
);

CREATE TABLE Tep_tin (
    id INT PRIMARY KEY IDENTITY,
    nguoi_dung_id INT FOREIGN KEY REFERENCES Nguoi_dung(id),
    duong_dan NVARCHAR(255),
    ten_tap_tin NVARCHAR(255),
    loai NVARCHAR(20), -- 'pdf', 'image'
    ngay_tai DATETIME DEFAULT GETDATE()
);

--việc làm 
CREATE TABLE Cong_viec (
    id INT PRIMARY KEY IDENTITY,
    tieu_de NVARCHAR(255),
    mo_ta NVARCHAR(MAX),
    linh_vuc_id INT FOREIGN KEY REFERENCES Linh_vuc(id),
    hinh_thuc_id INT FOREIGN KEY REFERENCES Hinh_thuc_lam_viec(id),
    nha_tuyen_dung_id INT FOREIGN KEY REFERENCES Nguoi_dung(id),
    ngay_dang DATETIME DEFAULT GETDATE()
);
--ứng tuyển
CREATE TABLE Nop_don (
    id INT PRIMARY KEY IDENTITY,
    cong_viec_id INT FOREIGN KEY REFERENCES Cong_viec(id),
    ung_vien_id INT FOREIGN KEY REFERENCES Nguoi_dung(id),
    cv_id INT FOREIGN KEY REFERENCES CV(id),
    ngay_nop DATETIME DEFAULT GETDATE(),
    da_xem BIT DEFAULT 0 -- 0: chưa xem, 1: đã xem
);

CREATE TABLE Thong_bao (
    id INT PRIMARY KEY IDENTITY,
    nguoi_nhan_id INT FOREIGN KEY REFERENCES Nguoi_dung(id),
    noi_dung NVARCHAR(MAX),
    loai NVARCHAR(50), -- 'nop_cv', 'xem_cv'
    trang_thai NVARCHAR(20) DEFAULT 'chua_doc', -- 'chua_doc', 'da_doc'
    thoi_gian DATETIME DEFAULT GETDATE(),
	--cong_viec_id INT;
);

-- Bảng Người dùng - Lĩnh vực (nhiều lĩnh vực / ứng viên)
CREATE TABLE Linh_vuc_nguoi_dung (
    id INT PRIMARY KEY IDENTITY,
    nguoi_dung_id INT FOREIGN KEY REFERENCES Nguoi_dung(id),
    linh_vuc_id INT FOREIGN KEY REFERENCES Linh_vuc(id)
);

--procedure tao thong bao tu dong
go
--thong bao UV da nop CV
CREATE PROCEDURE TaoThongBaoNopCV
    @ung_vien_id INT,
    @cong_viec_id INT,
    @cv_id INT
AS
BEGIN
    DECLARE @nha_tuyen_dung_id INT;
    SELECT @nha_tuyen_dung_id = nha_tuyen_dung_id FROM Cong_viec WHERE id = @cong_viec_id;

    DECLARE @noi_dung NVARCHAR(MAX);
    SET @noi_dung = N'Ứng viên ID ' + CAST(@ung_vien_id AS NVARCHAR) +
                    N' đã nộp CV ID ' + CAST(@cv_id AS NVARCHAR) +
                    N' cho công việc ID ' + CAST(@cong_viec_id AS NVARCHAR);

    INSERT INTO Thong_bao (nguoi_nhan_id, noi_dung, loai, trang_thai)
    VALUES (@nha_tuyen_dung_id, @noi_dung, N'nop_cv', N'chua_doc');
END

--thong bao NTD da xem CV
go
CREATE PROCEDURE TaoThongBaoXemCV
    @cong_viec_id INT,
    @ung_vien_id INT
AS
BEGIN
    DECLARE @noi_dung NVARCHAR(MAX);
    SET @noi_dung = N'Nhà tuyển dụng đã xem CV của bạn cho công việc ID ' + CAST(@cong_viec_id AS NVARCHAR);

    INSERT INTO Thong_bao (nguoi_nhan_id, noi_dung, loai, trang_thai)
    VALUES (@ung_vien_id, @noi_dung, N'xem_cv', N'chua_doc');
END

-- Bảng Yêu thích (Ứng viên yêu thích công việc)
CREATE TABLE Yeu_thich (
    id INT PRIMARY KEY IDENTITY,
    ung_vien_id INT FOREIGN KEY REFERENCES Nguoi_dung(id),
    cong_viec_id INT FOREIGN KEY REFERENCES Cong_viec(id),
    ngay_yeu_thich DATETIME DEFAULT GETDATE()
);

--du lieu mau
INSERT INTO Linh_vuc (ten_linh_vuc) VALUES
(N'Công nghệ thông tin'),
(N'Kế toán - Kiểm toán'),
(N'Nhân sự'),
(N'Marketing'),
(N'Thiết kế đồ họa'),
(N'Giáo dục - Đào tạo'),
(N'Tư vấn'),
(N'Bán hàng'),
(N'Kỹ thuật'),
(N'Y tế - Dược'),
(N'Ngân hàng'),
(N'Truyền thông - PR');


INSERT INTO Hinh_thuc_lam_viec (ten_hinh_thuc) VALUES
(N'Full-time'),
(N'Part-time'),
(N'Long term');


INSERT INTO Nguoi_dung (ho_ten, email, mat_khau, vai_tro, anh_dai_dien)
VALUES (N'Nguyễn Văn A', 'a@gmail.com', '1', 'ung_vien', 'avatar_a.jpg');


INSERT INTO Nguoi_dung (ho_ten, email, mat_khau, vai_tro, anh_dai_dien)
VALUES (N'Công ty ABC', 'abc.hr@gmail.com', '1', 'nha_tuyen_dung', 'logo_abc.jpg');


INSERT INTO Linh_vuc_nguoi_dung (nguoi_dung_id, linh_vuc_id)
VALUES (1, 1), 
       (1, 4); 

INSERT INTO CV (ung_vien_id, tieu_de, noi_dung, anh_dai_dien)
VALUES (1, N'CV Marketing', N'Nội dung CV về marketing...', 'cv_avatar1.jpg');

INSERT INTO Cong_viec (tieu_de, mo_ta, linh_vuc_id, hinh_thuc_id, nha_tuyen_dung_id)
VALUES (N'Tuyển cán bộ cấp cao', N'Mô tả công việc marketing tại Hà Nội...', 2, 1, 2);

INSERT INTO Cong_viec (tieu_de, mo_ta, linh_vuc_id, hinh_thuc_id, nha_tuyen_dung_id)
VALUES (N'Tuyển cbnn', N'Mô tả công việc marketing tại Hà Nội...', 5, 1,11);

INSERT INTO Nop_don (cong_viec_id, ung_vien_id, cv_id)
VALUES (1, 1, 1);

--t.báo cho NTD: có UV ứng tuyển
EXEC TaoThongBaoNopCV @ung_vien_id = 1, @cong_viec_id = 1, @cv_id = 1;

--NTD đã xem CV
UPDATE Nop_don SET da_xem = 1 WHERE id = 1;

--T.báo cho UV
EXEC TaoThongBaoXemCV @cong_viec_id = 1, @ung_vien_id = 1;
