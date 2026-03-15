# CHANGELOG

## [Phase 2] - 2026-03-15

### Added (ClaudeCode)
- ✨ Tích hợp Supabase Database thay thế Mock Data cứng. Giờ đây mỗi Tài Liệu (Proposal) được lưu trong DB với ID, Tiêu đề, URL gốc, Ảnh bìa.
- ✨ Dashboard quản lý Documents: Hiển thị danh sách tài liệu, số lượt mở, nút Copy Link nhanh.
- ✨ Trang tạo Tracking Link mới `/new`: Form nhập ID, Tiêu đề, Mô tả, URL PDF gốc.
- ✨ API `POST /api/documents`: Tạo document mới với validation (chống duplicate, chống injection).
- ✨ Analytics page `/analytics/[id]`: Xem chi tiết lượt mở theo từng tài liệu.

### Security (ClaudeCode + Anh Kha)
- 🔒 XSS Prevention: Hàm `escapeHtml()` bảo vệ OG Tags.
- 🔒 Input Validation: Regex `VALID_ID_PATTERN` chặn path traversal.
- 🔒 File `.env.example` hướng dẫn cấu hình Supabase + OpenClaw Webhook.

### QC (Gravity - Chính Trực 100%)
- 🧪 **Phạm vi QC đã thực hiện:**
  - ✅ Đọc từng dòng code của 11 files thay đổi (582 dòng thêm mới).
  - ✅ ESLint: Pass, 0 errors, 0 warnings.
  - ✅ TypeScript (`tsc --noEmit`): Pass, 0 errors.
  - ✅ Viết 7 test scenarios tại `tests/tracking-endpoint.test.ts`.
- 🧪 **Phạm vi QC chưa thực hiện (Chính Trực 100%):**
  - ⏳ Chưa chạy được automated test (cần install jest/vitest + mock Supabase).
  - ⏳ Chưa test thực tế trên Zalo/Telegram (cần deploy lên Vercel trước).
  - ⏳ Chưa test kết nối Supabase thật (cần `.env` với credentials thật).

---

## [Phase 1] - 2026-03-15

### Added
- ✨ Khởi tạo project Next.js (`Track_URL`) để xử lý Tracking Proposal.
- ✨ Xây dựng Tracking API endpoint (`/docs/[id]`).
- ✨ Tích hợp Webhook POST ngầm gửi payload báo cáo sang OpenClaw (`document_opened`).
- ✨ Xử lý song song luồng cho User thật (HTTP 302 Redirect) và Bot quét link từ Zalo/Telegram (Trả về HTML có dán Open Graph Tags).

### Security/QC (Gravity Review)
- 🔒 Anh Kha đã bổ sung Regex `VALID_ID_PATTERN` và hàm `escapeHtml()`.
- 🧪 ESLint & TypeScript pass 100%.
