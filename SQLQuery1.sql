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
    loai NVARCHAR(20),
    ngay_tai DATETIME DEFAULT GETDATE()
);


CREATE TABLE Cong_viec (
    id INT PRIMARY KEY IDENTITY,
    tieu_de NVARCHAR(255),
    mo_ta NVARCHAR(MAX),
    linh_vuc_id INT FOREIGN KEY REFERENCES Linh_vuc(id),
    hinh_thuc_id INT FOREIGN KEY REFERENCES Hinh_thuc_lam_viec(id),
    nha_tuyen_dung_id INT FOREIGN KEY REFERENCES Nguoi_dung(id),
    ngay_dang DATETIME DEFAULT GETDATE()
);

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
);


CREATE TABLE Linh_vuc_nguoi_dung (
    id INT PRIMARY KEY IDENTITY,
    nguoi_dung_id INT FOREIGN KEY REFERENCES Nguoi_dung(id),
    linh_vuc_id INT FOREIGN KEY REFERENCES Linh_vuc(id)
);


CREATE TABLE Yeu_thich (
    id INT PRIMARY KEY IDENTITY,
    ung_vien_id INT FOREIGN KEY REFERENCES Nguoi_dung(id),
    cong_viec_id INT FOREIGN KEY REFERENCES Cong_viec(id),
    ngay_yeu_thich DATETIME DEFAULT GETDATE()
);

Create PROCEDURE TaoThongBaoNopCV
    @ung_vien_id INT,
    @cong_viec_id INT,
    @cv_id INT
AS
BEGIN
    DECLARE @nha_tuyen_dung_id INT;
    DECLARE @ten_ung_vien NVARCHAR(100);
    DECLARE @tieu_de_cv NVARCHAR(255);
    DECLARE @tieu_de_cong_viec NVARCHAR(255);
    DECLARE @noi_dung NVARCHAR(MAX);

    SELECT 
        @nha_tuyen_dung_id = nha_tuyen_dung_id,
        @tieu_de_cong_viec = tieu_de
    FROM Cong_viec
    WHERE id = @cong_viec_id;

    SELECT @ten_ung_vien = ho_ten FROM Nguoi_dung WHERE id = @ung_vien_id;
    SELECT @tieu_de_cv = tieu_de FROM CV WHERE id = @cv_id;
    SET @noi_dung = N'Ứng viên "' + @ten_ung_vien + N'" đã nộp CV "' 
                    + @tieu_de_cv + N'" cho công việc "' + @tieu_de_cong_viec + N'"';

    
    INSERT INTO Thong_bao (nguoi_nhan_id, noi_dung, loai, trang_thai)
    VALUES (@nha_tuyen_dung_id, @noi_dung, N'nop_cv', N'chua_doc');
END


Create PROCEDURE TaoThongBaoXemCV
    @cong_viec_id INT,
    @ung_vien_id INT
AS
BEGIN
    DECLARE @tieu_de_cong_viec NVARCHAR(255);
    DECLARE @noi_dung NVARCHAR(MAX);

    SELECT @tieu_de_cong_viec = tieu_de FROM Cong_viec WHERE id = @cong_viec_id;
    SET @noi_dung = N'Nhà tuyển dụng đã xem CV của bạn cho công việc "' + @tieu_de_cong_viec + N'"';

    INSERT INTO Thong_bao (nguoi_nhan_id, noi_dung, loai, trang_thai)
    VALUES (@ung_vien_id, @noi_dung, N'xem_cv', N'chua_doc');
END



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

EXEC TaoThongBaoNopCV @ung_vien_id = 1, @cong_viec_id = 1, @cv_id = 1;

UPDATE Nop_don SET da_xem = 1 WHERE id = 1;

EXEC TaoThongBaoXemCV @cong_viec_id = 1, @ung_vien_id = 1;


SELECT vai_tro, COUNT(*) AS SoLuong
FROM Nguoi_dung
GROUP BY vai_tro;

SELECT cong_viec_id, COUNT(*) AS so_luong_ung_vien
FROM Nop_don
GROUP BY cong_viec_id;


DECLARE @ung_vien_id INT = 7; 
SELECT DISTINCT cv.*
FROM Cong_viec cv
JOIN Linh_vuc_nguoi_dung lvud ON cv.linh_vuc_id = lvud.linh_vuc_id
WHERE lvud.nguoi_dung_id = @ung_vien_id;


SELECT cv.*
FROM Nop_don nd
JOIN Cong_viec cv ON nd.cong_viec_id = cv.id
WHERE nd.ung_vien_id = 7;



DECLARE @keyword NVARCHAR(100) = N'marketing';  
SELECT *
FROM Cong_viec
WHERE tieu_de LIKE '%' + @keyword + '%'
   OR mo_ta LIKE '%' + @keyword + '%';

 DECLARE @cong_viec_id INT = 1;  

SELECT COUNT(*) AS SoLuongCVDaNop
FROM Nop_don
WHERE cong_viec_id = @cong_viec_id;

DECLARE @cong_viec_id INT = 1;
SELECT 
    cviec.id AS cong_viec_id,
    cviec.tieu_de AS ten_cong_viec,
    uv.ho_ten AS ten_ung_vien,
    cv.tieu_de AS ten_cv
FROM Nop_don nd
JOIN Cong_viec cviec ON nd.cong_viec_id = cviec.id
JOIN Nguoi_dung uv ON nd.ung_vien_id = uv.id
JOIN CV cv ON nd.cv_id = cv.id
WHERE cviec.id = @cong_viec_id;


SELECT * FROM Nop_don WHERE cv_id = 1;
