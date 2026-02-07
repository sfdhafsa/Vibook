// src/components/Pagination/Pagination.tsx
type PaginationProps = {
    currentPage: number;
    totalItems: number;
    pageSize: number;
    onPageChange: (page: number) => void;
  };
  
  function Pagination({
    currentPage,
    totalItems,
    pageSize,
    onPageChange,
  }: PaginationProps) {
    const totalPages = Math.ceil(totalItems / pageSize);
  
    if (totalPages <= 1) return null;
  
    const prevDisabled = currentPage <= 1;
    const nextDisabled = currentPage >= totalPages;
  
    return (
      <div className="flex items-center gap-3">
        <button
          disabled={prevDisabled}
          onClick={() => onPageChange(currentPage - 1)}
          className="px-3 py-2 border rounded-lg disabled:opacity-40"
        >
          Prev
        </button>
  
        <span className="text-sm">
          Page {currentPage} / {totalPages}
        </span>
  
        <button
          disabled={nextDisabled}
          onClick={() => onPageChange(currentPage + 1)}
          className="px-3 py-2 border rounded-lg disabled:opacity-40"
        >
          Next
        </button>
      </div>
    );
  }
  
  export default Pagination;
  