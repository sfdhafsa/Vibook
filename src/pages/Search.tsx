// src/pages/Search.tsx
import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import SearchBar from "@/components/SearchBar/SearchBar";
import BookCard from "@/components/BookCard/BookCard";
import Loader from "@/components/Loader/Loader";
import Pagination from "@/components/Pagination/Pagination";
import { getCoverUrlById } from "@/api/openLibrary";
import { useHandleSearch } from "@/hooks/useHandleSearch";

interface Filters {
  author?: string;
  subject?: string;
  year?: string;
  language?: string;
}

function Search() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const initialQuery = params.get("q") || "";

  const {
    query,
    setQuery,
    page,
    setPage,
    pageSize,
    results,
    loading,
    error,
    handleSearch,
  } = useHandleSearch({ initialQuery, pageSize: 20 });

  const [filters, setFilters] = useState<Filters>({
    author: "",
    subject: "",
    year: "",
    language: "",
  });

  // Run search when page or initialQuery changes
  useEffect(() => {
    if (initialQuery && initialQuery.length >= 2) {
      handleSearch(initialQuery, 1, filters);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery]);

  const handleFilterSearch = () => {
    setPage(1);
    handleSearch(query, 1, filters);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* SEARCH SECTION */}
      <section className="w-full border-b border-gray-200 bg-white/80 backdrop-blur shadow-sm">
        <div className="mt-6 flex justify-center max-w-7xl mx-auto px-4 md:px-8 pt-12 pb-8">
          <div className="w-full max-w-2xl">
            <SearchBar
              query={query}
              setQuery={setQuery}
              onSearch={(q) => {
                setPage(1);
                handleSearch(q, 1, filters);
              }}
            />

            {/* FILTER PANEL */}
            <div className="mt-4 p-6 md:p-8 bg-white/80 backdrop-blur rounded-xl shadow-sm flex flex-wrap md:flex-nowrap gap-6 items-center">
              {/* Author */}
              <div className="relative flex-1 min-w-[120px]">
                <input
                  type="text"
                  placeholder="Author"
                  value={filters.author}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, author: e.target.value }))
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-1 focus:ring-blue-400 focus:border-blue-400 text-sm"
                />
                {filters.author && (
                  <button
                    type="button"
                    onClick={() =>
                      setFilters((prev) => ({ ...prev, author: "" }))
                    }
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Subject */}
              <div className="relative flex-1 min-w-[120px]">
                <input
                  type="text"
                  placeholder="Subject"
                  value={filters.subject}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, subject: e.target.value }))
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-1 focus:ring-blue-400 focus:border-blue-400 text-sm"
                />
                {filters.subject && (
                  <button
                    type="button"
                    onClick={() =>
                      setFilters((prev) => ({ ...prev, subject: "" }))
                    }
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Year */}
              <div className="relative flex-1 min-w-[100px]">
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={4}
                  placeholder="Year"
                  value={filters.year}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, year: e.target.value }))
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-1 focus:ring-blue-400 focus:border-blue-400 text-sm"
                />
                {filters.year && (
                  <button
                    type="button"
                    onClick={() =>
                      setFilters((prev) => ({ ...prev, year: "" }))
                    }
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Language */}
              <div className="relative flex-1 min-w-[100px]">
                <input
                  type="text"
                  placeholder="Language"
                  value={filters.language}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      language: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-1 focus:ring-blue-400 focus:border-blue-400 text-sm"
                />
                {filters.language && (
                  <button
                    type="button"
                    onClick={() =>
                      setFilters((prev) => ({ ...prev, language: "" }))
                    }
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Apply Filters Button */}
              <button
                onClick={handleFilterSearch}
                className="flex-shrink-0 md:ml-auto min-w-[140px] px-6 py-2
                 bg-gradient-to-r
                 from-blue-500 to-blue-600
                 text-white font-semibold
                 rounded-lg shadow-md
                 hover:from-blue-600
                 hover:to-blue-700
                 transition-all
                 duration-200
                 focus:outline-none
                 focus:ring-2
                 focus:ring-blue-400
                 focus:ring-offset-1
                 text-sm text-center"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* RESULTS SECTION */}
      <section className="w-full mt-12">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
          {loading && (
            <div className="flex justify-center mt-10">
              <Loader />
            </div>
          )}

          {error && (
            <p className="text-red-500 text-center mt-8 font-medium">{error}</p>
          )}

          {!loading && results && results.docs.length === 0 && (
            <p className="text-gray-600 text-center mt-10">
              No results found. Try another query.
            </p>
          )}

          {/* GRID */}
          <div className="mt-12 grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {results?.docs.map((book) => (
              <BookCard
                key={book.key}
                title={book.title}
                author={
                  book.author_name && book.author_name[0]
                    ? book.author_name[0]
                    : undefined
                }
                cover={book.cover_i ? getCoverUrlById(book.cover_i) : null}
                link={book.key.replace("/works/", "/book/")}
              />
            ))}
          </div>

          {/* PAGINATION */}
          {results && results.numFound > pageSize && (
            <div className="mt-16 flex justify-center">
              <Pagination
                currentPage={page}
                totalItems={results.numFound}
                pageSize={pageSize}
                onPageChange={(newPage) => {
                  setPage(newPage);
                  handleSearch(query, newPage, filters);
                }}
              />
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Search;
