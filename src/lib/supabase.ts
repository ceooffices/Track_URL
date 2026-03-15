const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const headers = {
  apikey: SUPABASE_SERVICE_ROLE_KEY,
  Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
  "Content-Type": "application/json",
};

export interface Document {
  id: string;
  title: string;
  description: string;
  url: string;
  og_image: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DocumentOpen {
  id: string;
  document_id: string;
  ip_address: string;
  user_agent: string;
  opened_at: string;
}

export async function getDocuments(): Promise<(Document & { open_count: number })[]> {
  const [docsRes, opensRes] = await Promise.all([
    fetch(`${SUPABASE_URL}/rest/v1/documents?select=*&order=created_at.desc`, {
      headers,
      next: { revalidate: 0 },
    }),
    fetch(`${SUPABASE_URL}/rest/v1/document_opens?select=document_id`, {
      headers,
      next: { revalidate: 0 },
    }),
  ]);

  const docs: Document[] = docsRes.ok ? await docsRes.json() : [];
  const opens: { document_id: string }[] = opensRes.ok ? await opensRes.json() : [];

  const countMap: Record<string, number> = {};
  for (const o of opens) {
    countMap[o.document_id] = (countMap[o.document_id] || 0) + 1;
  }

  return docs.map((d) => ({ ...d, open_count: countMap[d.id] || 0 }));
}

export async function getDocument(id: string): Promise<Document | null> {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/documents?id=eq.${encodeURIComponent(id)}&is_active=eq.true&select=*`,
    { headers, next: { revalidate: 60 } }
  );
  if (!res.ok) return null;
  const rows: Document[] = await res.json();
  return rows[0] ?? null;
}

export async function createDocument(doc: {
  id: string;
  title: string;
  description: string;
  url: string;
}): Promise<Document> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/documents`, {
    method: "POST",
    headers: { ...headers, Prefer: "return=representation" },
    body: JSON.stringify(doc),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to create document");
  }
  const rows: Document[] = await res.json();
  return rows[0];
}

export async function getOpens(documentId: string): Promise<DocumentOpen[]> {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/document_opens?document_id=eq.${encodeURIComponent(documentId)}&select=*&order=opened_at.desc`,
    { headers, next: { revalidate: 0 } }
  );
  if (!res.ok) return [];
  return res.json();
}

export function logOpen(documentId: string, ip: string, userAgent: string) {
  fetch(`${SUPABASE_URL}/rest/v1/document_opens`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      document_id: documentId,
      ip_address: ip,
      user_agent: userAgent,
    }),
  }).catch((err) => console.error("DB log error:", err));
}
