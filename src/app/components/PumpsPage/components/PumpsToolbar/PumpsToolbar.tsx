import React from 'react';
import { Button, Row, Col } from 'react-bootstrap';
import { RiDeleteBin5Fill } from 'react-icons/ri';
import { IoSearch } from 'react-icons/io5';
import { HiOutlineFilter } from 'react-icons/hi';
import { TiPencil } from 'react-icons/ti';

interface PumpsToolbarProps {
  selectedCount?: number;
  deleteMode?: boolean;
  editMode?: boolean;
  onSearch?: () => void;
  onFilter?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onEnterDeleteMode?: () => void;
  onExitDeleteMode?: () => void;
  onEnterEditMode?: () => void;
  onExitEditMode?: () => void;
  disabled?: boolean;
}

export const PumpsToolbar: React.FC<PumpsToolbarProps> = ({
  selectedCount = 0,
  deleteMode = false,
  editMode = false,
  onSearch,
  onFilter,
  onDelete,
  onEnterDeleteMode,
  onExitDeleteMode,
  onEnterEditMode,
  onExitEditMode,
  disabled = false,
}) => {
  return (
    <Row className="mb-3">
      <Col xs={12}>
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex gap-2">
            {!deleteMode && !editMode && (
              <>
                <Button
                  variant="outline-secondary"
                  className="border-0"
                  onClick={onSearch}
                  disabled={disabled}
                  title="Search pumps"
                >
                  <IoSearch />
                </Button>
                <Button
                  variant="outline-secondary"
                  className="border-0"
                  onClick={onFilter}
                  disabled={disabled}
                  title="Filter pumps"
                >
                  <HiOutlineFilter />
                </Button>
                <Button
                  variant="outline-secondary"
                  className="border-0"
                  onClick={onEnterEditMode}
                  disabled={disabled}
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
                disabled={disabled}
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
                disabled={disabled}
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
                  disabled={disabled || selectedCount === 0}
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
                  disabled={disabled}
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
