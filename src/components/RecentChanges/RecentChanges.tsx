import { useEffect, useMemo, useState } from "react";
import { getRecentChanges } from "@/api/openLibrary";
import type { OpenLibraryRecentChange } from "@/api/openLibrary";

type RecentChangesProps = { limit?: number };

function formatRelativeDate(dateString: string) {
  const d = new Date(dateString);
  const diff = Date.now() - d.getTime();

  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;

  return d.toLocaleDateString();
}

function kindBadge(kind: string) {
  const k = kind.toLowerCase();
  if (k.includes("edit")) return "bg-blue-50 text-blue-700 border-blue-100";
  if (k.includes("new")) return "bg-emerald-50 text-emerald-700 border-emerald-100";
  if (k.includes("merge")) return "bg-purple-50 text-purple-700 border-purple-100";
  if (k.includes("delete")) return "bg-red-50 text-red-700 border-red-100";
  return "bg-gray-50 text-gray-700 border-gray-100";
}

export default function RecentChanges({ limit = 10 }: RecentChangesProps) {
  const [items, setItems] = useState<OpenLibraryRecentChange[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const skeleton = useMemo(() => Array.from({ length: limit }), [limit]);

  function sanitizeComment(raw?: string | null) {
    if (!raw) return null;
    let t = String(raw).replace(/<[^>]*>/g, "");
    t = t.replace(/class(Name)?\s*=\s*["'`][^"'`]*["'`]/gi, "");
    t = t.replace(/style\s*=\s*\{[^}]*\}/gi, "");
    t = t.replace(/[{}`]/g, "").replace(/\s+/g, " ").trim();
    if (t.length > 240) t = t.slice(0, 240) + "…";
    return t || null;
  }

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getRecentChanges(limit);
        if (!mounted) return;
        setItems(data);
      } catch (e) {
        const msg =
          e instanceof Error ? e.message : "Failed to load recent changes";
        if (!mounted) return;
        setError(msg);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [limit]);

  return (
    <section className="w-full flex justify-center">
      <div className="max-w-4xl w-full flex flex-col gap-4">
        <h3 className="text-2xl font-bold text-gray-900">Recent Changes</h3>
        <p className="text-sm text-gray-600 mb-4">
          Live activity from Open Library
        </p>

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading && !error && (
          <ul className="space-y-4">
            {skeleton.map((_, i) => (
              <li
                key={i}
                className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm animate-pulse"
              >
                <div className="h-5 bg-gray-200 rounded mb-2 w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-full" />
              </li>
            ))}
          </ul>
        )}

        {!loading && !error && items.length === 0 && (
          <div className="rounded-2xl border border-gray-200 bg-white p-6 text-sm text-gray-600">
            No recent changes right now.
          </div>
        )}

        {!loading && !error && items.length > 0 && (
          <ul className="flex flex-col gap-4">
            {items.map((it, index) => (
              <li
                key={it.id ?? `${it.timestamp}-${it.kind}-${index}`}
                className="group rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-lg hover:border-gray-300 transition-all duration-200 p-4 md:p-5 flex flex-col md:flex-row gap-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded-full border ${kindBadge(it.kind)}`}
                    >
                      {it.kind}
                    </span>
                    {it.author?.key && (
                      <span className="text-xs text-gray-500">
                        by <span className="font-medium text-gray-700">{it.author.key.replace("/people/", "")}</span>
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-800 leading-snug line-clamp-2">
                    {sanitizeComment(it.comment) ?? (
                      <span className="text-gray-400 italic">No comment provided.</span>
                    )}
                  </p>
                </div>
                <div className="text-xs text-gray-500 whitespace-nowrap md:ml-auto">
                  {formatRelativeDate(it.timestamp)}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
