import React from 'react';
import { Form } from 'react-bootstrap';
import { AppMode } from '../../../../../../types';
import type { FilterState, FilterOptions } from '../../../../../../hooks';
import { getResponsiveClass } from '../../utils';
import { FilterDropdown } from '../FilterDropdown';

interface TableHeaderProps {
  columns: readonly { key: string; label: string; responsive: string }[];
  mode?: AppMode;
  filterMode?: boolean;
  filterOptions?: FilterOptions;
  filters?: FilterState;
  isAllSelected: boolean;
  isIndeterminate: boolean;
  loading?: boolean;
  pumpsLength: number;
  onSelectAll: (checked: boolean) => void;
  onToggleTypeFilter?: (type: string) => void;
  onToggleAreaFilter?: (area: string) => void;
}

export const TableHeader: React.FC<TableHeaderProps> = ({
  columns,
  mode = AppMode.NORMAL,
  filterMode = false,
  filterOptions,
  filters,
  isAllSelected,
  isIndeterminate,
  loading = false,
  pumpsLength,
  onSelectAll,
  onToggleTypeFilter,
  onToggleAreaFilter,
}) => {
  const deleteMode = mode === AppMode.DELETE;
  return (
    <thead className="table-dark">
      <tr>
        {deleteMode && (
          <th scope="col" className="align-middle" style={{ width: '50px' }}>
            <Form.Check
              type="checkbox"
              checked={isAllSelected}
              ref={input => {
                if (input) input.indeterminate = isIndeterminate;
              }}
              onChange={e => onSelectAll(e.target.checked)}
              disabled={loading || pumpsLength === 0}
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
            <div className="d-flex align-items-center justify-content-between">
              <span>{column.label}</span>
              {filterMode && column.key === 'type' && (
                <FilterDropdown
                  filterType="type"
                  options={filterOptions?.types || []}
                  selectedValues={filters?.types || new Set()}
                  onToggle={onToggleTypeFilter || (() => {})}
                />
              )}
              {filterMode && column.key === 'areaBlock' && (
                <FilterDropdown
                  filterType="areaBlock"
                  options={filterOptions?.areas || []}
                  selectedValues={filters?.areas || new Set()}
                  onToggle={onToggleAreaFilter || (() => {})}
                />
              )}
            </div>
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default TableHeader;
