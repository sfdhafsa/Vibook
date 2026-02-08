import { useEffect, useMemo, useState } from "react";
import { getRecentChanges } from "@/api/openLibrary";
import type { OpenLibraryRecentChange } from "@/api/openLibrary";

type RecentChangesProps = {
  limit?: number;
};

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
    <section className="w-full max-w-lg px-4 md:px-0 md:w-auto md:min-w-[240px] md:pr-8">
      {/* HEADER */}
      <div className="flex items-end justify-between gap-6 mb-6">
        <div>
          <h3 className="text-l md:text-xl font-bold text-gray-900">
            Recent changes
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Live activity from Open Library
          </p>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-gray-500">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          Updating
        </div>
      </div>

      {/* ERROR */}
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* LOADING SKELETON */}
      {loading && !error && (
        <ul className="space-y-4">
          {skeleton.map((_, i) => (
            <li
              key={i}
              className="rounded-2xl border border-gray-200 bg-white/70 backdrop-blur p-4 md:p-5"
            >
              <div className="flex items-start justify-between gap-6">
                <div className="flex-1">
                  <div className="h-4 w-28 bg-gray-200 rounded mb-2" />
                  <div className="h-3 w-full max-w-md bg-gray-200 rounded" />
                </div>
                <div className="h-3 w-20 bg-gray-200 rounded" />
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* EMPTY */}
      {!loading && !error && items.length === 0 && (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 text-sm text-gray-600">
          No recent changes right now.
        </div>
      )}

      {/* LIST */}
      {!loading && !error && items.length > 0 && (
        <ul className="space-y-4">
          {items.map((it, index) => (
            <li
              key={it.id ?? `${it.timestamp}-${it.kind}-${index}`}
              className="
                group
                rounded-2xl border border-gray-200
                bg-white/70 backdrop-blur
                shadow-sm
                hover:shadow-md hover:border-gray-300
                transition-all duration-200
                p-4 md:p-5
              "
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded-full border ${kindBadge(
                        it.kind
                      )}`}
                    >
                      {it.kind}
                    </span>

                    {it.author?.key && (
                      <span className="text-xs text-gray-500">
                        by{" "}
                        <span className="font-medium text-gray-700">
                          {it.author.key.replace("/people/", "")}
                        </span>
                      </span>
                    )}
                  </div>

                  <p className="mt-2 text-sm text-gray-800 leading-snug line-clamp-2">
                    {it.comment ? (
                      it.comment
                    ) : (
                      <span className="text-gray-400 italic">
                        No comment provided.
                      </span>
                    )}
                  </p>
                </div>

                <div className="text-xs text-gray-500 whitespace-nowrap">
                  {formatRelativeDate(it.timestamp)}
                </div>
              </div>

              <div className="mt-4 h-px w-full bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity" />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
