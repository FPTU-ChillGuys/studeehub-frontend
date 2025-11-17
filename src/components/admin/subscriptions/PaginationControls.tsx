import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface PaginationControlsProps {
  pageNumber: number;
  pageSize: number;
  totalCount?: number;
  onPageNumberChange: (value: number) => void;
  onPageSizeChange: (value: number) => void;
  onSearch: () => void;
  loading: boolean;
}

export function PaginationControls({
  pageNumber,
  pageSize,
  totalCount,
  onPageNumberChange,
  onPageSizeChange,
  onSearch,
  loading,
}: PaginationControlsProps) {
  const [goToPageInput, setGoToPageInput] = useState(pageNumber.toString());
  const [inputError, setInputError] = useState("");

  const totalPages = totalCount ? Math.ceil(totalCount / pageSize) : 1;
  const canGoPrev = pageNumber > 1;
  const canGoNext = pageNumber < totalPages;

  const handleGoToPageClick = () => {
    const value = goToPageInput.trim();
    
    if (!value) {
      setInputError("Please enter a page number");
      return;
    }

    const newPage = parseInt(value);

    if (isNaN(newPage)) {
      setInputError("Please enter a valid number");
      return;
    }

    if (newPage < 1) {
      setInputError("Page must be at least 1");
      setGoToPageInput("1");
      onPageNumberChange(1);
      setTimeout(() => onSearch(), 0);
      return;
    }

    if (newPage > totalPages) {
      setInputError(`Page must be at most ${totalPages}`);
      setGoToPageInput(totalPages.toString());
      onPageNumberChange(totalPages);
      setTimeout(() => onSearch(), 0);
      return;
    }

    setInputError("");
    onPageNumberChange(newPage);
    setTimeout(() => onSearch(), 0);
  };

  const handleInputChange = (value: string) => {
    setGoToPageInput(value);
    setInputError("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleGoToPageClick();
    }
  };

  const handlePrevPage = () => {
    if (canGoPrev) {
      onPageNumberChange(pageNumber - 1);
      onSearch();
    }
  };

  const handleNextPage = () => {
    if (canGoNext) {
      onPageNumberChange(pageNumber + 1);
      onSearch();
    }
  };

  const handlePageClick = (page: number) => {
    if (typeof page === "number" && page !== pageNumber) {
      onPageNumberChange(page);
      setTimeout(() => {
        onSearch();
      }, 0);
    }
  };

  const handlePageSizeChange = (value: string) => {
    const newSize = parseInt(value) || 10;
    onPageSizeChange(newSize);
    onPageNumberChange(1);
    setTimeout(() => {
      onSearch();
    }, 0);
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      // Show all pages if total <= 5
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show current page with neighbors
      const start = Math.max(1, pageNumber - 2);
      const end = Math.min(totalPages, start + maxVisible - 1);
      
      if (start > 1) {
        pages.push(1);
        if (start > 2) pages.push("...");
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (end < totalPages) {
        if (end < totalPages - 1) pages.push("...");
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex flex-col gap-4 p-4 border-t">
      {/* Row 1: Rows per page and Info */}
      <div className="flex items-center justify-between">
        {/* Left: Rows per page */}
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-gray-700">Rows per page:</label>
          <select
            value={pageSize}
            onChange={(e) => handlePageSizeChange(e.target.value)}
            disabled={loading}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-slate-900"
          >
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>

        {/* Center: Page Info */}
        <div className="text-sm text-gray-600">
          Page <span className="font-medium">{pageNumber}</span> of{" "}
          <span className="font-medium">{totalPages}</span>
          {totalCount && (
            <>
              {" "}
              • Total: <span className="font-medium">{totalCount}</span> items
            </>
          )}
        </div>

        {/* Right: Go to page */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Go to:</label>
          <div className="flex gap-1">
            <Input
              type="number"
              min="1"
              max={totalPages}
              value={goToPageInput}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
              className={`w-20 h-9 ${inputError ? "border-red-500" : ""}`}
            />
            <Button
              size="sm"
              onClick={handleGoToPageClick}
              disabled={loading}
              className="bg-red-500 hover:bg-red-700 text-white font-medium"
            >
              Go
            </Button>
          </div>
          {inputError && <span className="text-xs text-red-500 ml-2">{inputError}</span>}
        </div>
      </div>

      {/* Row 2: Page numbers */}
      <div className="flex items-center justify-center gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrevPage}
          disabled={!canGoPrev || loading}
        >
          Previous
        </Button>

        <div className="flex items-center gap-1 px-2">
          {pageNumbers.map((page, index) => (
            <button
              key={index}
              onClick={() => {
                if (typeof page === "number") {
                  handlePageClick(page);
                }
              }}
              disabled={typeof page === "string" || loading}
              className={`
                px-3 py-1 rounded-md text-sm font-medium transition-colors
                ${
                  page === pageNumber
                    ? "bg-slate-900 text-white"
                    : typeof page === "number"
                    ? "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 cursor-pointer disabled:opacity-50"
                    : "text-gray-500 cursor-default"
                }
              `}
            >
              {page}
            </button>
          ))}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleNextPage}
          disabled={!canGoNext || loading}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
