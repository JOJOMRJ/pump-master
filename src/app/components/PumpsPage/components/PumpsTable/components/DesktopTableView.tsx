import React from 'react';
import { Row, Col, Table, Form } from 'react-bootstrap';
import type { PumpDevice } from '../../../../../types';
import { AppMode } from '../../../../../types';
import type { FilterState, FilterOptions } from '../../../../../hooks';
import { formatValue, getResponsiveClass } from '../utils';
import { TableHeader } from './TableHeader';

interface DesktopTableViewProps {
  pumps: PumpDevice[];
  selectedPumps: Set<string>;
  mode?: AppMode;
  filterMode?: boolean;
  filterOptions?: FilterOptions;
  filters?: FilterState;
  loading?: boolean;
  columns: readonly { key: string; label: string; responsive: string }[];
  isAllSelected: boolean;
  isIndeterminate: boolean;
  onSelectAll: (checked: boolean) => void;
  onRowSelect: (pumpId: string, checked: boolean) => void;
  onRowClick: (pumpId: string) => void;
  onToggleTypeFilter?: (type: string) => void;
  onToggleAreaFilter?: (area: string) => void;
}

export const DesktopTableView: React.FC<DesktopTableViewProps> = ({
  pumps,
  selectedPumps,
  mode = AppMode.NORMAL,
  filterMode = false,
  filterOptions,
  filters,
  loading = false,
  columns,
  isAllSelected,
  isIndeterminate,
  onSelectAll,
  onRowSelect,
  onRowClick,
  onToggleTypeFilter,
  onToggleAreaFilter,
}) => {
  const deleteMode = mode === AppMode.DELETE;
  const editMode = mode === AppMode.EDIT;
  return (
    <Row className="d-none d-md-block">
      <Col xs={12}>
        <div className="table-responsive">
          <Table
            striped
            hover
            className="mb-0"
            style={{ tableLayout: 'fixed' }}
          >
            <TableHeader
              columns={columns}
              mode={mode}
              filterMode={filterMode}
              filterOptions={filterOptions}
              filters={filters}
              isAllSelected={isAllSelected}
              isIndeterminate={isIndeterminate}
              loading={loading}
              pumpsLength={pumps.length}
              onSelectAll={onSelectAll}
              onToggleTypeFilter={onToggleTypeFilter}
              onToggleAreaFilter={onToggleAreaFilter}
            />
            <tbody>
              {pumps.map(pump => (
                <tr
                  key={pump.id}
                  className={`${deleteMode && selectedPumps.has(pump.id) ? 'table-active' : ''} ${editMode ? 'pump-row-clickable' : ''}`}
                  onClick={() => onRowClick(pump.id)}
                  style={editMode ? { cursor: 'pointer' } : {}}
                >
                  {deleteMode && (
                    <td className="align-middle" style={{ width: '50px' }}>
                      <Form.Check
                        type="checkbox"
                        checked={selectedPumps.has(pump.id)}
                        onChange={e => onRowSelect(pump.id, e.target.checked)}
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
  );
};

export default DesktopTableView;
