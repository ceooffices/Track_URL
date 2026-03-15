import { NextRequest, NextResponse } from "next/server";

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const OPENCLAW_WEBHOOK_URL = process.env.OPENCLAW_WEBHOOK_URL || "";

const VALID_ID_PATTERN = /^[a-zA-Z0-9_-]{1,128}$/;

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

interface Document {
  id: string;
  title: string;
  description: string;
  url: string;
  og_image: string;
  is_active: boolean;
}

async function getDocument(id: string): Promise<Document | null> {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/documents?id=eq.${encodeURIComponent(id)}&is_active=eq.true&select=*`,
    {
      headers: {
        apikey: SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      },
      next: { revalidate: 60 },
    }
  );

  if (!res.ok) return null;
  const rows: Document[] = await res.json();
  return rows[0] ?? null;
}

function logOpen(documentId: string, ip: string, userAgent: string) {
  // Insert vào document_opens (async, không block)
  fetch(`${SUPABASE_URL}/rest/v1/document_opens`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      document_id: documentId,
      ip_address: ip,
      user_agent: userAgent,
    }),
  }).catch(err => console.error("DB log error:", err));

  // Webhook OpenClaw (async, không block)
  if (OPENCLAW_WEBHOOK_URL) {
    fetch(OPENCLAW_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event: "document_opened",
        document_id: documentId,
        ip_address: ip,
        user_agent: userAgent,
        timestamp: new Date().toISOString(),
      }),
    }).catch(err => console.error("Webhook error:", err));
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!VALID_ID_PATTERN.test(id)) {
    return NextResponse.json({ error: "Invalid document ID" }, { status: 400 });
  }

  const doc = await getDocument(id);

  if (!doc) {
    return NextResponse.json({ error: "Document not found" }, { status: 404 });
  }

  const userAgent = request.headers.get("user-agent") || "";
  const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";

  const isBot = /bot|facebook|zalo|telegram|whatsapp|viber|skype/i.test(userAgent);

  if (isBot) {
    const safeTitle = escapeHtml(doc.title);
    const safeDescription = escapeHtml(doc.description);
    const safeImage = escapeHtml(doc.og_image);

    const html = `<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${safeTitle}</title>
    <meta property="og:title" content="${safeTitle}">
    <meta property="og:description" content="${safeDescription}">
    <meta property="og:type" content="article">
    <meta property="og:image" content="${safeImage}">
    <meta name="twitter:card" content="summary_large_image">
</head>
<body>
    <p>Đang chuyển hướng đến tài liệu...</p>
</body>
</html>`;

    return new NextResponse(html, {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  // Real user: log + webhook async, redirect ngay
  logOpen(id, ip, userAgent);

  return NextResponse.redirect(doc.url, 302);
}
