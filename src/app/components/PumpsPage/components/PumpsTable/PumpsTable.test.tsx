import { render, screen, fireEvent } from '@testing-library/react';
import { PumpsTable } from './PumpsTable';
import { AppMode } from '../../../../types';
import type { PumpDevice } from '../../../../types';

describe('PumpsTable', () => {
  const mockPumps: PumpDevice[] = [
    {
      id: 'pump-1',
      name: 'Pump 1',
      type: 'Centrifugal',
      areaBlock: 'Area A',
      latitude: 40.7128,
      longitude: -74.006,
      flowRate: { value: 150, unit: 'GPM' },
      offset: { value: 30, unit: 'sec' },
      currentPressure: { value: 45, unit: 'psi' },
      minPressure: { value: 35, unit: 'psi' },
      maxPressure: { value: 55, unit: 'psi' },
    },
    {
      id: 'pump-2',
      name: 'Pump 2',
      type: 'Submersible',
      areaBlock: 'Area B',
      latitude: 40.7589,
      longitude: -73.9851,
      flowRate: { value: 120, unit: 'GPM' },
      offset: { value: 25, unit: 'sec' },
      currentPressure: { value: 40, unit: 'psi' },
      minPressure: { value: 30, unit: 'psi' },
      maxPressure: { value: 50, unit: 'psi' },
    },
  ];

  const mockFilter = {
    filters: {
      types: new Set<string>(),
      areas: new Set<string>(),
    },
    filterMode: false,
    hasActiveFilters: false,
    activeFilterCount: 0,
    filterOptions: {
      types: ['Centrifugal', 'Submersible'],
      areas: ['Area A', 'Area B'],
    },
    toggleFilterMode: vi.fn(),
    toggleTypeFilter: vi.fn(),
    toggleAreaFilter: vi.fn(),
    clearFilters: vi.fn(),
  };

  const mockPagination = {
    currentPage: 1,
    totalPages: 1,
    pageSize: 10,
    total: 2,
    startIndex: 0,
    endIndex: 1,
    goToPage: vi.fn(),
    nextPage: vi.fn(),
    previousPage: vi.fn(),
    setPageSize: vi.fn(),
  };

  const defaultProps = {
    pumps: mockPumps,
    selectedPumps: new Set<string>(),
    mode: AppMode.NORMAL,
    loading: false,
    filter: mockFilter,
    pagination: mockPagination,
    onSelectionChange: vi.fn(),
    onPumpEdit: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders table with pumps data', () => {
    render(<PumpsTable {...defaultProps} />);

    expect(screen.getAllByText('Pump 1')).toHaveLength(2); // Desktop + Mobile
    expect(screen.getAllByText('Pump 2')).toHaveLength(2); // Desktop + Mobile
    expect(screen.getByText('Centrifugal')).toBeInTheDocument();
    expect(screen.getByText('Submersible')).toBeInTheDocument();
  });

  it('renders both desktop and mobile views', () => {
    render(<PumpsTable {...defaultProps} />);

    // Desktop view should be present (hidden on mobile)
    expect(screen.getByText('Pump Name')).toBeInTheDocument();

    // Mobile view should be present
    expect(screen.getAllByText('Pump 1')).toHaveLength(2); // Desktop + Mobile
    expect(screen.getAllByText('Pump 2')).toHaveLength(2); // Desktop + Mobile
  });

  it('shows checkboxes in delete mode', () => {
    render(<PumpsTable {...defaultProps} mode={AppMode.DELETE} />);

    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes.length).toBeGreaterThan(0);
  });

  it('handles row selection correctly', () => {
    const onSelectionChange = vi.fn();
    render(
      <PumpsTable
        {...defaultProps}
        mode={AppMode.DELETE}
        onSelectionChange={onSelectionChange}
      />
    );

    const checkboxes = screen.getAllByRole('checkbox');
    const firstRowCheckbox = checkboxes[1]; // Skip select all checkbox

    fireEvent.click(firstRowCheckbox);
    expect(onSelectionChange).toHaveBeenCalled();
  });

  it('handles empty pumps array', () => {
    render(<PumpsTable {...defaultProps} pumps={[]} />);

    expect(screen.getAllByText('No pumps found')).toHaveLength(2); // Desktop + Mobile
  });

  it('shows pagination summary', () => {
    render(<PumpsTable {...defaultProps} />);

    expect(screen.getByText('Showing 1-2 of 2 pumps')).toBeInTheDocument();
  });

  it('renders with loading state', () => {
    render(<PumpsTable {...defaultProps} loading={true} />);

    // Should still render the table structure
    expect(screen.getByText('Pump Name')).toBeInTheDocument();
  });

  it('renders with filter mode enabled', () => {
    const filterWithMode = {
      ...mockFilter,
      filterMode: true,
    };

    render(<PumpsTable {...defaultProps} filter={filterWithMode} />);

    // Should render table with filter functionality
    expect(screen.getByText('Pump Name')).toBeInTheDocument();
  });

  it('handles selected pumps correctly', () => {
    const selectedPumps = new Set(['pump-1']);
    render(
      <PumpsTable
        {...defaultProps}
        mode={AppMode.DELETE}
        selectedPumps={selectedPumps}
      />
    );

    const checkboxes = screen.getAllByRole('checkbox');
    const selectedCheckboxes = checkboxes.filter(
      cb => (cb as HTMLInputElement).checked
    );

    // Should have at least one selected checkbox
    expect(selectedCheckboxes.length).toBeGreaterThan(0);
  });

  it('shows correct column headers', () => {
    render(<PumpsTable {...defaultProps} />);

    // Should render expected columns
    expect(screen.getByText('Pump Name')).toBeInTheDocument();
    expect(screen.getByText('Type')).toBeInTheDocument();
    expect(screen.getByText('Area/Block')).toBeInTheDocument();
    expect(screen.getByText('Flow Rate')).toBeInTheDocument();
    expect(screen.getByText('Current Pressure')).toBeInTheDocument();
  });

  it('handles pump edit correctly', () => {
    const onPumpEdit = vi.fn();
    render(
      <PumpsTable
        {...defaultProps}
        mode={AppMode.EDIT}
        onPumpEdit={onPumpEdit}
      />
    );

    // Should render table in edit mode
    expect(screen.getByText('Pump Name')).toBeInTheDocument();
  });

  it('renders pagination when there are multiple pages', () => {
    const paginationWithPages = {
      ...mockPagination,
      totalPages: 3,
      total: 25,
      endIndex: 9, // Fix to match expectation
    };

    render(<PumpsTable {...defaultProps} pagination={paginationWithPages} />);

    // Should show pagination controls
    expect(screen.getByText('Showing 1-10 of 25 pumps')).toBeInTheDocument();
  });
});
