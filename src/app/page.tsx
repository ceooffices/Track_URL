import Link from "next/link";
import { getDocuments } from "@/lib/supabase";
import CopyButton from "@/app/components/copy-button";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const documents = await getDocuments();
  const baseUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "";

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <h1 className="text-xl font-bold tracking-tight">Track URL</h1>
          <Link
            href="/new"
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            + Tạo link mới
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-8">
        {documents.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-300 py-16 text-center dark:border-zinc-700">
            <p className="text-zinc-500">Chưa có document nào.</p>
            <Link
              href="/new"
              className="mt-2 inline-block text-sm font-medium text-zinc-900 underline dark:text-white"
            >
              Tạo tracking link đầu tiên
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"
              >
                <Link
                  href={`/analytics/${doc.id}`}
                  className="min-w-0 flex-1 hover:opacity-70 transition-opacity"
                >
                  <h2 className="truncate font-semibold">{doc.title}</h2>
                  <p className="mt-1 truncate text-sm text-zinc-500">
                    /docs/{doc.id}
                  </p>
                </Link>
                <div className="ml-4 flex items-center gap-3">
                  <CopyButton text={`${baseUrl}/docs/${doc.id}`} />
                  <Link
                    href={`/analytics/${doc.id}`}
                    className="flex flex-col items-end"
                  >
                    <span className="text-2xl font-bold tabular-nums">
                      {doc.open_count}
                    </span>
                    <span className="text-xs text-zinc-500">lượt mở</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
