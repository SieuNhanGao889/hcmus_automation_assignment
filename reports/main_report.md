# Báo Cáo Automation Chính

## Thông tin sinh viên 
- MSSV: 23127364
- Họ tên: Đặng Nguyễn Thành Hiếu
- Lớp: 23KTPM04

## Phạm Vi

Automation được thực hiện cho 3 tính năng đã chốt từ HW02: FR-03 Quên mật khẩu, FR-09 Mã giảm giá và FR-15 Quản lý sản phẩm CRUD. Các test case HW02 được chuyển thành data JSON, sau đó Playwright chạy data-driven trên UI thật của EShop.

## Môi Trường Chạy

- Framework: Playwright
- Browsers: Chromium, Firefox, WebKit
- Worker: `1` để tránh race condition trên SQLite và dữ liệu dùng chung
- Backend: `http://localhost:3000`
- Frontend web: `http://localhost:5173`
- Frontend admin: `http://localhost:5174`

## Lệnh Đã Chạy

```bash
npx playwright test tests/fr03_forgot_password.spec.js
npx playwright test tests/fr09_discount_coupons.spec.js
npx playwright test tests/fr15_product_crud.spec.js
```

## Tổng Hợp Kết Quả

| Feature | Test case | Browser executions | Pass | Fail | Test case fail duy nhất | Bug unique xác nhận |
|---|---:|---:|---:|---:|---:|---:|
| FR-03 | 23 | 69 | 33 | 36 | 12 | 4 |
| FR-09 | 13 | 39 | 30 | 9 | 3 | 3 |
| FR-15 | 26 | 78 | 42 | 36 | 12 | 5 |
| Tổng | 62 | 186 | 105 | 81 | 27 | 12 |

## Report HTML

| Feature | Report |
|---|---|
| FR-03 | `reports/playwright-fr03-report/index.html` |
| FR-09 | `reports/playwright-fr09-report/index.html` |
| FR-15 | `reports/playwright-fr15-report/index.html` |

Mỗi report có banner `Run by: 23127364` và ISO timestamp để minh chứng.

## Bug Được Automation Xác Nhận

| Feature | Bug ID | Nhóm lỗi |
|---|---|---|
| FR-03 | BUG-FR03-001 | OTP bị hiển thị trực tiếp trên UI |
| FR-03 | BUG-FR03-002 | Email sai định dạng bị xử lý như tài khoản không tồn tại |
| FR-03 | BUG-FR03-003 | Email toàn khoảng trắng không được trim/validate như rỗng |
| FR-03 | BUG-FR03-004 | Regex mật khẩu chặn sai password hợp lệ và che lỗi OTP |
| FR-09 | BUG-FR09-001 | Tính sai coupon phần trăm `SAVE10` |
| FR-09 | BUG-FR09-002 | Coupon tại biên `min_order_amount` bị reject |
| FR-09 | BUG-FR09-003 | Coupon fixed amount có thể làm tổng tiền âm |
| FR-15 | BUG-FR15-001 | Tên sản phẩm toàn khoảng trắng vẫn được chấp nhận |
| FR-15 | BUG-FR15-002 | Giá rỗng vẫn được tạo/cập nhật |
| FR-15 | BUG-FR15-003 | Giá `0` hoặc âm vẫn được tạo/cập nhật |
| FR-15 | BUG-FR15-004 | Tên dài hơn 255 ký tự vẫn được tạo |
| FR-15 | BUG-FR15-005 | Cập nhật một sản phẩm ảnh hưởng nhiều dòng trong UI |

