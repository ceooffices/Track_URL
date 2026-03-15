# Track_URL - Controlled Link Sharing

## Dự án là gì
Hệ thống tracking link cho proposals/documents. Khi gửi link cho khách hàng qua Zalo/Telegram, hệ thống sẽ:
- Hiển thị OG preview đẹp cho bot crawlers
- Track IP/device khi người thật mở link
- Bắn webhook về OpenClaw để notify qua Telegram
- Redirect 302 tới file PDF thật trên Supabase

## Commands
- `npm run dev` - chạy dev server (port 3000)
- `npm run build` - build production
- `npm run lint` - chạy ESLint

## Tech Stack
- Next.js 16 + React 19 + TypeScript
- Tailwind CSS v4
- Supabase (database - đang triển khai)
- Vercel (deployment target)

## Cấu trúc
- `src/app/docs/[id]/route.ts` - API endpoint chính: tracking + redirect
- `docs/tasks/` - specs và tài liệu kỹ thuật

## Conventions
- Commit message bằng tiếng Việt, prefix emoji: ✨ Feature, 🐛 Fix, 🔒 Security, 📝 Docs
- Code comments bằng tiếng Việt khi cần thiết
- Document ID format: alphanumeric + dấu gạch ngang/gạch dưới, tối đa 128 ký tự
