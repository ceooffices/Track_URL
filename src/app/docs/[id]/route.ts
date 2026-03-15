import { NextRequest, NextResponse } from "next/server";

// Mock DB or environment configs for documents
const DOCUMENT_MAPPINGS: Record<string, { url: string; title: string; description: string }> = {
  "proposal-abc123": {
    url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", // The real PDF URL (dummy for testing)
    title: "📄 Proposal & Báo Giá Dịch Vụ - 2.4MB",
    description: "Tài liệu đề xuất dịch vụ. Nhấn vào để xem chi tiết proposal.",
  },
};

const OPENCLAW_WEBHOOK_URL = process.env.OPENCLAW_WEBHOOK_URL || "https://hook.us1.make.com/xxxx";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // In Next.js 15, params is a Promise in Route Handlers
) {
  const { id } = await params;
  const doc = DOCUMENT_MAPPINGS[id];

  if (!doc) {
    return NextResponse.json({ error: "Document not found" }, { status: 404 });
  }

  const userAgent = request.headers.get("user-agent") || "";
  const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";

  // Check if the request is from a crawler (Zalo, Telegram, Facebook, etc.)
  const isBot = /bot|facebook|zalo|telegram|whatsapp|viber|skype/i.test(userAgent);

  if (isBot) {
    // Return HTML with Open Graph tags for rich previews
    const html = `
      <!DOCTYPE html>
      <html lang="vi">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${doc.title}</title>
          <meta property="og:title" content="${doc.title}">
          <meta property="og:description" content="${doc.description}">
          <meta property="og:type" content="article">
          <!-- TODO: Add a real preview image URL representing the PDF thumbnail -->
          <meta property="og:image" content="https://tikme.vn/preview.jpg">
          <meta name="twitter:card" content="summary_large_image">
      </head>
      <body>
          <p>Đang chuyển hướng đến tài liệu...</p>
      </body>
      </html>
    `;
    return new NextResponse(html, {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  // If real user: Log the event (Webhook to OpenClaw)
  try {
    // In background, send webhook to OpenClaw. We don't await so it doesn't block the redirect
    fetch(OPENCLAW_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        event: "document_opened",
        document_id: id,
        ip_address: ip,
        user_agent: userAgent,
        timestamp: new Date().toISOString(),
      }),
    }).catch(err => console.error("Webhook error:", err));
  } catch (error) {
    console.error("Failed to trigger webhook", error);
  }

  // Execute actual redirect to the real PDF
  return NextResponse.redirect(doc.url, 302);
}
