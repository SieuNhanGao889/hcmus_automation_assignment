# AI Critique

AI hỗ trợ tốt trong việc chuyển test case HW02 thành data JSON và Playwright script cho 3 tính năng FR-03, FR-09 và FR-15. Điểm mạnh là AI tạo nhanh và sát được khung data-driven, tái sử dụng setup qua API, tự chạy Chromium/Firefox/WebKit và sinh HTML report có timestamp. Với FR-09, AI cũng giúp bắt các lỗi tính coupon; với FR-03, AI dựng được flow forgot/reset password; với FR-15, AI kết hợp UI admin và API để xác minh dữ liệu sau thao tác CRUD.

Nhưng mà script AI sinh ra không thể dùng ngay nếu thiếu human audit. Lỗi quan trọng ban đầu là dùng `serial`, khiến suite có thể skip các case sau khi một bug thật xuất hiện sớm. Automation testing cần chạy hết toàn bộ case để có thống kê đầy đủ, nên phần này đã được sửa. AI cũng chưa dự đoán đủ rủi ro khi nhiều browser cùng dùng SQLite và fixture chung; `workers: 1` được áp dụng để failure phản ánh lỗi chức năng thay vì lỗi môi trường.

Về assertion, AI ban đầu hơi dựa vào text message. SUT lại thiếu `data-testid`, thiếu role thông báo rõ ràng và có một số text tiếng Việt dễ bị lệch encoding, nên cần con người điều chỉnh để ưu tiên oracle cụ thể hơn: số tiền, URL, trạng thái form, dữ liệu sản phẩm đọc lại qua API, và rule không lộ OTP. Bài học chính là AI giúp tăng tốc viết automation, nhưng tester vẫn phải kiểm soát oracle, setup dữ liệu, selector và phân biệt bug thật với lỗi script.
