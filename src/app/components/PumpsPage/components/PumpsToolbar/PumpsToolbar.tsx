import React from 'react';
import { Button, Row, Col } from 'react-bootstrap';
import { RiDeleteBin5Fill } from 'react-icons/ri';
import { IoSearch } from 'react-icons/io5';
import { HiOutlineFilter } from 'react-icons/hi';
import { TiPencil } from 'react-icons/ti';

interface PumpsToolbarProps {
  selectedCount?: number;
  onSearch?: () => void;
  onFilter?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  disabled?: boolean;
}

export const PumpsToolbar: React.FC<PumpsToolbarProps> = ({
  selectedCount = 0,
  onSearch,
  onFilter,
  onEdit,
  onDelete,
  disabled = false,
}) => {
  return (
    <Row className="mb-3">
      <Col xs={12}>
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex gap-2">
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
              onClick={onEdit}
              disabled={disabled || selectedCount === 0}
              title="Edit selected pumps"
            >
              <TiPencil />
            </Button>
          </div>
          <Button
            variant="primary"
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
            <span>Delete{selectedCount > 0 ? ` (${selectedCount})` : ''}</span>
          </Button>
        </div>
      </Col>
    </Row>
  );
};

export default PumpsToolbar;
