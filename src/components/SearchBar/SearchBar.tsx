const SearchBar = () => {
  return (
    <div className="flex items-center gap-2 p-4 md:p-8 lg:p-20 m-4 md:m-8 lg:m-20 w-full max-w-2xl mx-auto">
      <input
        type="text"
        placeholder="Search"
        className="flex-1 min-w-0 w-full p-2 md:p-3 rounded-lg border-2 border-gray-300 focus:border-blue-500 
        focus:outline-none text-sm md:text-base"
      />
      <button
        type="button"
        className="flex-shrink-0 p-2 md:p-3 text-black hover:opacity-70 transition-opacity"
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
};

export default SearchBar;
