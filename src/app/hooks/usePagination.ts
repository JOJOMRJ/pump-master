import { useState, useCallback } from 'react';

export interface PaginationState {
  currentPage: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface PaginationActions {
  handlePageChange: (page: number) => void;
  handlePageSizeChange: (size: number) => void;
  setTotal: (total: number) => void;
  setTotalPages: (totalPages: number) => void;
  reset: () => void;
}

export interface UsePaginationReturn
  extends PaginationState,
    PaginationActions {}

export const usePagination = (
  initialPageSize: number = 10,
  onPageChange?: () => void,
  onPageSizeChange?: () => void
): UsePaginationReturn => {
  // User input states - control API requests
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  // Server response states - for UI display
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const handlePageChange = useCallback(
    (page: number) => {
      setCurrentPage(page);
      onPageChange?.();
    },
    [onPageChange]
  );

  const handlePageSizeChange = useCallback(
    (size: number) => {
      setPageSize(size);
      setCurrentPage(1); // Reset to first page when changing page size
      onPageSizeChange?.();
    },
    [onPageSizeChange]
  );

  const reset = useCallback(() => {
    setCurrentPage(1);
    setTotal(0);
    setTotalPages(0);
  }, []);

  return {
    // State
    currentPage,
    pageSize,
    total,
    totalPages,
    // Actions
    handlePageChange,
    handlePageSizeChange,
    setTotal,
    setTotalPages,
    reset,
  };
};
