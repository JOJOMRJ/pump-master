import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { PumpsPage } from './PumpsPage';
import { mockPumpService } from '../../services/mockPumpService';

// Mock the pump service
vi.mock('../../services/mockPumpService', () => ({
  mockPumpService: {
    getPumps: vi.fn(),
    deletePumps: vi.fn(),
  },
}));

const mockGetPumps = mockPumpService.getPumps as ReturnType<typeof vi.fn>;
const mockDeletePumps = mockPumpService.deletePumps as ReturnType<typeof vi.fn>;

describe('PumpsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render loading state initially', () => {
    mockGetPumps.mockImplementation(() => new Promise(() => {})); // Never resolves

    render(<PumpsPage />);

    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('should render pumps table when data is loaded', async () => {
    const mockPumps = [
      {
        id: 'pump-001',
        name: 'Pump 1',
        type: 'Centrifugal',
        areaBlock: 'Area A',
        latitude: 34.0522,
        longitude: -118.2437,
        flowRate: { value: 1000, unit: 'GPM' as const },
        offset: { value: 5, unit: 'sec' as const },
        currentPressure: { value: 150, unit: 'psi' as const },
        minPressure: { value: 120, unit: 'psi' as const },
        maxPressure: { value: 180, unit: 'psi' as const },
      },
    ];

    mockGetPumps.mockResolvedValue({
      success: true,
      data: mockPumps,
    });

    render(<PumpsPage />);

    await waitFor(() => {
      expect(screen.getByText('Pumps')).toBeInTheDocument();
      // Check that pump data is displayed (may appear once or twice due to responsive design)
      expect(screen.getAllByText('Pump 1').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('Centrifugal').length).toBeGreaterThanOrEqual(
        1
      );
      expect(screen.getAllByText('Area A').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('1000 GPM').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('150 psi').length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText('5 sec')).toBeInTheDocument(); // Only in desktop table
    });
  });

  it('should handle service failure gracefully', async () => {
    mockGetPumps.mockResolvedValue({
      success: false,
      error: {
        code: 'FETCH_ERROR',
        message: 'Failed to fetch pumps',
      },
    });

    render(<PumpsPage />);

    await waitFor(() => {
      expect(screen.getByText('Pumps')).toBeInTheDocument();
      expect(screen.getAllByText('No pumps found')).toHaveLength(3);
    });
  });

  it('should render page header and toolbar', async () => {
    mockGetPumps.mockResolvedValue({
      success: true,
      data: [],
    });

    render(<PumpsPage />);

    await waitFor(() => {
      expect(screen.getByText('Pumps')).toBeInTheDocument();
      expect(screen.getByText('New Pump')).toBeInTheDocument();
      expect(screen.getByText('Delete')).toBeInTheDocument();
      // Check that toolbar buttons exist (they use icons, not text)
      expect(screen.getAllByRole('button')).toHaveLength(5); // New Pump + 3 icon buttons + Delete
    });
  });

  it('should render table headers', async () => {
    mockGetPumps.mockResolvedValue({
      success: true,
      data: [],
    });

    render(<PumpsPage />);

    await waitFor(() => {
      expect(screen.getByText('Pump Name')).toBeInTheDocument();
      expect(screen.getByText('Type')).toBeInTheDocument();
      expect(screen.getByText('Area/Block')).toBeInTheDocument();
      expect(screen.getByText('Latitude')).toBeInTheDocument();
      expect(screen.getByText('Longitude')).toBeInTheDocument();
      expect(screen.getByText('Flow Rate')).toBeInTheDocument();
      expect(screen.getByText('Offset')).toBeInTheDocument();
      expect(screen.getByText('Current Pressure')).toBeInTheDocument();
      expect(screen.getByText('Min Pressure')).toBeInTheDocument();
      expect(screen.getByText('Max Pressure')).toBeInTheDocument();
    });
  });

  it('should display pump count', async () => {
    const mockPumps = [
      {
        id: 'pump-001',
        name: 'Pump 1',
        type: 'Centrifugal',
        areaBlock: 'Area A',
        latitude: 34.0522,
        longitude: -118.2437,
        flowRate: { value: 1000, unit: 'GPM' as const },
        offset: { value: 5, unit: 'sec' as const },
        currentPressure: { value: 150, unit: 'psi' as const },
        minPressure: { value: 120, unit: 'psi' as const },
        maxPressure: { value: 180, unit: 'psi' as const },
      },
      {
        id: 'pump-002',
        name: 'Pump 2',
        type: 'Submersible',
        areaBlock: 'Area B',
        latitude: 34.0525,
        longitude: -118.244,
        flowRate: { value: 800, unit: 'GPM' as const },
        offset: { value: 3, unit: 'ft' as const },
        currentPressure: { value: 130, unit: 'psi' as const },
        minPressure: { value: 100, unit: 'psi' as const },
        maxPressure: { value: 160, unit: 'psi' as const },
      },
    ];

    mockGetPumps.mockResolvedValue({
      success: true,
      data: mockPumps,
    });

    render(<PumpsPage />);

    await waitFor(() => {
      expect(screen.getByText('Showing 1-2 of 2 pumps')).toBeInTheDocument();
    });
  });

  describe('Delete functionality', () => {
    const mockPumps = [
      {
        id: 'pump-001',
        name: 'Pump 1',
        type: 'Centrifugal',
        areaBlock: 'Area A',
        latitude: 34.0522,
        longitude: -118.2437,
        flowRate: { value: 1000, unit: 'GPM' as const },
        offset: { value: 5, unit: 'sec' as const },
        currentPressure: { value: 150, unit: 'psi' as const },
        minPressure: { value: 120, unit: 'psi' as const },
        maxPressure: { value: 180, unit: 'psi' as const },
      },
      {
        id: 'pump-002',
        name: 'Pump 2',
        type: 'Submersible',
        areaBlock: 'Area B',
        latitude: 34.0525,
        longitude: -118.244,
        flowRate: { value: 800, unit: 'GPM' as const },
        offset: { value: 3, unit: 'sec' as const },
        currentPressure: { value: 130, unit: 'psi' as const },
        minPressure: { value: 100, unit: 'psi' as const },
        maxPressure: { value: 160, unit: 'psi' as const },
      },
    ];

    beforeEach(() => {
      mockGetPumps.mockResolvedValue({
        success: true,
        data: mockPumps,
      });
    });

    it('should show delete confirmation modal when delete button is clicked', async () => {
      render(<PumpsPage />);

      await waitFor(() => {
        expect(screen.getAllByText('Pump 1').length).toBeGreaterThanOrEqual(1);
      });

      // Select a pump
      const checkboxes = screen.getAllByRole('checkbox');
      fireEvent.click(checkboxes[1]); // First pump checkbox (index 0 is select all)

      // Click delete button
      const deleteButton = screen.getByRole('button', { name: /delete/i });
      fireEvent.click(deleteButton);

      // Check if modal appears
      await waitFor(() => {
        expect(screen.getByText('Confirm Delete')).toBeInTheDocument();
        expect(
          screen.getByText(/Are you sure you want to delete 1 selected pump/)
        ).toBeInTheDocument();
      });
    });

    it('should close modal when cancel is clicked', async () => {
      render(<PumpsPage />);

      await waitFor(() => {
        expect(screen.getAllByText('Pump 1').length).toBeGreaterThanOrEqual(1);
      });

      // Select a pump and open delete modal
      const checkboxes = screen.getAllByRole('checkbox');
      fireEvent.click(checkboxes[1]);
      const deleteButton = screen.getByRole('button', { name: /delete/i });
      fireEvent.click(deleteButton);

      // Wait for modal to appear
      await waitFor(() => {
        expect(screen.getByText('Confirm Delete')).toBeInTheDocument();
      });

      // Click cancel
      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      fireEvent.click(cancelButton);

      // Check if modal is closed
      await waitFor(() => {
        expect(screen.queryByText('Confirm Delete')).not.toBeInTheDocument();
      });
    });

    it('should delete pumps successfully', async () => {
      mockDeletePumps.mockResolvedValue({
        success: true,
        data: ['pump-002'],
      });

      // Mock updated pump list after deletion
      mockGetPumps
        .mockResolvedValueOnce({
          success: true,
          data: mockPumps,
        })
        .mockResolvedValueOnce({
          success: true,
          data: [mockPumps[0]], // Only first pump remains
        });

      render(<PumpsPage />);

      await waitFor(() => {
        expect(screen.getAllByText('Pump 1').length).toBeGreaterThanOrEqual(1);
      });

      // Select a pump and delete - find the specific pump checkbox
      const checkboxes = screen.getAllByRole('checkbox');
      // In responsive design, we need to find the right checkbox
      // The first checkbox after "select all" that corresponds to pump-002
      fireEvent.click(checkboxes[1]);

      // Wait for selection to be registered
      await waitFor(() => {
        const deleteButton = screen.getByRole('button', { name: /delete/i });
        expect(deleteButton).not.toBeDisabled();
      });

      const deleteButton = screen.getByRole('button', { name: /delete/i });
      fireEvent.click(deleteButton);

      // Confirm deletion
      await waitFor(() => {
        expect(screen.getByText('Confirm Delete')).toBeInTheDocument();
      });

      const confirmButton = screen.getByRole('button', { name: /delete$/i });
      fireEvent.click(confirmButton);

      // Check if delete service was called with the correct pump ID
      await waitFor(() => {
        expect(mockDeletePumps).toHaveBeenCalledWith(['pump-002']);
      });
    });

    it('should show error message when deletion fails', async () => {
      mockDeletePumps.mockResolvedValue({
        success: false,
        error: {
          code: 'DELETE_ERROR',
          message: 'Failed to delete pump',
        },
      });

      render(<PumpsPage />);

      await waitFor(() => {
        expect(screen.getAllByText('Pump 1').length).toBeGreaterThanOrEqual(1);
      });

      // Select a pump and delete
      const checkboxes = screen.getAllByRole('checkbox');
      fireEvent.click(checkboxes[1]);
      const deleteButton = screen.getByRole('button', { name: /delete/i });
      fireEvent.click(deleteButton);

      // Confirm deletion
      await waitFor(() => {
        expect(screen.getByText('Confirm Delete')).toBeInTheDocument();
      });

      const confirmButton = screen.getByRole('button', { name: /delete$/i });
      fireEvent.click(confirmButton);

      // Check if error message appears
      await waitFor(() => {
        expect(screen.getByText('Failed to delete pump')).toBeInTheDocument();
      });
    });
  });
});
