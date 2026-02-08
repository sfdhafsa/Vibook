// src/hooks/useSearchSuggestion.ts
import { useEffect, useMemo, useState } from "react";
import { searchBooks } from "@/api/openLibrary";

export function useSearchSuggestions(query?: string) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const normalizedQuery = useMemo(() => (query ?? "").trim(), [query]);

  useEffect(() => {
    if (normalizedQuery.length < 2) {
      setSuggestions([]);
      return;
    }

    let cancelled = false;

    const timeout = setTimeout(async () => {
      setLoading(true);

      try {
        const data = await searchBooks({
          q: normalizedQuery,
          page: 1,
          limit: 15,
        });

        if (cancelled) return;

        const titles = data.docs
          .map((d) => d.title?.trim())
          .filter((t): t is string => !!t && t.length > 0);

        const unique = Array.from(new Set(titles)).slice(0, 8);
        setSuggestions(unique);
      } catch {
        if (!cancelled) setSuggestions([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 80);

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [normalizedQuery]);

  return { suggestions, loading, setSuggestions };
}
