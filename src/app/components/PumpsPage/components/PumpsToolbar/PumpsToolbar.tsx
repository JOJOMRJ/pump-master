import React from 'react';
import { Button, Row, Col } from 'react-bootstrap';
import { RiDeleteBin5Fill } from 'react-icons/ri';
import { IoSearch, IoClose } from 'react-icons/io5';
import { HiOutlineFilter } from 'react-icons/hi';
import { TiPencil } from 'react-icons/ti';

interface UIState {
  deleteMode: boolean;
  editMode: boolean;
  loading: boolean;
}

interface SearchState {
  searchQuery: string;
  onSearch: () => void;
  onClearSearch: () => void;
}

interface PumpsToolbarProps {
  selectedCount?: number;
  uiState: UIState;
  searchState: SearchState;
  filterMode?: boolean;
  hasActiveFilters?: boolean;
  activeFilterCount?: number;
  onFilter?: () => void;
  onDelete?: () => void;
  onEnterDeleteMode?: () => void;
  onExitDeleteMode?: () => void;
  onEnterEditMode?: () => void;
  onExitEditMode?: () => void;
  onClearFilters?: () => void;
}

export const PumpsToolbar: React.FC<PumpsToolbarProps> = ({
  selectedCount = 0,
  uiState,
  searchState,
  filterMode = false,
  hasActiveFilters = false,
  activeFilterCount = 0,
  onFilter,
  onDelete,
  onEnterDeleteMode,
  onExitDeleteMode,
  onEnterEditMode,
  onExitEditMode,
  onClearFilters,
}) => {
  const { deleteMode, editMode, loading } = uiState;
  const { searchQuery, onSearch, onClearSearch } = searchState;
  return (
    <Row className="mb-3">
      <Col xs={12}>
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex gap-2">
            {!deleteMode && !editMode && (
              <>
                <div className="d-flex align-items-center gap-1">
                  <Button
                    variant={searchQuery ? 'primary' : 'outline-secondary'}
                    className="border-0"
                    onClick={onSearch}
                    disabled={loading}
                    title={
                      searchQuery
                        ? `Searching: "${searchQuery}"`
                        : 'Search pumps'
                    }
                  >
                    <IoSearch />
                  </Button>
                  {searchQuery && (
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      className="border-0"
                      onClick={onClearSearch}
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
                <Button
                  variant="outline-secondary"
                  className="border-0"
                  onClick={onEnterEditMode}
                  disabled={loading}
                  title="Enter edit mode"
                >
                  <TiPencil />
                </Button>
              </>
            )}
          </div>
          <div className="d-flex gap-2">
            {!deleteMode && !editMode && (
              <Button
                variant="danger"
                style={{ display: 'flex', alignItems: 'center' }}
                onClick={onEnterDeleteMode}
                disabled={loading}
                title="Enter delete mode"
              >
                <RiDeleteBin5Fill className="me-1" />
                <span>Delete</span>
              </Button>
            )}
            {editMode && (
              <Button
                variant="secondary"
                onClick={onExitEditMode}
                disabled={loading}
                title="Exit edit mode"
              >
                Cancel
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
                  onClick={onExitDeleteMode}
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
