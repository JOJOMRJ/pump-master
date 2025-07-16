import { useState, useCallback } from 'react';

interface UseSearchOptions {
  initialQuery?: string;
  onSearch?: (query: string) => void;
  onClear?: () => void;
  onPageReset?: () => void;
}

interface UseSearchReturn {
  searchQuery: string;
  showSearchModal: boolean;
  setSearchQuery: (query: string) => void;
  openSearchModal: () => void;
  closeSearchModal: () => void;
  clearSearch: () => void;
  handleSearch: () => void;
  handleClearSearch: () => void;
  handleSearchSubmit: (query: string) => void;
  handleSearchCancel: () => void;
}

export const useSearch = (options: UseSearchOptions = {}): UseSearchReturn => {
  const { initialQuery = '', onSearch, onClear, onPageReset } = options;

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
    onClear?.();
  }, [onClear]);

  const handleSearch = useCallback(() => {
    openSearchModal();
    onSearch?.(searchQuery);
  }, [openSearchModal, onSearch, searchQuery]);

  const handleClearSearch = useCallback(() => {
    clearSearch();
    onClear?.();
  }, [clearSearch, onClear]);

  const handleSearchSubmit = useCallback(
    (query: string) => {
      setSearchQuery(query);
      closeSearchModal();
      onPageReset?.(); // Reset to first page when searching
    },
    [closeSearchModal, onPageReset]
  );

  const handleSearchCancel = useCallback(() => {
    closeSearchModal();
  }, [closeSearchModal]);

  return {
    searchQuery,
    showSearchModal,
    setSearchQuery,
    openSearchModal,
    closeSearchModal,
    clearSearch,
    handleSearch,
    handleClearSearch,
    handleSearchSubmit,
    handleSearchCancel,
  };
};
