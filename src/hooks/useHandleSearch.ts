// src/hooks/useHandleSearch.ts
import { useCallback, useState } from "react";
import { searchBooks, advancedSearch } from "@/api/openLibrary";
import type { OpenLibrarySearchResponse } from "@/api/openLibrary";

export type SearchFilters = {
  author?: string;
  subject?: string;
  first_publish_year?: string;
  language?: string;
};

export function useHandleSearch({ initialQuery = "", pageSize = 20 } = {}) {
  const [query, setQuery] = useState(initialQuery);
  const [page, setPage] = useState(1);
  const [results, setResults] = useState<OpenLibrarySearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = useCallback(
    async (searchQuery?: string, searchPage?: number, filters?: SearchFilters) => {
      const q = (searchQuery ?? query).trim();
      const p = searchPage ?? page;

      if (!q || q.length < 2) {
        setResults(null);
        setError("Please enter at least 2 characters.");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const data = filters
          ? await advancedSearch({
              title: q,
              author: filters.author,
              subject: filters.subject,
              first_publish_year: filters.first_publish_year
                ? Number(filters.first_publish_year)
                : undefined,
              language: filters.language,
              page: p,
              limit: pageSize,
            })
          : await searchBooks({ q, page: p, limit: pageSize });

        console.log("SEARCH DATA:", data);
        setResults(data);
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : "Something went wrong";
        setError(message);
        setResults(null);
      } finally {
        setLoading(false);
      }
    },
    [query, page, pageSize]
  );

  return { query,
     setQuery,
      page, 
      setPage, 
      pageSize, 
      results, 
      loading, 
      error, 
      handleSearch };
}
