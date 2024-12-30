# Requirement
CRM IMA:
1. Tạo chương trình tour
2. User gồm các phòng ban ( Saler, Tour Operator, Intern, Accountant )
3. Admin quản lý tất cả.
4. Hệ thống trạng thái làm việc.
+ Trạng thái làm việc của từng bộ phận phòng ban
   - Sales: tạo chương trình tour, thêm các "thể loại" dịch vụ vào các ngày => gửi tour với khách ( PDF, url, email ), chốt tour với khách => Tour có mã đoàn => Lưu 1 bản chương trình tour để chuyển cho Tour Operator làm việc tiếp )
   - Tour Operator: Sau có bản chương trình Tour ( có mã đoàn ) => Lựa chọn dịch vụ theo các "thể loại" mà sales đã chọn, có giá => Liên hệ với các nhà cung cấp để booking dịch vụ ( email, gọi điện ) => Chốt dịch vụ => Cập nhật lại giá trong chương trình Tour => Tour có mã đoàn có giá ( giá này là giá dự toán ) => Lưu 1 bản chương trình tour để chuyển cho Kế toán làm việc tiếp ).
    - Accountant: sau khi có Tour đã có giá dự toán => Chi tiền tới các nhà cung cấp => Nhận hóa đơn => Lưu 1 bản chương trình tour có cập nhật giá từ các hóa đơn ( giá này là giá quyết toán ) => Kết thúc Tour => Lưu tour này vào dữ liệu tour đã bán trong năm.
* Lưu ý *: Trạng thái Tour operator và Accountant làm việc song song với nhau trong 1 chương trình tour, vì 1 dịch vụ có thể chi tiền trước để booking chứ không phải Tour operator hoàn thành xong 1 tour mới gửi cho kế toán. Chỉ khi nào hóa đơn về đủ hết, kế toán chốt quyết toán và cập nhật bản Tour cuối cùng thì mới hoàn thành 1 Tour.
5. Hệ thống của mỗi user mỗi phòng ban.
User ở mỗi phòng ban sẽ có 3 mục chính 
  + Cá nhân ( task, storage cá nhân, pin tin nhắn, thông báo, nhắc việc, email, báo cáo cá nhân )
    *** Task ***: ghi công việc trong ngày, trong tuần, trong tháng, có thể tag user khác để làm cùng ).
  + Đầu mục công việc ( ở đây thể hiện các trạng thái công việc đã nếu ở bước 4 )
  + Tổng ( chứa thư viện chung của công ty, báo cáo tổng )
6. Chat
  - Các phòng ban có thể chat nhóm với nhau, cá nhân có thể chat với cá nhân khác, và phòng chat tổng.
  - Mỗi user có storage riêng của mình ( 5gb/user - lưu trữ cá nhân)
  - Chat có thể gửi hình ảnh, tài liệu, pin tin nhắn, tag user khác vào.
7. Thư viện chung công ty
  - Danh sách các nhà cung cấp dịch vụ theo từng địa điểm
  - Danh sách tour đã bán
  - Danh sách khách đã chốt
  - Danh sách hướng dẫn viên
  - Danh sách các template ngày tour đã tạo, ví dụ ( Hà Nội - Điện Biên )
  - Storage 2TB lưu các file chung của công ty ( image, video, ... )
- Bạn hãy ghi thêm các cập nhật của bạn vào đây

---------------------------------------------------------------------------------------

# IMA - Kế hoạch triển khai CRM

## Phase 1: Development Setup
Local Development với Docker (3-4 ngày)
Setup Docker environment:
- Docker & Docker Compose
- Node.js container
- PostgreSQL container
- Redis container
- Nginx container
Cấu hình development:
- Docker Compose cho dev
- Environment variables
- Volume mapping
- Hot-reload với Docker
- Git setup
- Basic CI/CD:
  - GitHub repository
  - GitHub Actions basic
  - Auto build Docker images
  - Basic testing workflow
- Server Setup với Docker (4-5 ngày, cuối Phase 2)
  - Setup Ubuntu Server
  - Install Docker & Docker Compose
  - Setup Docker network
  - SSL & Security
