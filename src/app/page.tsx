import Link from "next/link";
import { getDocuments } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const documents = await getDocuments();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <h1 className="text-xl font-bold tracking-tight">Track URL</h1>
          <Link
            href="/new"
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            + Tao link moi
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-8">
        {documents.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-300 py-16 text-center dark:border-zinc-700">
            <p className="text-zinc-500">Chua co document nao.</p>
            <Link
              href="/new"
              className="mt-2 inline-block text-sm font-medium text-zinc-900 underline dark:text-white"
            >
              Tao tracking link dau tien
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {documents.map((doc) => (
              <Link
                key={doc.id}
                href={`/analytics/${doc.id}`}
                className="flex items-center justify-between rounded-xl border border-zinc-200 bg-white p-5 transition-colors hover:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-600"
              >
                <div className="min-w-0 flex-1">
                  <h2 className="truncate font-semibold">{doc.title}</h2>
                  <p className="mt-1 truncate text-sm text-zinc-500">
                    /docs/{doc.id}
                  </p>
                </div>
                <div className="ml-6 flex flex-col items-end">
                  <span className="text-2xl font-bold tabular-nums">
                    {doc.open_count}
                  </span>
                  <span className="text-xs text-zinc-500">luot mo</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
