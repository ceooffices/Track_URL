# CHANGELOG

## [Unreleased]
### Added
- ✨ Khởi tạo project Next.js (`Track_URL`) để xử lý Tracking Proposal.
- ✨ Xây dựng Tracking API endpoint (`/docs/[id]`).
- ✨ Tích hợp Webhook POST ngầm gửi payload báo cáo sang OpenClaw (`document_opened`).
- ✨ Xử lý song song luồng cho User thật (HTTP 302 Redirect) và Bot quét link từ Zalo/Telegram (Trả về HTML có dán Open Graph Tags).

### Security/QC (Gravity Review)
- 🔒 **Security:** Sếp Kha (hoặc ClaudeCode) đã bổ sung Regex `VALID_ID_PATTERN` (`/^[a-zA-Z0-9_-]{1,128}$/`) để chống các lỗi path traversal / injection từ URL.
- 🔒 **XSS Prevention:** Thêm hàm `escapeHtml()` bảo vệ bộ thẻ meta Open Graph (OG) khỏi rủi ro XSS khi inject biến `title` và `description`.
- 🧪 **QC Passed:** Syntax Check (TypeScript) & ESLint toàn dự án đều pass 100%. Luồng Async Webhook không cản trở tốc độ Redirect.
