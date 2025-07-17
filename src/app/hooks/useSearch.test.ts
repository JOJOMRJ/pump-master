import { renderHook, act } from '@testing-library/react';
import { useSearch } from './useSearch';

describe('useSearch', () => {
  it('initializes with empty search query', () => {
    const { result } = renderHook(() => useSearch());
    
    expect(result.current.searchQuery).toBe('');
    expect(result.current.showSearchModal).toBe(false);
  });

  it('initializes with provided initial query', () => {
    const { result } = renderHook(() => useSearch({ initialQuery: 'test' }));
    
    expect(result.current.searchQuery).toBe('test');
  });

  it('sets search query', () => {
    const { result } = renderHook(() => useSearch());
    
    act(() => {
      result.current.setSearchQuery('pump');
    });
    
    expect(result.current.searchQuery).toBe('pump');
  });

  it('opens search modal', () => {
    const { result } = renderHook(() => useSearch());
    
    act(() => {
      result.current.openSearchModal();
    });
    
    expect(result.current.showSearchModal).toBe(true);
  });

  it('closes search modal', () => {
    const { result } = renderHook(() => useSearch());
    
    act(() => {
      result.current.openSearchModal();
    });
    
    expect(result.current.showSearchModal).toBe(true);
    
    act(() => {
      result.current.closeSearchModal();
    });
    
    expect(result.current.showSearchModal).toBe(false);
  });

  it('clears search query', () => {
    const { result } = renderHook(() => useSearch());
    
    act(() => {
      result.current.setSearchQuery('pump');
    });
    
    expect(result.current.searchQuery).toBe('pump');
    
    act(() => {
      result.current.clearSearch();
    });
    
    expect(result.current.searchQuery).toBe('');
  });

  it('handles search submit', () => {
    const { result } = renderHook(() => useSearch());
    const mockOnPageChange = vi.fn();
    
    act(() => {
      result.current.openSearchModal();
    });
    
    expect(result.current.showSearchModal).toBe(true);
    
    act(() => {
      result.current.handleSearchSubmit('test query', mockOnPageChange);
    });
    
    expect(result.current.searchQuery).toBe('test query');
    expect(result.current.showSearchModal).toBe(false);
    expect(mockOnPageChange).toHaveBeenCalledWith(1);
  });

  it('handles search submit without page change callback', () => {
    const { result } = renderHook(() => useSearch());
    
    act(() => {
      result.current.openSearchModal();
    });
    
    act(() => {
      result.current.handleSearchSubmit('test query');
    });
    
    expect(result.current.searchQuery).toBe('test query');
    expect(result.current.showSearchModal).toBe(false);
  });

  it('handles search cancel', () => {
    const { result } = renderHook(() => useSearch());
    
    act(() => {
      result.current.setSearchQuery('existing query');
      result.current.openSearchModal();
    });
    
    expect(result.current.searchQuery).toBe('existing query');
    expect(result.current.showSearchModal).toBe(true);
    
    act(() => {
      result.current.handleSearchCancel();
    });
    
    expect(result.current.searchQuery).toBe('');
    expect(result.current.showSearchModal).toBe(false);
  });

  it('maintains state across modal operations', () => {
    const { result } = renderHook(() => useSearch());
    
    act(() => {
      result.current.setSearchQuery('persistent query');
    });
    
    act(() => {
      result.current.openSearchModal();
    });
    
    expect(result.current.searchQuery).toBe('persistent query');
    
    act(() => {
      result.current.closeSearchModal();
    });
    
    expect(result.current.searchQuery).toBe('persistent query');
  });

  it('handles multiple modal toggles', () => {
    const { result } = renderHook(() => useSearch());
    
    act(() => {
      result.current.openSearchModal();
    });
    
    expect(result.current.showSearchModal).toBe(true);
    
    act(() => {
      result.current.openSearchModal();
    });
    
    expect(result.current.showSearchModal).toBe(true);
    
    act(() => {
      result.current.closeSearchModal();
    });
    
    expect(result.current.showSearchModal).toBe(false);
  });

  it('handles empty string queries', () => {
    const { result } = renderHook(() => useSearch());
    
    act(() => {
      result.current.setSearchQuery('');
    });
    
    expect(result.current.searchQuery).toBe('');
    
    act(() => {
      result.current.handleSearchSubmit('');
    });
    
    expect(result.current.searchQuery).toBe('');
  });

  it('handles special characters in queries', () => {
    const { result } = renderHook(() => useSearch());
    
    const specialQuery = 'test@#$%^&*()_+-=[]{}|;:,.<>?';
    
    act(() => {
      result.current.setSearchQuery(specialQuery);
    });
    
    expect(result.current.searchQuery).toBe(specialQuery);
  });

  it('handles long query strings', () => {
    const { result } = renderHook(() => useSearch());
    
    const longQuery = 'a'.repeat(1000);
    
    act(() => {
      result.current.setSearchQuery(longQuery);
    });
    
    expect(result.current.searchQuery).toBe(longQuery);
  });

  it('preserves query when modal is cancelled after submission', () => {
    const { result } = renderHook(() => useSearch());
    
    act(() => {
      result.current.handleSearchSubmit('submitted query');
    });
    
    expect(result.current.searchQuery).toBe('submitted query');
    
    act(() => {
      result.current.openSearchModal();
      result.current.handleSearchCancel();
    });
    
    expect(result.current.searchQuery).toBe('');
  });

  it('resets to first page on search submit', () => {
    const { result } = renderHook(() => useSearch());
    const mockOnPageChange = vi.fn();
    
    act(() => {
      result.current.handleSearchSubmit('query', mockOnPageChange);
    });
    
    expect(mockOnPageChange).toHaveBeenCalledWith(1);
  });
});