// src/pages/Search.tsx
import SearchBar from "@/components/SearchBar/SearchBar";
import BookCard from "@/components/BookCard/BookCard";
import Loader from "@/components/Loader/Loader";
import Pagination from "@/components/Pagination/Pagination";
import { getCoverUrlById } from "@/api/openLibrary";
import { useHandleSearch } from "@/hooks/useHandleSearch";
import { useEffect } from "react";
import { useLocation } from "react-router";

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

  useEffect(() => {
    if (initialQuery && initialQuery.length >= 2) {
      handleSearch(initialQuery, 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* SEARCH SECTION (separated visually) */}
      <section className="w-full border-b border-gray-200 bg-white/80 backdrop-blur shadow-sm">

          <div className="mt-6 flex justify-center max-w-7xl mx-auto px-4 md:px-8 pt-12 pb-12">
            <div className="w-full max-w-2xl">
              <SearchBar
                query={query}
                setQuery={setQuery}
                onSearch={(q) => {
                  setPage(1);
                  handleSearch(q, 1);
                }}
              />
            </div>
         
          </div>
      </section>

      <section className="w-full mt-12">
      {/* RESULTS SECTION */}
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
                handleSearch(query, newPage);
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
