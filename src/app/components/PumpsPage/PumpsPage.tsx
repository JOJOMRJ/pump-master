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
    console.log('Delete clicked, selected:', selectedPumps.size);
    // TODO: Implement actual deletion logic
    setSelectedPumps(new Set()); // Clear selection after delete
  };

  const handleSelectionChange = (selectedIds: Set<string>) => {
    setSelectedPumps(selectedIds);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // 清除当前页的选择状态
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
    </Container>
  );
};

export default PumpsPage;
