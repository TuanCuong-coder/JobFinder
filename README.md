Đặc tả hệ thống

1. Tên ứng dụng 
   JobFinder – Nền tảng kết nối người tìm việc và nhà tuyển dụng

2. Mục tiêu hệ thống 
   Ứng dụng hỗ trợ người dùng tìm việc làm, nộp CV, kết nối với nhà tuyển dụng, và hỗ trợ nhà tuyển dụng đăng tin tuyển dụng, tìm ứng viên phù hợp.

3. Đối tượng sử dụng 
   • Người tìm việc
   • Nhà tuyển dụng

4. Công nghệ sử dụng 
   • Frontend (Mobile): React Native
   • Backend API: .NET Core (ASP .NET Core)
   • Database: SQL Server
   • Kết nối API: HTTP/HTTPS (chuẩn RESTful)
   • Giao tiếp dữ liệu: JSON

5. Cấu trúc người dùng 
   a. Người tìm việc
   • Đăng ký / đăng nhập
   • Tạo / cập nhật hồ sơ cá nhân
   • Tạo / cập nhật CV
   • Tìm kiếm việc làm
   • Ứng tuyển công việc
   • Nhận gợi ý công việc phù hợp
   b. Nhà tuyển dụng
   • Đăng ký / đăng nhập
   • Tạo/ cập nhật hồ sơ cá nhân
   • Đăng tin tuyển dụng
   • Quản lý tin đăng
   • Xem danh sách ứng viên ứng tuyển và xem chi tiết CV ứng viên
   • Nhận thông báo khi có ứng viên ứng tuyển công việc

6. Các chức năng hệ thống
   a. Xác thực người dùng
   • Đăng ký tài khoản (email, password, role)
   • Đăng nhập (JWT Token)
   • Phân quyền theo vai trò (Người tìm việc / Nhà tuyển dụng)

b. Hồ sơ cá nhân
Với người tìm việc:
• Tạo hồ sơ cá nhân
• Cập nhật thông tin cá nhân (họ tên, email, mật khẩu, lĩnh vực việc làm)
• Upload CV ứng tuyển (tạo online)
• Xem và chỉnh sửa CV
Với nhà tuyển dụng:
• Tạo hồ sơ cá nhân
• Cập nhật thông tin cá nhân (họ tên, email, mật khẩu)

c. Việc làm
Với người tìm việc:
• Tìm kiếm công việc theo: từ khoá, lĩnh vực, hình thức làm việc
• Xem chi tiết tin tuyển dụng
• Ứng tuyển trực tiếp
• Xem lại danh sách đã ứng tuyển
Với nhà tuyển dụng:
• Tạo tin tuyển dụng (tiêu đề, mô tả, hình thức, lĩnh vực)
• Quản lý tin đăng
• Xem danh sách ứng viên
• Xem chi tiết CV ứng viên

d. Thông báo
• Gửi thông báo khi có người ứng tuyển / được xem CV
e. Gợi ý công việc
• Dựa theo lĩnh vực công việc đã cập nhật ở thông tin cá nhân

7.Ứng dụng tham khảo
App TopCV
