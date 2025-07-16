import { renderHook, act } from '@testing-library/react';
import { usePagination } from './usePagination';

describe('usePagination', () => {
  it('should initialize with default values', () => {
    const { result } = renderHook(() => usePagination());

    expect(result.current.currentPage).toBe(1);
    expect(result.current.pageSize).toBe(10);
    expect(result.current.total).toBe(0);
    expect(result.current.totalPages).toBe(0);
  });

  it('should initialize with custom page size', () => {
    const { result } = renderHook(() => usePagination(20));

    expect(result.current.pageSize).toBe(20);
  });

  it('should handle page change', () => {
    const { result } = renderHook(() => usePagination());

    act(() => {
      result.current.handlePageChange(3);
    });

    expect(result.current.currentPage).toBe(3);
  });

  it('should handle page size change and reset to first page', () => {
    const { result } = renderHook(() => usePagination());

    // First go to page 3
    act(() => {
      result.current.handlePageChange(3);
    });

    expect(result.current.currentPage).toBe(3);

    // Change page size should reset to page 1
    act(() => {
      result.current.handlePageSizeChange(20);
    });

    expect(result.current.pageSize).toBe(20);
    expect(result.current.currentPage).toBe(1);
  });

  it('should handle setting total and totalPages', () => {
    const { result } = renderHook(() => usePagination());

    act(() => {
      result.current.setTotal(100);
      result.current.setTotalPages(10);
    });

    expect(result.current.total).toBe(100);
    expect(result.current.totalPages).toBe(10);
  });

  it('should reset pagination state', () => {
    const { result } = renderHook(() => usePagination());

    // Set some values
    act(() => {
      result.current.handlePageChange(5);
      result.current.setTotal(100);
      result.current.setTotalPages(10);
    });

    expect(result.current.currentPage).toBe(5);
    expect(result.current.total).toBe(100);
    expect(result.current.totalPages).toBe(10);

    // Reset
    act(() => {
      result.current.reset();
    });

    expect(result.current.currentPage).toBe(1);
    expect(result.current.total).toBe(0);
    expect(result.current.totalPages).toBe(0);
  });
});
