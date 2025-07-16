import React from 'react';
import { Pagination } from 'react-bootstrap';

// Generate pagination items
export const getPaginationItems = (
  currentPage: number,
  totalPages: number,
  onPageChange?: (page: number) => void
): React.ReactElement[] => {
  const items: React.ReactElement[] = [];
  const maxVisiblePages = 5;

  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  for (let page = startPage; page <= endPage; page++) {
    items.push(
      React.createElement(
        Pagination.Item,
        {
          key: page,
          active: page === currentPage,
          onClick: () => onPageChange?.(page),
        },
        page
      )
    );
  }

  return items;
};
