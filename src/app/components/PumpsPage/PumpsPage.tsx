import React, { useState, useEffect } from 'react';
import { Container, Modal, Button, Alert } from 'react-bootstrap';
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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string>('');

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

  const handleDelete = () => {
    if (selectedPumps.size === 0) return;
    setDeleteError('');
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      setDeleting(true);
      setDeleteError('');

      const selectedIds = Array.from(selectedPumps);
      const response = await mockPumpService.deletePumps(selectedIds);

      if (!response.success || !response.data) {
        setDeleteError(response.error?.message || 'Failed to delete pumps');
        return;
      }

      // Refresh pump list
      const pumpsResponse = await mockPumpService.getPumps();
      if (pumpsResponse.success && pumpsResponse.data) {
        setPumps(pumpsResponse.data);
      }

      // Clear selection and close modal
      setSelectedPumps(new Set());
      setShowDeleteModal(false);

      // Reset to first page if current page is empty
      const totalPages = Math.ceil(pumpsResponse.data?.length || 0 / pageSize);
      if (currentPage > totalPages && totalPages > 0) {
        setCurrentPage(1);
      }

      console.log(`Successfully deleted ${response.data.length} pump(s)`);
    } catch (err) {
      console.error('Error deleting pumps:', err);
      setDeleteError('An unexpected error occurred while deleting pumps');
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setDeleteError('');
  };

  const handleSelectionChange = (selectedIds: Set<string>) => {
    setSelectedPumps(selectedIds);
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
        onSearch={handleSearch}
        onFilter={handleFilter}
        onEdit={handleEdit}
        onDelete={handleDelete}
        disabled={loading}
      />

      {/* Pumps Table */}
      <PumpsTable
        pumps={currentPagePumps}
        selectedPumps={selectedPumps}
        onSelectionChange={handleSelectionChange}
        loading={loading}
        currentPage={currentPage}
        pageSize={pageSize}
        totalItems={totalItems}
        onPageChange={handlePageChange}
      />

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={handleDeleteCancel}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {deleteError && (
            <Alert variant="danger" className="mb-3">
              {deleteError}
            </Alert>
          )}
          <p>
            Are you sure you want to delete {selectedPumps.size} selected
            pump(s)?
          </p>
          <p className="text-muted">
            <small>This action cannot be undone.</small>
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={handleDeleteCancel}
            disabled={deleting}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleDeleteConfirm}
            disabled={deleting}
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default PumpsPage;
