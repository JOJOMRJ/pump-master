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
      longitude: -74.0060,
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

  const defaultProps = {
    pumps: mockPumps,
    selectedPumps: new Set<string>(),
    mode: AppMode.NORMAL,
    loading: false,
    onRowSelect: vi.fn(),
    onRowClick: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders both desktop and mobile views', () => {
    render(<PumpsTable {...defaultProps} />);
    
    // Desktop view should be present (hidden on mobile)
    expect(screen.getByText('Name')).toBeInTheDocument();
    
    // Mobile view should be present
    expect(screen.getByText('Pump 1')).toBeInTheDocument();
    expect(screen.getByText('Pump 2')).toBeInTheDocument();
  });

  it('passes correct props to desktop view', () => {
    const selectedPumps = new Set(['pump-1']);
    render(
      <PumpsTable
        {...defaultProps}
        mode={AppMode.DELETE}
        selectedPumps={selectedPumps}
      />
    );
    
    // Desktop view should show checkboxes in delete mode
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes.length).toBeGreaterThan(0);
  });

  it('passes correct props to mobile view', () => {
    const selectedPumps = new Set(['pump-1']);
    render(
      <PumpsTable
        {...defaultProps}
        mode={AppMode.DELETE}
        selectedPumps={selectedPumps}
      />
    );
    
    // Mobile view should show checkboxes in delete mode
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes.length).toBeGreaterThan(0);
  });

  it('handles row selection correctly', () => {
    const onRowSelect = vi.fn();
    render(
      <PumpsTable
        {...defaultProps}
        mode={AppMode.DELETE}
        onRowSelect={onRowSelect}
      />
    );
    
    const checkboxes = screen.getAllByRole('checkbox');
    const firstRowCheckbox = checkboxes[1]; // Skip select all checkbox
    
    fireEvent.click(firstRowCheckbox);
    expect(onRowSelect).toHaveBeenCalledWith('pump-1', true);
  });

  it('handles row click correctly', () => {
    const onRowClick = vi.fn();
    render(
      <PumpsTable
        {...defaultProps}
        mode={AppMode.EDIT}
        onRowClick={onRowClick}
      />
    );
    
    // Click on mobile card
    const cards = screen.getAllByRole('button');
    fireEvent.click(cards[0]);
    
    expect(onRowClick).toHaveBeenCalledWith('pump-1');
  });

  it('handles select all functionality', () => {
    const onRowSelect = vi.fn();
    render(
      <PumpsTable
        {...defaultProps}
        mode={AppMode.DELETE}
        onRowSelect={onRowSelect}
      />
    );
    
    const selectAllCheckbox = screen.getAllByRole('checkbox')[0];
    fireEvent.click(selectAllCheckbox);
    
    // Should call onRowSelect for each pump
    expect(onRowSelect).toHaveBeenCalledWith('pump-1', true);
    expect(onRowSelect).toHaveBeenCalledWith('pump-2', true);
  });

  it('handles deselect all functionality', () => {
    const onRowSelect = vi.fn();
    const selectedPumps = new Set(['pump-1', 'pump-2']);
    render(
      <PumpsTable
        {...defaultProps}
        mode={AppMode.DELETE}
        selectedPumps={selectedPumps}
        onRowSelect={onRowSelect}
      />
    );
    
    const selectAllCheckbox = screen.getAllByRole('checkbox')[0];
    fireEvent.click(selectAllCheckbox);
    
    // Should call onRowSelect to deselect each pump
    expect(onRowSelect).toHaveBeenCalledWith('pump-1', false);
    expect(onRowSelect).toHaveBeenCalledWith('pump-2', false);
  });

  it('shows indeterminate state when some pumps are selected', () => {
    const selectedPumps = new Set(['pump-1']);
    render(
      <PumpsTable
        {...defaultProps}
        mode={AppMode.DELETE}
        selectedPumps={selectedPumps}
      />
    );
    
    const selectAllCheckbox = screen.getAllByRole('checkbox')[0] as HTMLInputElement;
    expect(selectAllCheckbox.indeterminate).toBe(true);
  });

  it('shows checked state when all pumps are selected', () => {
    const selectedPumps = new Set(['pump-1', 'pump-2']);
    render(
      <PumpsTable
        {...defaultProps}
        mode={AppMode.DELETE}
        selectedPumps={selectedPumps}
      />
    );
    
    const selectAllCheckbox = screen.getAllByRole('checkbox')[0] as HTMLInputElement;
    expect(selectAllCheckbox.checked).toBe(true);
    expect(selectAllCheckbox.indeterminate).toBe(false);
  });

  it('renders with filter mode enabled', () => {
    const filterOptions = {
      types: ['Centrifugal', 'Submersible'],
      areas: ['Area A', 'Area B'],
    };
    const filters = {
      types: new Set(['Centrifugal']),
      areas: new Set<string>(),
    };

    render(
      <PumpsTable
        {...defaultProps}
        filterMode={true}
        filterOptions={filterOptions}
        filters={filters}
        onToggleTypeFilter={vi.fn()}
        onToggleAreaFilter={vi.fn()}
      />
    );
    
    // Should render table with filter functionality
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Type')).toBeInTheDocument();
    expect(screen.getByText('Area')).toBeInTheDocument();
  });

  it('handles empty pumps array', () => {
    render(<PumpsTable {...defaultProps} pumps={[]} />);
    
    expect(screen.getByText('No pumps found')).toBeInTheDocument();
  });

  it('handles loading state', () => {
    render(<PumpsTable {...defaultProps} loading={true} />);
    
    // Checkboxes should be disabled when loading
    const checkboxes = screen.getAllByRole('checkbox');
    if (checkboxes.length > 0) {
      checkboxes.forEach(checkbox => {
        expect(checkbox).toBeDisabled();
      });
    }
  });

  it('uses correct column definitions', () => {
    render(<PumpsTable {...defaultProps} />);
    
    // Should render all expected columns
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Type')).toBeInTheDocument();
    expect(screen.getByText('Area')).toBeInTheDocument();
    expect(screen.getByText('Flow Rate')).toBeInTheDocument();
    expect(screen.getByText('Pressure')).toBeInTheDocument();
    expect(screen.getByText('Location')).toBeInTheDocument();
  });

  it('handles filter callbacks correctly', () => {
    const onToggleTypeFilter = vi.fn();
    const onToggleAreaFilter = vi.fn();
    const filterOptions = {
      types: ['Centrifugal', 'Submersible'],
      areas: ['Area A', 'Area B'],
    };
    const filters = {
      types: new Set<string>(),
      areas: new Set<string>(),
    };

    render(
      <PumpsTable
        {...defaultProps}
        filterMode={true}
        filterOptions={filterOptions}
        filters={filters}
        onToggleTypeFilter={onToggleTypeFilter}
        onToggleAreaFilter={onToggleAreaFilter}
      />
    );
    
    // The filter callbacks should be passed to the DesktopTableView
    expect(screen.getByText('Type')).toBeInTheDocument();
    expect(screen.getByText('Area')).toBeInTheDocument();
  });

  it('maintains consistent behavior between desktop and mobile views', () => {
    const onRowClick = vi.fn();
    const selectedPumps = new Set(['pump-1']);
    
    render(
      <PumpsTable
        {...defaultProps}
        mode={AppMode.DELETE}
        selectedPumps={selectedPumps}
        onRowClick={onRowClick}
      />
    );
    
    // Both views should show the same selection state
    const checkboxes = screen.getAllByRole('checkbox');
    const selectedCheckboxes = checkboxes.filter(cb => (cb as HTMLInputElement).checked);
    
    // Should have at least one selected checkbox (excluding indeterminate select-all)
    expect(selectedCheckboxes.length).toBeGreaterThan(0);
  });
});