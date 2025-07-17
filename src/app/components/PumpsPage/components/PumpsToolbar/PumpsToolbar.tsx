import React from 'react';
import { Button, Row, Col } from 'react-bootstrap';
import { RiDeleteBin5Fill } from 'react-icons/ri';
import { IoSearch, IoClose } from 'react-icons/io5';
import { HiOutlineFilter } from 'react-icons/hi';
import { TiPencil } from 'react-icons/ti';
import { AppMode } from '../../../../types';
import type { UseSearchReturn } from '../../../../hooks';
import { usePermissions } from '../../../../hooks';
import { PERMISSIONS } from '../../../../types/Permissions';

interface PumpsToolbarProps {
  selectedCount?: number;
  mode: AppMode;
  loading?: boolean;
  search: UseSearchReturn;
  filterMode?: boolean;
  hasActiveFilters?: boolean;
  activeFilterCount?: number;
  onFilter?: () => void;
  onDelete?: () => void;
  onModeChange?: (mode: AppMode) => void;
  onClearFilters?: () => void;
}

export const PumpsToolbar: React.FC<PumpsToolbarProps> = ({
  selectedCount = 0,
  mode,
  loading = false,
  search,
  filterMode = false,
  hasActiveFilters = false,
  activeFilterCount = 0,
  onFilter,
  onDelete,
  onModeChange,
  onClearFilters,
}) => {
  const { hasPermission } = usePermissions();
  const deleteMode = mode === AppMode.DELETE;
  const editMode = mode === AppMode.EDIT;

  return (
    <Row className="mb-3">
      <Col xs={12}>
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex gap-2">
            {!deleteMode && (
              <>
                <div className="d-flex align-items-center gap-1">
                  <Button
                    variant={
                      search.searchQuery ? 'primary' : 'outline-secondary'
                    }
                    className="border-0"
                    onClick={search.openSearchModal}
                    disabled={loading}
                    title={
                      search.searchQuery
                        ? `Searching: "${search.searchQuery}"`
                        : 'Search pumps'
                    }
                  >
                    <IoSearch />
                  </Button>
                  {search.searchQuery && (
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      className="border-0"
                      onClick={search.clearSearch}
                      disabled={loading}
                      title="Clear search"
                    >
                      <IoClose />
                    </Button>
                  )}
                </div>
                <Button
                  variant={
                    filterMode || hasActiveFilters
                      ? 'primary'
                      : 'outline-secondary'
                  }
                  className="border-0"
                  onClick={onFilter}
                  disabled={loading}
                  title={filterMode ? 'Exit filter mode' : 'Filter pumps'}
                >
                  <HiOutlineFilter />
                  {hasActiveFilters && (
                    <span className="ms-1 badge bg-light text-dark">
                      {activeFilterCount}
                    </span>
                  )}
                </Button>
                {filterMode && hasActiveFilters && (
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={onClearFilters}
                    disabled={loading}
                    title="Clear all filters"
                  >
                    Clear Filters
                  </Button>
                )}
                {/* Edit button - requires edit permission */}
                {hasPermission(PERMISSIONS.EDIT) && (
                  <Button
                    variant={editMode ? 'primary' : 'outline-secondary'}
                    className="border-0"
                    onClick={() =>
                      onModeChange?.(editMode ? AppMode.NORMAL : AppMode.EDIT)
                    }
                    disabled={loading}
                    title={editMode ? 'Exit edit mode' : 'Enter edit mode'}
                  >
                    <TiPencil />
                  </Button>
                )}
              </>
            )}
          </div>
          <div className="d-flex gap-2">
            {/* Delete button - requires delete permission */}
            {!deleteMode && hasPermission(PERMISSIONS.DELETE) && (
              <Button
                variant="danger"
                style={{ display: 'flex', alignItems: 'center' }}
                onClick={() => onModeChange?.(AppMode.DELETE)}
                disabled={loading || editMode}
                title={
                  editMode ? 'Exit edit mode to delete' : 'Enter delete mode'
                }
              >
                <RiDeleteBin5Fill className="me-1" />
                <span>Delete</span>
              </Button>
            )}
            {deleteMode && (
              <>
                <Button
                  variant="danger"
                  style={{ display: 'flex', alignItems: 'center' }}
                  onClick={onDelete}
                  disabled={loading || selectedCount === 0}
                  title={
                    selectedCount > 0
                      ? `Delete ${selectedCount} selected pump(s)`
                      : 'Select pumps to delete'
                  }
                >
                  <RiDeleteBin5Fill className="me-1" />
                  <span>
                    Delete{selectedCount > 0 ? ` (${selectedCount})` : ''}
                  </span>
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => onModeChange?.(AppMode.NORMAL)}
                  disabled={loading}
                  title="Exit delete mode"
                >
                  Cancel
                </Button>
              </>
            )}
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default PumpsToolbar;
