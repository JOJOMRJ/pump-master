import React from 'react';
import type { PumpDevice } from '../../../../types';
import { AppMode } from '../../../../types';
import type { UseFilterReturn } from '../../../../hooks';
import {
  MobileCardView,
  DesktopTableView,
  PaginationSummary,
} from './components';

import type { UsePaginationReturn } from '../../../../hooks';

interface PumpsTableProps {
  pumps: PumpDevice[];
  selectedPumps: Set<string>;
  mode: AppMode;
  loading?: boolean;
  filter: UseFilterReturn;
  pagination: UsePaginationReturn;
  onSelectionChange: (selectedIds: Set<string>) => void;
  onPumpEdit?: (pumpId: string) => void;
}

export const PumpsTable: React.FC<PumpsTableProps> = ({
  pumps,
  selectedPumps,
  mode,
  loading = false,
  filter,
  pagination,
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
        filterMode={filter.filterMode}
        filterOptions={filter.filterOptions}
        filters={filter.filters}
        loading={loading}
        columns={columns}
        isAllSelected={isAllSelected}
        isIndeterminate={isIndeterminate}
        onSelectAll={handleSelectAll}
        onRowSelect={handleRowSelect}
        onRowClick={handleRowClick}
        onToggleTypeFilter={filter.toggleTypeFilter}
        onToggleAreaFilter={filter.toggleAreaFilter}
      />

      {/* Summary and Pagination */}
      <PaginationSummary
        currentPage={pagination.currentPage}
        pageSize={pagination.pageSize}
        total={pagination.total}
        totalPages={pagination.totalPages}
        selectedCount={selectedPumps.size}
        mode={mode}
        onPageChange={pagination.handlePageChange}
        onPageSizeChange={pagination.handlePageSizeChange}
      />
    </>
  );
};

export default PumpsTable;
