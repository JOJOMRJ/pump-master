import React from 'react';
import { Row, Col, Pagination, Dropdown } from 'react-bootstrap';
import { AppMode } from '../../../../../../types';
import { getPaginationItems } from '../../utils';

interface PaginationSummaryProps {
  currentPage: number;
  pageSize: number;
  total: number;
  totalPages: number;
  selectedCount: number;
  mode?: AppMode;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
}

export const PaginationSummary: React.FC<PaginationSummaryProps> = ({
  currentPage,
  pageSize,
  total,
  totalPages,
  selectedCount,
  mode = AppMode.NORMAL,
  onPageChange,
  onPageSizeChange,
}) => {
  const deleteMode = mode === AppMode.DELETE;
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, total);

  return (
    <Row className="mt-3">
      <Col xs={12} md={6}>
        <div className="d-flex align-items-center gap-3">
          <div className="text-muted">
            {total > 0 ? (
              <>
                Showing {startItem}-{endItem} of {total} pumps
                {deleteMode && selectedCount > 0 && (
                  <span className="ms-2">• {selectedCount} selected</span>
                )}
              </>
            ) : (
              'No pumps found'
            )}
          </div>
          {onPageSizeChange && (
            <div className="d-flex align-items-center gap-2">
              <span className="text-muted small">Show:</span>
              <Dropdown>
                <Dropdown.Toggle
                  variant="outline-secondary"
                  size="sm"
                  className="border-0 text-primary"
                  style={{ minWidth: '60px' }}
                >
                  {pageSize}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {[10, 20, 50, 100].map(size => (
                    <Dropdown.Item
                      key={size}
                      active={size === pageSize}
                      onClick={() => onPageSizeChange(size)}
                    >
                      {size}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </div>
          )}
        </div>
      </Col>
      {totalPages > 1 && (
        <Col xs={12} md={6} className="d-flex justify-content-end">
          <Pagination className="mb-0">
            <Pagination.First
              onClick={() => onPageChange?.(1)}
              disabled={currentPage === 1}
            />
            <Pagination.Prev
              onClick={() => onPageChange?.(currentPage - 1)}
              disabled={currentPage === 1}
            />
            {getPaginationItems(currentPage, totalPages, onPageChange)}
            <Pagination.Next
              onClick={() => onPageChange?.(currentPage + 1)}
              disabled={currentPage === totalPages}
            />
            <Pagination.Last
              onClick={() => onPageChange?.(totalPages)}
              disabled={currentPage === totalPages}
            />
          </Pagination>
        </Col>
      )}
    </Row>
  );
};

export default PaginationSummary;
