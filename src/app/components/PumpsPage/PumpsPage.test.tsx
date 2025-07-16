import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { PumpsPage } from './PumpsPage';
import { mockPumpService } from '../../services/mockPumpService';

// Mock the pump service
vi.mock('../../services/mockPumpService', () => ({
  mockPumpService: {
    getPumps: vi.fn(),
    deletePumps: vi.fn(),
    getFilterOptions: vi.fn(),
  },
}));

const mockGetPumps = mockPumpService.getPumps as ReturnType<typeof vi.fn>;
const mockDeletePumps = mockPumpService.deletePumps as ReturnType<typeof vi.fn>;
const mockGetFilterOptions = mockPumpService.getFilterOptions as ReturnType<
  typeof vi.fn
>;

describe('PumpsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Default mock for getFilterOptions
    mockGetFilterOptions.mockResolvedValue({
      success: true,
      data: {
        types: ['Centrifugal', 'Submersible'],
        areas: ['Area A', 'Area B'],
      },
    });
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
      data: {
        data: mockPumps,
        pagination: {
          page: 1,
          pageSize: 10,
          total: mockPumps.length,
          totalPages: 1,
        },
      },
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
      data: {
        data: [],
        pagination: {
          page: 1,
          pageSize: 10,
          total: 0,
          totalPages: 0,
        },
      },
    });

    render(<PumpsPage />);

    await waitFor(() => {
      expect(screen.getByText('Pumps')).toBeInTheDocument();
      expect(screen.getByText('New Pump')).toBeInTheDocument();
      expect(screen.getByText('Delete')).toBeInTheDocument();
      // Check that toolbar buttons exist (they use icons, not text)
      expect(screen.getAllByRole('button')).toHaveLength(6); // New Pump + 3 icon buttons + Delete + PageSize
    });
  });

  it('should render table headers', async () => {
    mockGetPumps.mockResolvedValue({
      success: true,
      data: {
        data: [],
        pagination: {
          page: 1,
          pageSize: 10,
          total: 0,
          totalPages: 0,
        },
      },
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
      data: {
        data: mockPumps,
        pagination: {
          page: 1,
          pageSize: 10,
          total: mockPumps.length,
          totalPages: 1,
        },
      },
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
        data: {
          data: mockPumps,
          pagination: {
            page: 1,
            pageSize: 10,
            total: mockPumps.length,
            totalPages: 1,
          },
        },
      });
    });

    it('should enter delete mode and allow pump selection', async () => {
      render(<PumpsPage />);

      await waitFor(() => {
        expect(screen.getAllByText('Pump 1').length).toBeGreaterThanOrEqual(1);
      });

      // Click delete button to enter delete mode
      const deleteButton = screen.getByRole('button', { name: /delete/i });
      fireEvent.click(deleteButton);

      // Should now see checkboxes and cancel button
      await waitFor(() => {
        expect(screen.getAllByRole('checkbox').length).toBeGreaterThan(0);
      });
      expect(screen.getByText('Cancel')).toBeInTheDocument();
    });

    it('should exit delete mode when cancel is clicked', async () => {
      render(<PumpsPage />);

      await waitFor(() => {
        expect(screen.getAllByText('Pump 1').length).toBeGreaterThanOrEqual(1);
      });

      // Enter delete mode
      const deleteButton = screen.getByRole('button', { name: /delete/i });
      fireEvent.click(deleteButton);

      // Should see checkboxes
      await waitFor(() => {
        expect(screen.getAllByRole('checkbox').length).toBeGreaterThan(0);
      });

      // Click cancel
      const cancelButton = screen.getByText('Cancel');
      fireEvent.click(cancelButton);

      // Should exit delete mode - no checkboxes visible
      await waitFor(() => {
        expect(screen.queryAllByRole('checkbox')).toHaveLength(0);
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
          data: {
            data: mockPumps,
            pagination: {
              page: 1,
              pageSize: 10,
              total: mockPumps.length,
              totalPages: 1,
            },
          },
        })
        .mockResolvedValueOnce({
          success: true,
          data: {
            data: [mockPumps[0]], // Only first pump remains
            pagination: {
              page: 1,
              pageSize: 10,
              total: 1,
              totalPages: 1,
            },
          },
        });

      render(<PumpsPage />);

      await waitFor(() => {
        expect(screen.getAllByText('Pump 1').length).toBeGreaterThanOrEqual(1);
      });

      // Enter delete mode
      const deleteButton = screen.getByRole('button', { name: /delete/i });
      fireEvent.click(deleteButton);

      // Wait for checkboxes to appear
      await waitFor(() => {
        expect(screen.getAllByRole('checkbox').length).toBeGreaterThan(0);
      });

      // Select a pump - first pump checkbox (index 1, after select all)
      const checkboxes = screen.getAllByRole('checkbox');
      fireEvent.click(checkboxes[1]);

      // Click delete button (now shows count)
      await waitFor(() => {
        const deleteButtonWithCount = screen.getByRole('button', {
          name: /delete \(1\)/i,
        });
        fireEvent.click(deleteButtonWithCount);
      });

      // Check if delete service was called with the correct pump ID
      await waitFor(() => {
        expect(mockDeletePumps).toHaveBeenCalledWith(['pump-002']);
      });
    });

    it('should handle deletion failure gracefully', async () => {
      mockDeletePumps.mockResolvedValue({
        success: false,
        error: {
          code: 'DELETE_ERROR',
          message: 'Failed to delete pump',
        },
      });

      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      render(<PumpsPage />);

      await waitFor(() => {
        expect(screen.getAllByText('Pump 1').length).toBeGreaterThanOrEqual(1);
      });

      // Enter delete mode
      const deleteButton = screen.getByRole('button', { name: /delete/i });
      fireEvent.click(deleteButton);

      // Wait for checkboxes to appear
      await waitFor(() => {
        expect(screen.getAllByRole('checkbox').length).toBeGreaterThan(0);
      });

      // Select a pump and delete
      const checkboxes = screen.getAllByRole('checkbox');
      fireEvent.click(checkboxes[1]);

      // Click delete button
      await waitFor(() => {
        const deleteButtonWithCount = screen.getByRole('button', {
          name: /delete \(1\)/i,
        });
        fireEvent.click(deleteButtonWithCount);
      });

      // Check if error was logged to console
      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith(
          'Failed to delete pumps:',
          'Failed to delete pump'
        );
      });

      consoleSpy.mockRestore();
    });
  });
});
