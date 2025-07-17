import React from 'react';
import type { PumpDevice } from '../../../../types';
import { AppMode } from '../../../../types';
import type { FilterState, FilterOptions } from '../../../../hooks';
import {
  MobileCardView,
  DesktopTableView,
  PaginationSummary,
} from './components';

interface FilterStateProps {
  mode: boolean;
  options: FilterOptions;
  filters: FilterState;
  onToggleType: (type: string) => void;
  onToggleArea: (area: string) => void;
}

interface PaginationStateProps {
  currentPage: number;
  pageSize: number;
  total: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
}

interface PumpsTableProps {
  pumps: PumpDevice[];
  selectedPumps: Set<string>;
  mode: AppMode;
  loading?: boolean;
  filterState: FilterStateProps;
  paginationState: PaginationStateProps;
  onSelectionChange: (selectedIds: Set<string>) => void;
  onPumpEdit?: (pumpId: string) => void;
}

export const PumpsTable: React.FC<PumpsTableProps> = ({
  pumps,
  selectedPumps,
  mode,
  loading = false,
  filterState,
  paginationState,
  onSelectionChange,
  onPumpEdit,
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
    if (mode === AppMode.EDIT && onPumpEdit) {
      onPumpEdit(pumpId);
    }
  };

  // Calculate select all checkbox state
  const isAllSelected = pumps.length > 0 && selectedPumps.size === pumps.length;
  const isIndeterminate =
    selectedPumps.size > 0 && selectedPumps.size < pumps.length;

  return (
    <>
      {/* Mobile Card View - Only visible on small screens */}
      <div className="d-block d-md-none">
        <MobileCardView
          pumps={pumps}
          selectedPumps={selectedPumps}
          mode={mode}
          loading={loading}
          onRowSelect={handleRowSelect}
          onRowClick={handleRowClick}
        />
      </div>

      {/* Desktop Table View - Hidden on small screens */}
      <DesktopTableView
        pumps={pumps}
        selectedPumps={selectedPumps}
        mode={mode}
        filterMode={filterState.mode}
        filterOptions={filterState.options}
        filters={filterState.filters}
        loading={loading}
        columns={columns}
        isAllSelected={isAllSelected}
        isIndeterminate={isIndeterminate}
        onSelectAll={handleSelectAll}
        onRowSelect={handleRowSelect}
        onRowClick={handleRowClick}
        onToggleTypeFilter={filterState.onToggleType}
        onToggleAreaFilter={filterState.onToggleArea}
      />

      {/* Summary and Pagination */}
      <PaginationSummary
        currentPage={paginationState.currentPage}
        pageSize={paginationState.pageSize}
        total={paginationState.total}
        totalPages={paginationState.totalPages}
        selectedCount={selectedPumps.size}
        mode={mode}
        onPageChange={paginationState.onPageChange}
        onPageSizeChange={paginationState.onPageSizeChange}
      />
    </>
  );
};

export default PumpsTable;
