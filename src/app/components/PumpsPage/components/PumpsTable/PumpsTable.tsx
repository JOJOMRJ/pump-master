import React from 'react';
import type { PumpDevice } from '../../../../types';
import type { FilterState, FilterOptions } from '../../../../hooks';
import {
  MobileCardView,
  DesktopTableView,
  PaginationSummary,
} from './components';

interface UIState {
  deleteMode: boolean;
  editMode: boolean;
  loading: boolean;
}

interface PumpsTableProps {
  pumps: PumpDevice[];
  selectedPumps: Set<string>;
  uiState: UIState;
  filterMode?: boolean;
  filterOptions?: FilterOptions;
  filters?: FilterState;
  onSelectionChange: (selectedIds: Set<string>) => void;
  onPumpEdit?: (pumpId: string) => void;
  onToggleTypeFilter?: (type: string) => void;
  onToggleAreaFilter?: (area: string) => void;
  currentPage: number;
  pageSize: number;
  total: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
}

export const PumpsTable: React.FC<PumpsTableProps> = ({
  pumps,
  selectedPumps,
  uiState,
  filterMode = false,
  filterOptions,
  filters,
  onSelectionChange,
  onPumpEdit,
  onToggleTypeFilter,
  onToggleAreaFilter,
  currentPage,
  pageSize,
  total,
  totalPages,
  onPageChange,
  onPageSizeChange,
}) => {
  const { deleteMode, editMode, loading } = uiState;
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
    if (editMode && onPumpEdit) {
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
          deleteMode={deleteMode}
          editMode={editMode}
          loading={loading}
          onRowSelect={handleRowSelect}
          onRowClick={handleRowClick}
        />
      </div>

      {/* Desktop Table View - Hidden on small screens */}
      <DesktopTableView
        pumps={pumps}
        selectedPumps={selectedPumps}
        deleteMode={deleteMode}
        editMode={editMode}
        filterMode={filterMode}
        filterOptions={filterOptions}
        filters={filters}
        loading={loading}
        columns={columns}
        isAllSelected={isAllSelected}
        isIndeterminate={isIndeterminate}
        onSelectAll={handleSelectAll}
        onRowSelect={handleRowSelect}
        onRowClick={handleRowClick}
        onToggleTypeFilter={onToggleTypeFilter}
        onToggleAreaFilter={onToggleAreaFilter}
      />

      {/* Summary and Pagination */}
      <PaginationSummary
        currentPage={currentPage}
        pageSize={pageSize}
        total={total}
        totalPages={totalPages}
        selectedCount={selectedPumps.size}
        deleteMode={deleteMode}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />
    </>
  );
};

export default PumpsTable;
