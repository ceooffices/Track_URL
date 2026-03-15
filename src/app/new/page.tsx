"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewDocument() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(e.currentTarget);
    const data = {
      id: (form.get("id") as string).trim(),
      title: (form.get("title") as string).trim(),
      description: (form.get("description") as string).trim(),
      url: (form.get("url") as string).trim(),
    };

    if (!data.id || !data.title || !data.url) {
      setError("Vui lòng điền đầy đủ ID, tiêu đề và URL.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Lỗi tạo document");
      }

      router.push(`/analytics/${data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto flex max-w-5xl items-center gap-4 px-6 py-4">
          <Link href="/" className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white">
            &larr; Quay lại
          </Link>
          <h1 className="text-xl font-bold tracking-tight">Tạo Tracking Link</h1>
        </div>
      </header>

      <main className="mx-auto max-w-xl px-6 py-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="id" className="mb-1 block text-sm font-medium">
              Document ID
            </label>
            <input
              id="id"
              name="id"
              type="text"
              placeholder="vd: proposal-abc123"
              pattern="[a-zA-Z0-9_\-]{1,128}"
              title="Chỉ cho phép a-z, 0-9, gạch ngang, gạch dưới"
              className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-white"
              required
            />
            <p className="mt-1 text-xs text-zinc-500">
              Sẽ tạo link: /docs/[id]
            </p>
          </div>

          <div>
            <label htmlFor="title" className="mb-1 block text-sm font-medium">
              Tiêu đề
            </label>
            <input
              id="title"
              name="title"
              type="text"
              placeholder="vd: Proposal & Báo Giá Dịch Vụ"
              className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-white"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="mb-1 block text-sm font-medium">
              Mô tả (hiển thị khi share qua Zalo/Telegram)
            </label>
            <textarea
              id="description"
              name="description"
              rows={2}
              placeholder="vd: Tài liệu đề xuất dịch vụ. Nhấn vào để xem chi tiết."
              className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-white"
            />
          </div>

          <div>
            <label htmlFor="url" className="mb-1 block text-sm font-medium">
              URL file PDF gốc
            </label>
            <input
              id="url"
              name="url"
              type="url"
              placeholder="https://supabase.co/.../file.pdf"
              className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-white"
              required
            />
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600 dark:bg-red-950 dark:text-red-400">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-zinc-900 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-50 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            {loading ? "Đang tạo..." : "Tạo Tracking Link"}
          </button>
        </form>
      </main>
    </div>
  );
}
