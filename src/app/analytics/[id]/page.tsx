import Link from "next/link";
import { getDocument, getOpens } from "@/lib/supabase";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

function parseDevice(ua: string): string {
  if (/iPhone/i.test(ua)) return "iPhone";
  if (/iPad/i.test(ua)) return "iPad";
  if (/Android/i.test(ua)) return "Android";
  if (/Mac/i.test(ua)) return "Mac";
  if (/Windows/i.test(ua)) return "Windows";
  if (/curl/i.test(ua)) return "curl";
  return "Other";
}

function timeAgo(date: string): string {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "vua xong";
  if (mins < 60) return `${mins} phut truoc`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} gio truoc`;
  const days = Math.floor(hours / 24);
  return `${days} ngay truoc`;
}

export default async function AnalyticsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [doc, opens] = await Promise.all([getDocument(id), getOpens(id)]);

  if (!doc) notFound();

  const trackingUrl = `${process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : ""}/docs/${doc.id}`;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto flex max-w-5xl items-center gap-4 px-6 py-4">
          <Link
            href="/"
            className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
          >
            &larr; Dashboard
          </Link>
          <h1 className="truncate text-xl font-bold tracking-tight">
            {doc.title}
          </h1>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-8">
        {/* Stats */}
        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-sm text-zinc-500">Tong luot mo</p>
            <p className="mt-1 text-3xl font-bold tabular-nums">
              {opens.length}
            </p>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-sm text-zinc-500">IP duy nhat</p>
            <p className="mt-1 text-3xl font-bold tabular-nums">
              {new Set(opens.map((o) => o.ip_address)).size}
            </p>
          </div>
          <div className="col-span-2 rounded-xl border border-zinc-200 bg-white p-5 sm:col-span-1 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-sm text-zinc-500">Tracking link</p>
            <p className="mt-1 truncate text-sm font-mono text-zinc-900 dark:text-white">
              {trackingUrl}
            </p>
          </div>
        </div>

        {/* Opens table */}
        <h2 className="mb-4 text-lg font-semibold">Lich su mo</h2>
        {opens.length === 0 ? (
          <p className="text-zinc-500">Chua co ai mo document nay.</p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
            <table className="w-full text-sm">
              <thead className="border-b border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Thoi gian</th>
                  <th className="px-4 py-3 text-left font-medium">IP</th>
                  <th className="px-4 py-3 text-left font-medium">Thiet bi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 bg-white dark:divide-zinc-800 dark:bg-zinc-950">
                {opens.map((open) => (
                  <tr key={open.id}>
                    <td className="whitespace-nowrap px-4 py-3">
                      <span title={new Date(open.opened_at).toLocaleString("vi-VN")}>
                        {timeAgo(open.opened_at)}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs">
                      {open.ip_address}
                    </td>
                    <td className="px-4 py-3">{parseDevice(open.user_agent)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
