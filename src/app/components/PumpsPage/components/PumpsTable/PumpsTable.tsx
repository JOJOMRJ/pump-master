import React from 'react';
import { Table, Form, Row, Col, Pagination } from 'react-bootstrap';
import type { PumpDevice } from '../../../../types/PumpDevice';

interface PumpsTableProps {
  pumps: PumpDevice[];
  selectedPumps: Set<string>;
  onSelectionChange: (selectedIds: Set<string>) => void;
  loading?: boolean;
  currentPage?: number;
  pageSize?: number;
  totalItems?: number;
  onPageChange?: (page: number) => void;
}

export const PumpsTable: React.FC<PumpsTableProps> = ({
  pumps,
  selectedPumps,
  onSelectionChange,
  loading = false,
  currentPage = 1,
  pageSize = 10,
  totalItems = 0,
  onPageChange,
}) => {
  // 写死的列配置
  const columns = [
    { key: 'name', label: 'Pump Name' },
    { key: 'type', label: 'Type' },
    { key: 'areaBlock', label: 'Area/Block' },
    { key: 'latitude', label: 'Latitude' },
    { key: 'longitude', label: 'Longitude' },
    { key: 'flowRate', label: 'Flow Rate' },
    { key: 'offset', label: 'Offset' },
    { key: 'currentPressure', label: 'Current Pressure' },
    { key: 'minPressure', label: 'Min Pressure' },
    { key: 'maxPressure', label: 'Max Pressure' },
  ];

  // 格式化单元格值
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
      {/* Pumps Table */}
      <Row>
        <Col xs={12}>
          <Table striped hover responsive>
            <thead className="table-dark">
              <tr>
                <th scope="col">
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
                {columns.map(column => (
                  <th key={column.key} scope="col">
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pumps.map(pump => (
                <tr
                  key={pump.id}
                  className={selectedPumps.has(pump.id) ? 'table-active' : ''}
                >
                  <td>
                    <Form.Check
                      type="checkbox"
                      checked={selectedPumps.has(pump.id)}
                      onChange={e => handleRowSelect(pump.id, e.target.checked)}
                      disabled={loading}
                    />
                  </td>
                  {columns.map(column => (
                    <td key={column.key}>
                      {formatValue(pump[column.key as keyof PumpDevice])}
                    </td>
                  ))}
                </tr>
              ))}
              {pumps.length === 0 && (
                <tr>
                  <td
                    colSpan={columns.length + 1}
                    className="text-center text-muted py-4"
                  >
                    No pumps found
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Col>
      </Row>

      {/* Summary and Pagination */}
      <Row className="mt-3">
        <Col xs={12} md={6}>
          <div className="text-muted">
            {totalItems > 0 ? (
              <>
                Showing {startItem}-{endItem} of {totalItems} pumps
                {selectedPumps.size > 0 && (
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
