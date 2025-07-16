import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import type { PumpDevice } from '../../types';
import { mockPumpService } from '../../services/mockPumpService';
import { usePagination, useFilter } from '../../hooks';
import { Loading } from '../../../shared/components';
import {
  PageHeader,
  PumpsToolbar,
  PumpsTable,
  SearchModal,
} from './components';

export const PumpsPage: React.FC = () => {
  const [pumps, setPumps] = useState<PumpDevice[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPumps, setSelectedPumps] = useState<Set<string>>(new Set());

  // Pagination management
  const pagination = usePagination(10);

  // Filter management
  const filter = useFilter(pumps, {
    types: pump => pump.type,
    areas: pump => pump.areaBlock,
  });
  const [deleteMode, setDeleteMode] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchPumps = async () => {
      try {
        setLoading(true);
        const response = await mockPumpService.getPumps({
          page: pagination.currentPage,
          pageSize: pagination.pageSize,
          searchQuery: searchQuery.trim() || undefined,
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
    searchQuery,
    filter.filters.types,
    filter.filters.areas,
  ]);

  // Event handlers
  const handleNewPump = () => {
    console.log('New Pump clicked');
  };

  const handleSearch = () => {
    setShowSearchModal(true);
  };

  const handleSearchSubmit = (query: string) => {
    setSearchQuery(query);
    setShowSearchModal(false);
    pagination.handlePageChange(1); // Reset to first page when searching
  };

  const handleSearchCancel = () => {
    setShowSearchModal(false);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    pagination.handlePageChange(1);
  };

  const handleFilter = () => {
    filter.toggleFilterMode();
  };

  const handleEnterEditMode = () => {
    setEditMode(true);
    setDeleteMode(false); // Exit delete mode if active
  };

  const handleExitEditMode = () => {
    setEditMode(false);
  };

  const handleEnterDeleteMode = () => {
    setDeleteMode(true);
    setEditMode(false); // Exit edit mode if active
    setSelectedPumps(new Set()); // Clear any existing selections
  };

  const handleExitDeleteMode = () => {
    setDeleteMode(false);
    setSelectedPumps(new Set()); // Clear selections when exiting
  };

  const handleDelete = async () => {
    if (selectedPumps.size === 0) return;

    try {
      const selectedIds = Array.from(selectedPumps);
      const response = await mockPumpService.deletePumps(selectedIds);

      if (!response.success || !response.data) {
        console.error('Failed to delete pumps:', response.error?.message);
        return;
      }

      // Clear selection and exit delete mode
      setSelectedPumps(new Set());
      setDeleteMode(false);

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
    setSelectedPumps(selectedIds);
  };

  const handlePumpEdit = (pumpId: string) => {
    console.log('Edit pump:', pumpId);
    // TODO: 触发编辑弹窗逻辑
  };

  const handlePageChange = (page: number) => {
    pagination.handlePageChange(page);
    // Clear current page selection state
    setSelectedPumps(new Set());
  };

  const handlePageSizeChange = (newPageSize: number) => {
    pagination.handlePageSizeChange(newPageSize);
    setSelectedPumps(new Set()); // Clear selections
  };

  // Server-side pagination - no need to slice data
  const currentPagePumps = pumps;

  if (loading) {
    return <Loading />;
  }

  // State object aggregation
  const uiState = { deleteMode, editMode, loading };
  const searchState = {
    searchQuery,
    onSearch: handleSearch,
    onClearSearch: handleClearSearch,
  };

  return (
    <Container>
      {/* Page Header */}
      <PageHeader title="Pumps" onNewPump={handleNewPump} />

      {/* Toolbar */}
      <PumpsToolbar
        selectedCount={selectedPumps.size}
        uiState={uiState}
        searchState={searchState}
        filterMode={filter.filterMode}
        hasActiveFilters={filter.hasActiveFilters}
        activeFilterCount={filter.activeFilterCount}
        onFilter={handleFilter}
        onDelete={handleDelete}
        onEnterDeleteMode={handleEnterDeleteMode}
        onExitDeleteMode={handleExitDeleteMode}
        onEnterEditMode={handleEnterEditMode}
        onExitEditMode={handleExitEditMode}
        onClearFilters={filter.clearFilters}
      />

      {/* Pumps Table */}
      <PumpsTable
        pumps={currentPagePumps}
        selectedPumps={selectedPumps}
        uiState={uiState}
        filterMode={filter.filterMode}
        filterOptions={filter.filterOptions}
        filters={filter.filters}
        onSelectionChange={handleSelectionChange}
        onPumpEdit={handlePumpEdit}
        onToggleTypeFilter={filter.toggleTypeFilter}
        onToggleAreaFilter={filter.toggleAreaFilter}
        currentPage={pagination.currentPage}
        pageSize={pagination.pageSize}
        total={pagination.total}
        totalPages={pagination.totalPages}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />

      {/* Search Modal */}
      <SearchModal
        show={showSearchModal}
        currentQuery={searchQuery}
        onSubmit={handleSearchSubmit}
        onCancel={handleSearchCancel}
      />
    </Container>
  );
};

export default PumpsPage;
