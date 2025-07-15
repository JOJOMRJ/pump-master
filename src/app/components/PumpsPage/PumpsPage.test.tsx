import { render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { PumpsPage } from './PumpsPage';
import { mockPumpService } from '../../services/mockPumpService';

// Mock the pump service
vi.mock('../../services/mockPumpService', () => ({
  mockPumpService: {
    getPumps: vi.fn(),
  },
}));

const mockGetPumps = mockPumpService.getPumps as ReturnType<typeof vi.fn>;

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
});
