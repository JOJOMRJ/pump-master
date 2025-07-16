import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import type { PumpDevice, PaginationMeta } from '../../types';
import { mockPumpService } from '../../services/mockPumpService';
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
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
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
          page: currentPage,
          pageSize,
          searchQuery: searchQuery.trim() || undefined,
        });

        if (!response.success || !response.data) {
          console.error('Failed to load pumps:', response.error);
          setPumps([]);
          setPagination({
            page: currentPage,
            pageSize,
            total: 0,
            totalPages: 0,
          });
          return;
        }

        setPumps(response.data.data);
        setPagination(response.data.pagination);
      } catch (err) {
        console.error('Error fetching pumps:', err);
        setPumps([]);
        setPagination({
          page: currentPage,
          pageSize,
          total: 0,
          totalPages: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPumps();
  }, [currentPage, pageSize, searchQuery]);

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
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleSearchCancel = () => {
    setShowSearchModal(false);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setCurrentPage(1);
  };

  const handleFilter = () => {
    console.log('Filter clicked');
  };

  const handleEdit = () => {
    console.log('Edit clicked, selected:', selectedPumps.size);
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
      const newTotalPages = Math.ceil(remainingItems / pageSize);

      // If current page becomes empty, go to previous page or first page
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages);
      } else {
        // Refresh current page data by triggering useEffect
        // This will happen automatically due to the pagination dependency
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
    setCurrentPage(page);
    // Clear current page selection state
    setSelectedPumps(new Set());
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
        selectedCount={selectedPumps.size}
        deleteMode={deleteMode}
        editMode={editMode}
        searchQuery={searchQuery}
        onSearch={handleSearch}
        onFilter={handleFilter}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onEnterDeleteMode={handleEnterDeleteMode}
        onExitDeleteMode={handleExitDeleteMode}
        onEnterEditMode={handleEnterEditMode}
        onExitEditMode={handleExitEditMode}
        onClearSearch={handleClearSearch}
        disabled={loading}
      />

      {/* Pumps Table */}
      <PumpsTable
        pumps={currentPagePumps}
        selectedPumps={selectedPumps}
        deleteMode={deleteMode}
        editMode={editMode}
        onSelectionChange={handleSelectionChange}
        onPumpEdit={handlePumpEdit}
        loading={loading}
        pagination={pagination}
        onPageChange={handlePageChange}
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
