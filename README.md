Đặc Tả Hệ Thống Ứng Dụng
Tên ứng dụng:
JobFinder – Nền tảng kết nối người tìm việc và nhà tuyển dụng

Mục tiêu hệ thống:
-Phát triển một nền tảng hỗ trợ người dùng tìm kiếm việc làm, tạo và gửi CV, kết nối trực tiếp với nhà tuyển dụng. Đồng thời, cung cấp công cụ cho nhà tuyển dụng đăng tin tuyển dụng, quản lý ứng viên và tìm kiếm ứng viên phù hợp.

Đối tượng sử dụng:
-Người tìm việc
-Nhà tuyển dụng

Công nghệ sử dụng:
-Frontend (Mobile): React Native
-Backend API: ASP.NET Core (.NET Core)
-Cơ sở dữ liệu: SQL Server
-Kết nối API: Giao thức HTTP/HTTPS chuẩn RESTful
-Định dạng dữ liệu: JSON
-Cấu trúc người dùng

1. Người tìm việc:
-Đăng ký / Đăng nhập
-Tạo và cập nhật hồ sơ cá nhân
-Tạo và chỉnh sửa CV (hỗ trợ tạo trực tuyến)
-Tìm kiếm việc làm theo từ khoá, lĩnh vực, hình thức làm việc
-Ứng tuyển công việc trực tiếp từ ứng dụng
-Nhận gợi ý công việc phù hợp theo hồ sơ cá nhân
-Quản lý danh sách công việc đã ứng tuyển

2. Nhà tuyển dụng:
-Đăng ký / Đăng nhập
-Tạo và cập nhật hồ sơ cá nhân
-Đăng tin tuyển dụng (tiêu đề, mô tả, hình thức, lĩnh vực)
-Quản lý tin tuyển dụng (xem, sửa, xoá)
-Xem danh sách ứng viên ứng tuyển
-Xem chi tiết CV của ứng viên
-Nhận thông báo khi có ứng viên ứng tuyển

Chức năng hệ thống
a. Xác thực người dùng:
-Đăng ký tài khoản (email, mật khẩu, vai trò)
-Đăng nhập với xác thực bằng JWT Token
-Phân quyền theo vai trò: Người tìm việc / Nhà tuyển dụng

b. Quản lý hồ sơ cá nhân:
    Đối với người tìm việc:
-Tạo và cập nhật thông tin cá nhân (họ tên, email, lĩnh vực quan tâm, mật khẩu)
-Tạo và chỉnh sửa CV trực tuyến
-Tải lên CV ứng tuyển

    Đối với nhà tuyển dụng:
-Tạo và cập nhật hồ sơ cá nhân (họ tên, email, mật khẩu)

c. Quản lý việc làm:
    Người tìm việc:
-Tìm kiếm công việc theo từ khoá, lĩnh vực, hình thức
-Xem chi tiết tin tuyển dụng
-Ứng tuyển công việc trực tiếp
-Xem lại các công việc đã ứng tuyển

    Nhà tuyển dụng:
-Đăng tin tuyển dụng mới
-Quản lý các tin đã đăng
-Theo dõi và quản lý ứng viên ứng tuyển
-Truy cập thông tin chi tiết và CV của ứng viên

d. Thông báo:
-Gửi thông báo đến nhà tuyển dụng khi có ứng viên ứng tuyển
-Gửi thông báo đến ứng viên khi CV được xem

e. Gợi ý việc làm:
-Đề xuất công việc phù hợp dựa trên lĩnh vực mà người dùng đã cập nhật trong hồ sơ cá nhân

Ứng dụng tham khảo:
TopCV
