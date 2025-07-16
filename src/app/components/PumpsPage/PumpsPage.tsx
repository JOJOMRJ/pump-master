import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import type { PumpDevice } from '../../types/PumpDevice';
import { mockPumpService } from '../../services/mockPumpService';
import { Loading } from '../../../shared/components';
import { PageHeader, PumpsToolbar, PumpsTable } from './components';

export const PumpsPage: React.FC = () => {
  const [pumps, setPumps] = useState<PumpDevice[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPumps, setSelectedPumps] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [deleteMode, setDeleteMode] = useState(false);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const fetchPumps = async () => {
      try {
        setLoading(true);
        const response = await mockPumpService.getPumps();

        if (!response.success || !response.data) {
          console.error('Failed to load pumps:', response.error);
          setPumps([]);
          return;
        }

        setPumps(response.data);
      } catch (err) {
        console.error('Error fetching pumps:', err);
        setPumps([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPumps();
  }, []);

  // Event handlers
  const handleNewPump = () => {
    console.log('New Pump clicked');
  };

  const handleSearch = () => {
    console.log('Search clicked');
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

      // Refresh pump list
      const pumpsResponse = await mockPumpService.getPumps();
      if (pumpsResponse.success && pumpsResponse.data) {
        setPumps(pumpsResponse.data);
      }

      // Clear selection and exit delete mode
      setSelectedPumps(new Set());
      setDeleteMode(false);

      // Reset to first page if current page is empty
      const totalPages = Math.ceil(pumpsResponse.data?.length || 0 / pageSize);
      if (currentPage > totalPages && totalPages > 0) {
        setCurrentPage(1);
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

  // Calculate pagination info
  const totalItems = pumps.length;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentPagePumps = pumps.slice(startIndex, endIndex);

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
        onSearch={handleSearch}
        onFilter={handleFilter}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onEnterDeleteMode={handleEnterDeleteMode}
        onExitDeleteMode={handleExitDeleteMode}
        onEnterEditMode={handleEnterEditMode}
        onExitEditMode={handleExitEditMode}
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
        currentPage={currentPage}
        pageSize={pageSize}
        totalItems={totalItems}
        onPageChange={handlePageChange}
      />
    </Container>
  );
};

export default PumpsPage;
