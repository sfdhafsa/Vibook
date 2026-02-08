import { useState } from "react";
import { useNavigate } from "react-router";

interface SearchBarProps {
  query?: string;
  setQuery?: (q: string) => void;
  onSearch?: (q: string) => void;
}

function SearchBar({
  query: propQuery,
  setQuery: propSetQuery,
  onSearch: propOnSearch,
}: SearchBarProps) {
  const [internalQuery, setInternalQuery] = useState("");
  const navigate = useNavigate();

  const query = propQuery ?? internalQuery;
  const setQuery = propSetQuery ?? setInternalQuery;

  const handleSearch = () => {
    if (!query || query.trim().length < 2) return;

    if (propOnSearch) {
      // controlled mode
      propOnSearch(query.trim());
    } else {
      // uncontrolled mode: navigate to search page
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="flex items-center gap-3 py-8 md:py-10 lg:py-12 px-6 md:px-8 lg:px-10 w-full max-w-2xl mx-auto relative z-50">
      <input
        type="text"
        placeholder="Search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        className="flex-1 min-w-0 w-full p-4 md:p-5 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:outline-none text-sm md:text-base"
      />
      <button
        type="button"
        onClick={handleSearch}
        className="flex-shrink-0 p-4 md:p-5 text-black hover:opacity-70 transition-opacity"
        aria-label="Search"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5 md:w-6 md:h-6"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
      </button>
    </div>
  );
}

export default SearchBar;