- Docker Registry/Hub setup
- Monitoring setup:
  - Container metrics
  - Application logs
  - Database monitoring
  - Error tracking
  - Basic alerts
  - Uptime monitoring
  - Response time tracking

## Phase 2: Core Tour Management (6 tuần + 1 tuần buffer)
### Tuần 1-2: User System
- Đăng ký/đăng nhập
- Admin và User roles
- Thông tin cá nhân cơ bản
- Reset mật khẩu
### Tuần 3-4: Tour Basic
- Tạo tour
- Danh mục dịch vụ
- Giá cơ bản
- Trạng thái tour
### Tuần 4-5: Files & PDF
- Upload/download files
- Tạo PDF tour
- Mẫu tour template
- Email cơ bản
### Tuần 5-6: Testing & Demo
- Sửa lỗi & Tối ưu
- Đào tạo người dùng
- Demo với 5 users (2 Sales, 2 Operator, 1 Accountant)
- Thu thập feedback nhanh
### Tuần 7: Buffer time ⚠️

## Phase 3: Business Logic (11 tuần + 1 tuần buffer)
### Tuần 1-2: Quản lý phòng ban & phân quyền
### Tuần 3-4: Quy trình làm việc & hệ thống giá
### Tuần 5-6: Quy trình tour theo phòng
### Tuần 7-8: Task management & Email
### Tuần 9-10: Testing & Optimization
### Tuần 11: User training & Documentation
### Tuần 12: Buffer time ⚠️

## Phase 4: Communication & Advanced (11 tuần + 1 tuần buffer)
### Tuần 1-3: Chat system
### Tuần 4-5: Security enhancement (2FA)
### Tuần 6-7: Dashboard & Reports
### Tuần 8-9: B2 storage & Backup
### Tuần 10: System optimization
### Tuần 11: Final testing
### Tuần 12: Buffer time ⚠️

## Production Launch (4 tuần + 1 tuần buffer)
### Tuần 1: Final system check
### Tuần 2: Data migration
### Tuần 3: User training (20 users)
### Tuần 4: Go live & Support
### Tuần 5: Buffer time ⚠️

## Deployment Flow:
### Development:
- Code trên local
- Test với Docker local
- Push lên GitHub
- Auto build Docker images
- Test tự động
### Staging/Demo:
- Pull Docker images
- Deploy lên server
- Verify deployment
- Monitor performance
### Production:
- Zero-downtime deployment
- Auto backup trước deploy
- Health check sau deploy
- Rollback plan sẵn sàng
- Tổng users: 20 users
  - 8 Sales
  - 6 Operator
  - 4 Accountant
  - 2 Admin
### Monitoring Production:
- Daily: Health check, Performance, Support
- Weekly: Analysis, Optimization, Updates
- Monthly: Audit, Security, Analytics

## Timeline tổng (8.5 tháng):
- Phase 1 & 2: 1.75 tháng (7 tuần)
- Phase 3: 3 tháng (12 tuần)
- Phase 4: 3 tháng (12 tuần)
- Launch: 0.75 tháng (5 tuần)

Buffer time được dùng cho:
- Xử lý lỗi phát sinh
- Tối ưu thêm tính năng
- Đào tạo bổ sung
- Xử lý feedback
- Cải thiện UX/UI
- Testing thêm
- Documentation bổ sung
Lưu ý:
- Buffer time có thể dùng hoặc không
- Nếu không dùng, timeline sẽ rút ngắn
- Ưu tiên chất lượng và stability
- Feedback users được xử lý liên tục
- Phát triển với Docker từ đầu
- CI/CD tự động với GitHub Actions
- Môi trường đồng nhất local/server

---------------------------------------------------------------------------------------
# IMA CRM - Setup Development

## Setup Development
1. Clone repository
2. Copy .env.example to .env
3. Run `docker-compose up`

## Git Workflow
1. Develop trên nhánh feature
2. Tạo Pull Request vào develop
3. Sau khi test OK thì merge vào main