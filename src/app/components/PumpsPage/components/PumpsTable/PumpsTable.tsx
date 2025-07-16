import React from 'react';
import { Table, Form, Row, Col, Pagination, Card } from 'react-bootstrap';
import type { PumpDevice } from '../../../../types/PumpDevice';

interface PumpsTableProps {
  pumps: PumpDevice[];
  selectedPumps: Set<string>;
  deleteMode?: boolean;
  editMode?: boolean;
  onSelectionChange: (selectedIds: Set<string>) => void;
  onPumpEdit?: (pumpId: string) => void;
  loading?: boolean;
  currentPage?: number;
  pageSize?: number;
  totalItems?: number;
  onPageChange?: (page: number) => void;
}

export const PumpsTable: React.FC<PumpsTableProps> = ({
  pumps,
  selectedPumps,
  deleteMode = false,
  editMode = false,
  onSelectionChange,
  onPumpEdit,
  loading = false,
  currentPage = 1,
  pageSize = 10,
  totalItems = 0,
  onPageChange,
}) => {
  // Column configuration with responsive display control
  const columns = [
    { key: 'name', label: 'Pump Name', responsive: 'always' },
    { key: 'type', label: 'Type', responsive: 'md' },
    { key: 'areaBlock', label: 'Area/Block', responsive: 'md' },
    { key: 'latitude', label: 'Latitude', responsive: 'lg' },
    { key: 'longitude', label: 'Longitude', responsive: 'lg' },
    { key: 'flowRate', label: 'Flow Rate', responsive: 'sm' },
    { key: 'offset', label: 'Offset', responsive: 'xl' },
    { key: 'currentPressure', label: 'Current Pressure', responsive: 'sm' },
    { key: 'minPressure', label: 'Min Pressure', responsive: 'lg' },
    { key: 'maxPressure', label: 'Max Pressure', responsive: 'lg' },
  ] as const;

  // Get responsive CSS class names
  const getResponsiveClass = (responsive: string) => {
    switch (responsive) {
      case 'always':
        return '';
      case 'sm':
        return 'd-none d-sm-table-cell';
      case 'md':
        return 'd-none d-md-table-cell';
      case 'lg':
        return 'd-none d-lg-table-cell';
      case 'xl':
        return 'd-none d-xl-table-cell';
      default:
        return '';
    }
  };

  // Format cell values
  const formatValue = (value: unknown) => {
    if (value === null || value === undefined) return '-';

    if (typeof value !== 'object' || value === null) {
      return String(value);
    }

    const obj = value as { value?: number; unit?: string };
    if (obj.value !== undefined && obj.unit !== undefined) {
      return `${obj.value} ${obj.unit}`;
    }

    return String(value);
  };

  // Handle select all checkbox
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = new Set(pumps.map(pump => pump.id));
      onSelectionChange(allIds);
    } else {
      onSelectionChange(new Set());
    }
  };

  // Handle individual row selection
  const handleRowSelect = (pumpId: string, checked: boolean) => {
    const newSelection = new Set(selectedPumps);
    if (checked) {
      newSelection.add(pumpId);
    } else {
      newSelection.delete(pumpId);
    }
    onSelectionChange(newSelection);
  };

  // Handle row click in edit mode
  const handleRowClick = (pumpId: string) => {
    if (editMode && onPumpEdit) {
      onPumpEdit(pumpId);
    }
  };

  // Calculate select all checkbox state
  const isAllSelected = pumps.length > 0 && selectedPumps.size === pumps.length;
  const isIndeterminate =
    selectedPumps.size > 0 && selectedPumps.size < pumps.length;

  // Calculate pagination info
  const totalPages = Math.ceil(totalItems / pageSize);
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  // Generate pagination items
  const getPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let page = startPage; page <= endPage; page++) {
      items.push(
        <Pagination.Item
          key={page}
          active={page === currentPage}
          onClick={() => onPageChange?.(page)}
        >
          {page}
        </Pagination.Item>
      );
    }

    return items;
  };

  return (
    <>
      {/* Mobile Card View - Only visible on small screens */}
      <div className="d-block d-md-none">
        {pumps.length === 0 ? (
          <Row>
            <Col xs={12}>
              <Card className="text-center">
                <Card.Body className="py-5">
                  <Card.Text className="text-muted">No pumps found</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        ) : (
          <Row>
            {pumps.map(pump => (
              <Col xs={12} key={pump.id} className="mb-3">
                <Card
                  className={`${deleteMode && selectedPumps.has(pump.id) ? 'border-primary' : ''} ${editMode ? 'pump-card-clickable' : ''}`}
                  onClick={() => handleRowClick(pump.id)}
                  style={editMode ? { cursor: 'pointer' } : {}}
                >
                  <Card.Body>
                    <div
                      className="d-flex justify-content-between align-items-center mb-2"
                      style={{ minHeight: '24px' }}
                    >
                      <Card.Title className="h6 mb-0">{pump.name}</Card.Title>
                      <div style={{ width: '24px' }}>
                        {deleteMode && (
                          <Form.Check
                            type="checkbox"
                            checked={selectedPumps.has(pump.id)}
                            onChange={e =>
                              handleRowSelect(pump.id, e.target.checked)
                            }
                            disabled={loading}
                            onClick={e => e.stopPropagation()}
                          />
                        )}
                      </div>
                    </div>
                    <Card.Text className="mb-2">
                      <small className="text-muted">
                        <strong>Type:</strong> {pump.type} |{' '}
                        <strong>Area:</strong> {pump.areaBlock}
                      </small>
                    </Card.Text>
                    <Card.Text className="mb-0">
                      <small>
                        <strong>Flow Rate:</strong> {formatValue(pump.flowRate)}{' '}
                        |<strong> Pressure:</strong>{' '}
                        {formatValue(pump.currentPressure)}
                      </small>
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </div>

      {/* Desktop Table View - Hidden on small screens */}
      <Row className="d-none d-md-block">
        <Col xs={12}>
          <div className="table-responsive">
            <Table
              striped
              hover
              className="mb-0"
              style={{ tableLayout: 'fixed' }}
            >
              <thead className="table-dark">
                <tr>
                  {deleteMode && (
                    <th
                      scope="col"
                      className="align-middle"
                      style={{ width: '50px' }}
                    >
                      <Form.Check
                        type="checkbox"
                        checked={isAllSelected}
                        ref={input => {
                          if (input) input.indeterminate = isIndeterminate;
                        }}
                        onChange={e => handleSelectAll(e.target.checked)}
                        disabled={loading || pumps.length === 0}
                        title={isAllSelected ? 'Deselect all' : 'Select all'}
                      />
                    </th>
                  )}
                  {columns.map(column => (
                    <th
                      key={column.key}
                      scope="col"
                      className={`align-middle ${getResponsiveClass(column.responsive)}`}
                    >
                      {column.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pumps.map(pump => (
                  <tr
                    key={pump.id}
                    className={`${deleteMode && selectedPumps.has(pump.id) ? 'table-active' : ''} ${editMode ? 'pump-row-clickable' : ''}`}
                    onClick={() => handleRowClick(pump.id)}
                    style={editMode ? { cursor: 'pointer' } : {}}
                  >
                    {deleteMode && (
                      <td className="align-middle" style={{ width: '50px' }}>
                        <Form.Check
                          type="checkbox"
                          checked={selectedPumps.has(pump.id)}
                          onChange={e =>
                            handleRowSelect(pump.id, e.target.checked)
                          }
                          disabled={loading}
                          onClick={e => e.stopPropagation()}
                        />
                      </td>
                    )}
                    {columns.map(column => (
                      <td
                        key={column.key}
                        className={`align-middle ${getResponsiveClass(column.responsive)}`}
                      >
                        {formatValue(pump[column.key as keyof PumpDevice])}
                      </td>
                    ))}
                  </tr>
                ))}
                {pumps.length === 0 && (
                  <tr>
                    <td
                      colSpan={columns.length + (deleteMode ? 1 : 0)}
                      className="text-center text-muted py-4 align-middle"
                    >
                      No pumps found
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </Col>
      </Row>

      {/* Summary and Pagination */}
      <Row className="mt-3">
        <Col xs={12} md={6}>
          <div className="text-muted">
            {totalItems > 0 ? (
              <>
                Showing {startItem}-{endItem} of {totalItems} pumps
                {deleteMode && selectedPumps.size > 0 && (
                  <span className="ms-2">• {selectedPumps.size} selected</span>
                )}
              </>
            ) : (
              'No pumps found'
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
              {getPaginationItems()}
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
    </>
  );
};

export default PumpsTable;
