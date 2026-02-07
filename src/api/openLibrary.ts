import axios, { AxiosError } from "axios";
// src/api/openLibraryApi.ts
// Centralized Open Library API client.
// All HTTP calls related to Open Library should stay here.

const OPEN_LIBRARY_BASE_URL = "https://openlibrary.org";
const OPEN_LIBRARY_COVERS_BASE_URL = "https://covers.openlibrary.org";

/* -------------------------------------------------------------------------- */
/*                                   TYPES                                    */
/* -------------------------------------------------------------------------- */

/** Response format from /search.json */
export type OpenLibrarySearchResponse = {
  numFound: number;
  start: number;
  docs: Array<{
    key: string; // ex: "/works/OL45883W"
    title: string;
    author_name?: string[];
    first_publish_year?: number;
    cover_i?: number;
    subject?: string[];
    language?: string[];
    edition_count?: number;
  }>;
};

/** Quick search params */
export type SearchBooksParams = {
  q: string;
  page?: number;
  limit?: number;
};

/** Advanced search params */
export type AdvancedSearchParams = {
  title?: string;
  author?: string;
  subject?: string;
  first_publish_year?: number;
  language?: string; // ex: "eng"
  page?: number;
  limit?: number;
};

/** Work details from /works/{id}.json */
export type OpenLibraryWorkDetails = {
  key: string;
  title: string;

  description?: string | { value: string };

  subjects?: string[];
  covers?: number[];

  first_publish_date?: string;

  created?: { value: string };
  last_modified?: { value: string };

  authors?: Array<{
    author: { key: string }; // ex: "/authors/OL23919A"
    type?: { key: string };
  }>;
};

/** Author details from /authors/{id}.json */
export type OpenLibraryAuthorDetails = {
  key: string;
  name: string;
  bio?: string | { value: string };
  birth_date?: string;
  death_date?: string;
};

/** Recent changes item from /recentchanges.json */
export type OpenLibraryRecentChange = {
  id: string;
  kind: string;
  timestamp: string;
  comment?: string;
  author?: { key: string };
  changes?: unknown[];
};

/** Cover sizes supported by Open Library */
export type CoverSize = "S" | "M" | "L";

/* -------------------------------------------------------------------------- */
/*                             INTERNAL UTILITIES                              */
/* -------------------------------------------------------------------------- */

/**
 * Generic JSON fetch helper:
 * - Handles HTTP errors consistently
 * - Returns typed JSON
 */
async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);

  if (!res.ok) {
    // Include URL in error to help debugging
    throw new Error(`OpenLibrary API error (${res.status}) on: ${url}`);
  }

  return (await res.json()) as T;
}

/**
 * Ensures a number is inside a safe range.
 * Useful for limit/page validation.
 */
function clampNumber(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

/**
 * Open Library sometimes returns:
 * - string
 * - OR { value: string }
 *
 * This helper normalizes it into a clean string.
 */
export function normalizeTextField(
  field?: string | { value: string }
): string | null {
  if (!field) return null;
  if (typeof field === "string") return field.trim() || null;
  if (typeof field.value === "string") return field.value.trim() || null;
  return null;
}

/* -------------------------------------------------------------------------- */
/*                                SEARCH API                                  */
/* -------------------------------------------------------------------------- */

/**
 * QUICK SEARCH
 * Endpoint: /search.json?q=...
 *
 * Used for:
 * - Search bar visible on all pages
 * - Search page results
 */
export async function searchBooks(
  params: SearchBooksParams
): Promise<OpenLibrarySearchResponse> {
  const q = params.q?.trim();
  const page = params.page ?? 1;
  const limit = params.limit ?? 20;

  if (!q || q.length < 2) {
    throw new Error("Search query must be at least 2 characters.");
  }

  if (page < 1) {
    throw new Error("Page must be >= 1.");
  }

  // Keep UI responsive + avoid abuse
  const safeLimit = clampNumber(limit, 1, 100);

  const url = `${OPEN_LIBRARY_BASE_URL}/search.json`;
  const paramsObj = {
    q,
    page: String(page),
    limit: String(safeLimit),
  };

  try {
    const response = await axios.get<OpenLibrarySearchResponse>(url, { params: paramsObj });
    // Defensive: ensure docs is always an array
    if (!response.data || !Array.isArray(response.data.docs)) {
      throw new Error("Malformed response from Open Library API.");
    }
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const err = error as AxiosError;
      if (err.response) {
        throw new Error(`OpenLibrary API error (${err.response.status}): ${err.response.statusText}`);
      } else if (err.request) {
        throw new Error("No response received from Open Library API.");
      } else {
        throw new Error(`Axios error: ${err.message}`);
      }
    } else if (error instanceof Error) {
      throw error;
    } else {
      throw new Error("Unknown error occurred during book search.");
    }
  }
}

