import { useState, useCallback } from 'react';

interface UseSearchOptions {
  initialQuery?: string;
}

export interface UseSearchReturn {
  searchQuery: string;
  showSearchModal: boolean;
  setSearchQuery: (query: string) => void;
  openSearchModal: () => void;
  closeSearchModal: () => void;
  clearSearch: () => void;
  handleSearchSubmit: (
    query: string,
    onPageChange?: (page: number) => void
  ) => void;
  handleSearchCancel: () => void;
}

export const useSearch = (options: UseSearchOptions = {}): UseSearchReturn => {
  const { initialQuery = '' } = options;

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [showSearchModal, setShowSearchModal] = useState(false);

  const openSearchModal = useCallback(() => {
    setShowSearchModal(true);
  }, []);

  const closeSearchModal = useCallback(() => {
    setShowSearchModal(false);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

  const handleSearchSubmit = useCallback(
    (query: string, onPageChange?: (page: number) => void) => {
      setSearchQuery(query);
      closeSearchModal();
      onPageChange?.(1); // Reset to first page when searching
    },
    [closeSearchModal]
  );

  const handleSearchCancel = useCallback(() => {
    clearSearch();
    closeSearchModal();
  }, [clearSearch, closeSearchModal]);

  return {
    searchQuery,
    showSearchModal,
    setSearchQuery,
    openSearchModal,
    closeSearchModal,
    clearSearch,
    handleSearchSubmit,
    handleSearchCancel,
  };
};
