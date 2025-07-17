import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import type { PumpDevice } from '../../types';
import { AppMode } from '../../types';
import { mockPumpService } from '../../services/mockPumpService';
import { usePagination, useFilter, useSearch } from '../../hooks';
import { Loading } from '../../../shared/components';
import { useSelection } from '../../hooks';
import {
  PageHeader,
  PumpsToolbar,
  PumpsTable,
  SearchModal,
} from './components';

export const PumpsPage: React.FC = () => {
  const [pumps, setPumps] = useState<PumpDevice[]>([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<AppMode>(AppMode.NORMAL);

  // Pagination management
  const pagination = usePagination(
    10,
    () => selection.clearSelection(), // Clear selections on page change
    () => selection.clearSelection() // Clear selections on page size change
  );

  // Filter management
  const filter = useFilter(
    pumps,
    {
      types: pump => pump.type,
      areas: pump => pump.areaBlock,
    },
    async () => {
      const response = await mockPumpService.getFilterOptions();
      return response.success && response.data
        ? response.data
        : { types: [], areas: [] };
    }
  );

  // Selection management
  const selection = useSelection<PumpDevice>({
    keyExtractor: (pump: PumpDevice) => pump.id,
  });

  // Search management
  const search = useSearch();

  useEffect(() => {
    const fetchPumps = async () => {
      try {
        setLoading(true);
        const response = await mockPumpService.getPumps({
          page: pagination.currentPage,
          pageSize: pagination.pageSize,
          searchQuery: search.searchQuery.trim() || undefined,
          filters: filter.getFilterParams(),
        });

        if (!response.success || !response.data) {
          console.error('Failed to load pumps:', response.error);
          setPumps([]);
          pagination.setTotal(0);
          pagination.setTotalPages(0);
          return;
        }

        setPumps(response.data.data);
        pagination.setTotal(response.data.pagination.total);
        pagination.setTotalPages(response.data.pagination.totalPages);
      } catch (err) {
        console.error('Error fetching pumps:', err);
        setPumps([]);
        pagination.setTotal(0);
        pagination.setTotalPages(0);
      } finally {
        setLoading(false);
      }
    };

    fetchPumps();
  }, [
    pagination.currentPage,
    pagination.pageSize,
    search.searchQuery,
    filter.filters.types,
    filter.filters.areas,
  ]);

  // Event handlers
  const handleNewPump = () => {
    console.log('New Pump clicked');
  };

  const handleModeChange = (newMode: AppMode) => {
    if (newMode === AppMode.DELETE) {
      selection.clearSelection(); // Clear selections when entering delete mode
    }
    if (mode === AppMode.DELETE && newMode !== AppMode.DELETE) {
      selection.clearSelection(); // Clear selections when exiting delete mode
    }
    setMode(newMode);
  };

  const handleDelete = async () => {
    if (selection.selectedCount === 0) return;

    try {
      const selectedIds = Array.from(selection.selectedItems);
      const response = await mockPumpService.deletePumps(selectedIds);

      if (!response.success || !response.data) {
        console.error('Failed to delete pumps:', response.error?.message);
        return;
      }

      // Clear selection and exit delete mode
      selection.clearSelection();
      setMode(AppMode.NORMAL);

      // Calculate if we need to adjust current page
      const deletedCount = response.data.length;
      const remainingItems = pagination.total - deletedCount;
      const newTotalPages = Math.ceil(remainingItems / pagination.pageSize);

      // If current page becomes empty, go to previous page or first page
      if (pagination.currentPage > newTotalPages && newTotalPages > 0) {
        pagination.handlePageChange(newTotalPages);
      } else {
        // Refresh current page data by triggering useEffect
        // This will happen automatically due to the state dependencies
      }

      console.log(`Successfully deleted ${response.data.length} pump(s)`);
    } catch (err) {
      console.error('Error deleting pumps:', err);
    }
  };

  const handleSelectionChange = (selectedIds: Set<string>) => {
    selection.setSelectedItems(selectedIds);
  };

  const handlePumpEdit = (pumpId: string) => {
    console.log('Edit pump:', pumpId);
    // TODO: 触发编辑弹窗逻辑
  };

  // Server-side pagination - no need to slice data
  const currentPagePumps = pumps;

  if (loading) {
    return <Loading />;
  }

  return (
    <Container>
      {/* Page Header */}
      <PageHeader title="Pumps" onNewPump={handleNewPump} />

      {/* Toolbar */}
      <PumpsToolbar
        selectedCount={selection.selectedCount}
        mode={mode}
        loading={loading}
        search={search}
        filterMode={filter.filterMode}
        hasActiveFilters={filter.hasActiveFilters}
        activeFilterCount={filter.activeFilterCount}
        onFilter={filter.toggleFilterMode}
        onDelete={handleDelete}
        onModeChange={handleModeChange}
        onClearFilters={filter.clearFilters}
      />

      {/* Pumps Table */}
      <PumpsTable
        pumps={currentPagePumps}
        selectedPumps={selection.selectedItems}
        mode={mode}
        loading={loading}
        filter={filter}
        pagination={pagination}
        onSelectionChange={handleSelectionChange}
        onPumpEdit={handlePumpEdit}
      />

      {/* Search Modal */}
      <SearchModal
        show={search.showSearchModal}
        currentQuery={search.searchQuery}
        onSubmit={query =>
          search.handleSearchSubmit(query, pagination.handlePageChange)
        }
        onCancel={search.handleSearchCancel}
      />
    </Container>
  );
};

export default PumpsPage;
