# HW04 - AI Automation Testing

## Thông Tin Sinh Viên

- MSSV: 23127364
- Họ tên: Đặng Nguyễn Thành Hiếu
- Lớp: 23KTPM04

## Tính Năng Đã Chọn

| Mã tính năng | Tên tính năng | Nhóm |
|---|---|---|
| FR-03 | Quên mật khẩu và đặt lại mật khẩu | A |
| FR-09 | Mã giảm giá | B |
| FR-15 | Quản lý sản phẩm CRUD | C |

## Tóm Tắt Automation

| Chỉ số | Giá trị |
|---|---:|
| Số tính năng automate | 3 |
| Số test case lấy từ HW02 | 62 |
| Số lượt chạy browser | 186 |
| Số lượt pass | 105 |
| Số lượt fail | 81 |
| Số test case fail duy nhất | 27 |
| Số bug unique được automation xác nhận | 12 |
| Browser | Chromium, Firefox, WebKit |

## Kết Quả Theo Feature

| Feature | Test case | Browser executions | Pass | Fail | Bug unique |
|---|---:|---:|---:|---:|---:|
| FR-03 | 23 | 69 | 33 | 36 | 4 |
| FR-09 | 13 | 39 | 30 | 9 | 3 |
| FR-15 | 26 | 78 | 42 | 36 | 5 |

## Bảng Tự Đánh Giá

| STT | Tiêu chí | Điểm chuẩn | Điểm tự đánh giá |
|---|---|---:|---:|
| 1 | Task 1 - Feature A: FR-03 automation trên 3 browser | 25 | 25 |
| 2 | Task 1 - Feature B: FR-09 automation trên 3 browser | 25 | 25 |
| 3 | Task 1 - Feature C: FR-15 automation trên 3 browser | 25 | 25 |
| 4 | Task 2 - Demo video và minh chứng chạy automation | 15 | 15 |
| 5 | Agent Skills / AI usage documentation | 10 | 10 |
|  | Tổng | 100 | 100 |

## Cấu Trúc Thư Mục

```text
23127364_HW04_AI_Automation_100/
|-- README.md
|-- package.json
|-- playwright.config.js
|-- data/
|   |-- fr03_forgot_password.json
|   |-- fr09_discount_coupons.json
|   `-- fr15_product_crud.json
|-- tests/
|   |-- fr03_forgot_password.spec.js
|   |-- fr09_discount_coupons.spec.js
|   `-- fr15_product_crud.spec.js
|-- reports/
|   |-- main_report.md
|   |-- ai_audit_report.md
|   |-- ai_critique.md
|   |-- playwright-fr03-report/
|   |-- playwright-fr09-report/
|   `-- playwright-fr15-report/
|-- bug_reports/
|   `-- bug_report.md
|-- hw2_features/
|   |-- test_cases_summary.md
|   `-- features/
|-- screenshots/
|-- agent_skills/
`-- git_log/
```

## Cách Chạy

```bash
npm install
npx playwright install
npx playwright test
```

Chạy từng tính năng:

```bash
npx playwright test tests/fr03_forgot_password.spec.js
npx playwright test tests/fr09_discount_coupons.spec.js
npx playwright test tests/fr15_product_crud.spec.js
```

Mở report gần nhất:

```bash
npm run report
```

## Bằng Chứng Và Links

- Data test: `data/`
- Automation script: `tests/`
- Playwright reports: `reports/playwright-fr03-report/`, `reports/playwright-fr09-report/`, `reports/playwright-fr15-report/`
- Screenshot bug đại diện: `screenshots/`
- Bug report và GitHub Issue links: `bug_reports/bug_report.md`
- Demo video links: `agent_skills/demo_video_links.md`
- Git log: `git_log/git_commit_log.txt`

## Ghi Chú Phạm Vi

`EShop-source/` chỉ dùng làm SUT để chạy kiểm thử. Bài này không sửa source code của SUT và không đưa `EShop-source/` vào phần nộp.
