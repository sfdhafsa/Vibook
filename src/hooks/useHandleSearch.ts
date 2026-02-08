// src/hooks/useHandleSearch.ts
import { useState } from "react";
import { searchBooks } from "@/api/openLibrary";
import type { OpenLibrarySearchResponse } from "@/api/openLibrary";


type UseHandleSearchOptions = {
  initialQuery?: string;
  initialPage?: number;
  pageSize?: number;
};


export function useHandleSearch(options?: UseHandleSearchOptions) {
  const initialQuery = options?.initialQuery ?? "";
  const initialPage = options?.initialPage ?? 1;
  const pageSize = options?.pageSize ?? 20;

  const [query, setQuery] = useState(initialQuery);
  const [page, setPage] = useState(initialPage);
  const [results, setResults] = useState<OpenLibrarySearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Triggers a search for books. Accepts optional query and page, otherwise uses current state.
   */
  const handleSearch = async (q?: string, p?: number) => {
    const searchQuery = (q ?? query).trim();
    const searchPage = p ?? page;

    if (searchQuery.length < 2) {
      setResults(null);
      setError("Please enter at least 2 characters.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await searchBooks({
        q: searchQuery,
        page: searchPage,
        limit: pageSize,
      });
      setResults(data);
      setPage(searchPage);
      setQuery(searchQuery);
    } catch (e: unknown) {
      // Debug log for browser console
      console.error('Search error:', e);
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("An unknown error occurred.");
      }
      setResults(null);
    } finally {
      setLoading(false);
    }
  };

  return {
    query,
    setQuery,
    page,
    setPage,
    pageSize,
    results,
    loading,
    error,
    handleSearch,
  };
}
