Bạn là AI assistant hỗ trợ Automation Testing cho bài HW04.

Trước khi thực hiện, hãy đọc và tuân thủ toàn bộ hướng dẫn trong:

```text
agent_skills/automation-testing-skill/SKILL.md
```

Nếu môi trường AI có cơ chế gọi skill, hãy kích hoạt skill `automation-testing-skill`. Nếu không có cơ chế gọi skill tự động, hãy xem `SKILL.md` như instruction bắt buộc và làm theo từng mục trong đó.

## Bối Cảnh

- Student ID: 23127364
- SUT: EShop web application
- Framework: Playwright
- Automation phải chạy trên Chromium, Firefox, WebKit
- HTML report phải có `Run by: 23127364` và ISO timestamp
- Không sửa source của SUT trong `EShop-source/`
- Chỉ tạo/chỉnh sửa phần bài nộp automation: `tests/`, `data/`, `reports/`, `bug_reports/`, `screenshots/`, `playwright.config.js`, `README.md`

## Test Basis

Tôi sẽ cung cấp bảng test case đã thiết kế từ HW02, hoặc file tổng hợp:

```text
hw2_features/test_cases_summary.md
```

Hãy dùng các test case đó làm test basis. Không sinh test case mới để thay thế test case HW02.

Trong lần chạy/demo này, chỉ xử lý feature:

```text
FR-09: Discount Coupons
```

Hãy dùng đúng 13 test case FR-09 có trong `hw2_features/test_cases_summary.md`:

- 7 test case Domain Testing: `FR09-DT-01` đến `FR09-DT-07`
- 6 test case Boundary Value Analysis: `FR09-BVA-01` đến `FR09-BVA-06`

Không xử lý FR-03 hoặc FR-15 trong lần chạy này.

Khi chuyển test case sang automation data, hãy giữ các trường sau nếu có:

- `testCaseId`
- `featureId`
- `technique`: Domain Testing hoặc BVA
- `partition`
- `precondition`
- `steps`
- `testData`
- `expectedResult`
- `hw2ActualResult`
- `hw2Status`
- `hw2BugId`

Lưu ý: `hw2Status`, `hw2ActualResult`, và `hw2BugId` chỉ là thông tin tham chiếu từ HW02. Không dùng chúng làm kết quả pass/fail cuối cùng của Playwright trong HW04.

## Nhiệm Vụ

Chuyển 13 test case HW02 của FR-09 thành Playwright automation scripts theo hướng data-driven.

## Yêu Cầu Thực Hiện

1. Đọc `SKILL.md` và bảng test case HW02.
2. Xác định precondition, test data, expected result, HW02 status, và bug ID nếu có cho 13 test case FR-09.
3. Tách test data ra `data/fr09_discount_coupons.json`.
4. Sinh Playwright spec trong `tests/fr09_discount_coupons.spec.js`.
5. Không hardcode test data dạng array/object trực tiếp trong spec.
6. Dùng ít nhất 3 assertion patterns, ví dụ: `toBeVisible`, `toHaveText`, `toHaveURL`, `toHaveValue`, `toContainText`.
7. Ưu tiên selector ổn định dựa trên role, label, text, placeholder; tránh selector CSS mong manh.
8. Dùng Playwright MCP/browser nếu cần để inspect coupon input, apply button, cart/checkout flow, total amount, discount amount, and error/success messages.
9. Sau khi sinh script, review lại như human tester: chỉ ra selector dễ flaky, assertion yếu, edge case còn thiếu, rồi sửa script.
10. Chạy hoặc hướng dẫn chạy bằng `npx playwright test`.
11. Ghi lại lỗi AI ban đầu mắc phải để đưa vào AI Audit Report và AI Critique.

## Đầu Ra Mong Muốn

- `data/fr09_discount_coupons.json` chứa đủ 13 test case FR-09.
- `tests/fr09_discount_coupons.spec.js` đọc data từ JSON và chạy data-driven.
- Ghi chú ngắn về chỉnh sửa sau human review.
- Lệnh chạy test và lệnh mở report.