/**
 * ADVANCED SEARCH
 * Endpoint: /search.json?title=...&author=...&subject=...
 *
 * Used for:
 * - Advanced search page
 */
export async function advancedSearch(
  params: AdvancedSearchParams
): Promise<OpenLibrarySearchResponse> {
  const page = params.page ?? 1;
  const limit = params.limit ?? 20;

  if (page < 1) throw new Error("Page must be >= 1.");

  const safeLimit = clampNumber(limit, 1, 100);

  // Require at least one filter
  const hasAnyFilter =
    !!params.title ||
    !!params.author ||
    !!params.subject ||
    !!params.first_publish_year ||
    !!params.language;

  if (!hasAnyFilter) {
    throw new Error("Advanced search requires at least one filter.");
  }

  const url = new URL(`${OPEN_LIBRARY_BASE_URL}/search.json`);

  if (params.title) url.searchParams.set("title", params.title.trim());
  if (params.author) url.searchParams.set("author", params.author.trim());
  if (params.subject) url.searchParams.set("subject", params.subject.trim());
  if (params.language) url.searchParams.set("language", params.language.trim());

  if (params.first_publish_year) {
    url.searchParams.set(
      "first_publish_year",
      String(params.first_publish_year)
    );
  }

  url.searchParams.set("page", String(page));
  url.searchParams.set("limit", String(safeLimit));

  return fetchJson<OpenLibrarySearchResponse>(url.toString());
}

/* -------------------------------------------------------------------------- */
/*                              DETAILS API (WORK)                             */
/* -------------------------------------------------------------------------- */

/**
 * GET WORK DETAILS
 * Endpoint: /works/{id}.json
 *
 * Example key: "/works/OL45883W"
 */
export async function getWorkByKey(
  workKey: string
): Promise<OpenLibraryWorkDetails> {
  if (!workKey || typeof workKey !== "string") {
    throw new Error("Work key is required.");
  }

  if (!workKey.startsWith("/works/")) {
    throw new Error(`Invalid work key: ${workKey}`);
  }

  const url = `${OPEN_LIBRARY_BASE_URL}${workKey}.json`;
  return fetchJson<OpenLibraryWorkDetails>(url);
}

/**
 * GET AUTHOR DETAILS
 * Endpoint: /authors/{id}.json
 *
 * Example key: "/authors/OL23919A"
 */
export async function getAuthorByKey(
  authorKey: string
): Promise<OpenLibraryAuthorDetails> {
  if (!authorKey || typeof authorKey !== "string") {
    throw new Error("Author key is required.");
  }

  if (!authorKey.startsWith("/authors/")) {
    throw new Error(`Invalid author key: ${authorKey}`);
  }

  const url = `${OPEN_LIBRARY_BASE_URL}${authorKey}.json`;
  return fetchJson<OpenLibraryAuthorDetails>(url);
}

/* -------------------------------------------------------------------------- */
/*                                HOME / RECENT                               */
/* -------------------------------------------------------------------------- */

/**
 * RECENT CHANGES
 * Endpoint: /recentchanges.json
 *
 * Used for:
 * - Home page recent changes feed
 */
export async function getRecentChanges(
  limit = 10
): Promise<OpenLibraryRecentChange[]> {
  const safeLimit = clampNumber(limit, 1, 50);

  const url = new URL(`${OPEN_LIBRARY_BASE_URL}/recentchanges.json`);
  url.searchParams.set("limit", String(safeLimit));

  return fetchJson<OpenLibraryRecentChange[]>(url.toString());
}

/* -------------------------------------------------------------------------- */
/*                                   HELPERS                                  */
/* -------------------------------------------------------------------------- */

/**
 * COVER URL BUILDER
 * Open Library cover images:
 * https://covers.openlibrary.org/b/id/{coverId}-{size}.jpg
 *
 * Used for:
 * - Book cards
 * - Book details page
 */
export function getCoverUrlById(coverId: number, size: CoverSize = "M") {
  if (!coverId || coverId <= 0) return null;
  return `${OPEN_LIBRARY_COVERS_BASE_URL}/b/id/${coverId}-${size}.jpg`;
}

/**
 * Extract the first author key from a work object.
 * Useful for BookDetails page.
 */
export function getFirstAuthorKey(work: OpenLibraryWorkDetails): string | null {
  const key = work.authors?.[0]?.author?.key;
  return key && key.startsWith("/authors/") ? key : null;
}
