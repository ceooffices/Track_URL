# TECHNICAL SPECIFICATION: Controlled Link Sharing (Proposal Tracking)

**To:** ClaudeCode (Backend / Infra)
**From:** Gravity (Frontend / PM)
**Date:** 2026-03-15

## 1. Mục Tiêu (Objective)
Xây dựng một API Endpoint để track khi một document (như thư ngỏ, proposal) được mở.
Thay vì gửi file tĩnh, chúng ta sẽ gửi một đường link (ví dụ: `https://tikme.vn/docs/[document-id]`). Khi user bấm vào link này, hệ thống sẽ log lại thông tin thiết bị, thời gian, gửi webhook báo hiệu cho OpenClaw, rồi redirect user đến trang Google Drive / Supabase chứa file PDF thực sự.

## 2. Phần Việc Của ClaudeCode (Backend)

### A. Xây dựng Tracking Endpoint
- **Route:** `GET /api/track/:documentId` (hoặc tuỳ framework hiện tại)
- **Hành động khi được gọi:**
  1. Lấy `IP Address`.
  2. Lấy `User-Agent` (Browser, Thiết bị).
  3. Lấy `Timestamp`.
  4. (Tùy chọn) Ghi log xuống Database (Supabase / DB hiện tại) vào bảng `document_opens`.
  5. **Bắn Webhook (Async):** POST một JSON payload về endpoint của OpenClaw.
     ```json
     {
       "event": "document_opened",
       "document_id": "abc1234",
       "ip_address": "111.222.333.444",
       "user_agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)...",
       "timestamp": "2026-03-15T10:00:00Z"
     }
     ```
  6. **Cần lưu ý crawler từ Zalo/Telegram:** 
     Zalo/Telegram bots sẽ cào link để lấy thumbnail (OG meta tags).
     Nếu `User-Agent` chứa chữ `Zalo` hoặc `TelegramBot` hoặc `facebookexternalhit`, bạn phải trả về **HTML document** chứa Open Graph (OG) tags thay vì redirect.
     *(Phần nội dung meta tags Gravity sẽ cung cấp sau, tạm thời ClaudeCode chỉ cần code luồng check `if (isBot)` trả về HTML tĩnh, `else` thì tiếp tục bước redirect).*
  7. **Redirect:** Nếu là người thật (không phải bot), thực hiện `HTTP 302 Redirect` đến file PDF thật (URL file PDF config sẵn trong DB hoặc ENV).

### B. Setup Database (Nếu cần)
- Nếu cần, ClaudeCode thiết kế thêm bảng `document_opens` và `documents` (có cột URL trỏ tới PDF thật) trong Supabase schema.

---

## 3. Phần Việc Của Gravity (Frontend)
*(Để ClaudeCode nắm thông tin phối hợp)*
- **OG Tags Tối Ưu:** Thiết kế giao diện ẩn (meta tags) khi link được Zalo/Telegram bot cào. Ví dụ: Title = `📄 Đề Xuất Dịch Vụ - 2.4MB`, Thumbnail = Ảnh bìa mờ mờ.
- **Template Báo Cáo:** Format nội dung (markdown) để OpenClaw gửi về cho Sếp Kha đẹp, rõ ràng.
- **QA & Testing:** Test flow End-to-End từ lúc user bấm link tới lúc bot Telegram nhảy thông báo.

---

**Yêu Cầu Action cho ClaudeCode:**
- Đọc kĩ spec, nếu rõ ràng thì tạo file source code cho Endpoint này.
- Khi hoàn thành, update check trong `CHANGELOG.md` và `SYSTEM_AUDIT.md`.
- Comment Emoji đúng chuẩn `✨ Feature mới: Add Document Tracking Endpoint`.
