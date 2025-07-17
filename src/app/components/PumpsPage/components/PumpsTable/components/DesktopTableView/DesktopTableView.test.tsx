import { render, screen, fireEvent } from '@testing-library/react';
import { DesktopTableView } from './DesktopTableView';
import { AppMode } from '../../../../../../types';
import type { PumpDevice } from '../../../../../../types';

describe('DesktopTableView', () => {
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

  const defaultColumns = [
    { key: 'name', label: 'Name', responsive: '' },
    { key: 'type', label: 'Type', responsive: 'd-none d-md-table-cell' },
    { key: 'areaBlock', label: 'Area', responsive: 'd-none d-lg-table-cell' },
  ];

  const defaultProps = {
    pumps: mockPumps,
    selectedPumps: new Set<string>(),
    mode: AppMode.NORMAL,
    loading: false,
    columns: defaultColumns,
    isAllSelected: false,
    isIndeterminate: false,
    onSelectAll: vi.fn(),
    onRowSelect: vi.fn(),
    onRowClick: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders table with pumps data', () => {
    render(<DesktopTableView {...defaultProps} />);
    
    expect(screen.getByText('Pump 1')).toBeInTheDocument();
    expect(screen.getByText('Pump 2')).toBeInTheDocument();
    expect(screen.getByText('Centrifugal')).toBeInTheDocument();
    expect(screen.getByText('Submersible')).toBeInTheDocument();
  });

  it('renders table headers', () => {
    render(<DesktopTableView {...defaultProps} />);
    
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Type')).toBeInTheDocument();
    expect(screen.getByText('Area')).toBeInTheDocument();
  });

  it('renders checkboxes in delete mode', () => {
    render(<DesktopTableView {...defaultProps} mode={AppMode.DELETE} />);
    
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes).toHaveLength(3); // 1 for select all + 2 for rows
  });

  it('shows selected rows in delete mode', () => {
    const selectedPumps = new Set(['pump-1']);
    render(
      <DesktopTableView
        {...defaultProps}
        mode={AppMode.DELETE}
        selectedPumps={selectedPumps}
      />
    );
    
    const rows = screen.getAllByRole('row');
    const dataRows = rows.slice(1); // Skip header row
    
    expect(dataRows[0]).toHaveClass('table-active');
    expect(dataRows[1]).not.toHaveClass('table-active');
  });

  it('makes rows clickable in edit mode', () => {
    const onRowClick = vi.fn();
    render(
      <DesktopTableView
        {...defaultProps}
        mode={AppMode.EDIT}
        onRowClick={onRowClick}
      />
    );
    
    const rows = screen.getAllByRole('row');
    const firstDataRow = rows[1]; // Skip header row
    
    expect(firstDataRow).toHaveClass('pump-row-clickable');
    expect(firstDataRow).toHaveStyle('cursor: pointer');
    
    fireEvent.click(firstDataRow);
    expect(onRowClick).toHaveBeenCalledWith('pump-1');
  });

  it('handles row selection in delete mode', () => {
    const onRowSelect = vi.fn();
    render(
      <DesktopTableView
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

  it('prevents row click when clicking on checkbox', () => {
    const onRowClick = vi.fn();
    render(
      <DesktopTableView
        {...defaultProps}
        mode={AppMode.DELETE}
        onRowClick={onRowClick}
      />
    );
    
    const checkboxes = screen.getAllByRole('checkbox');
    const firstRowCheckbox = checkboxes[1]; // Skip select all checkbox
    
    fireEvent.click(firstRowCheckbox);
    expect(onRowClick).not.toHaveBeenCalled();
  });

  it('disables checkboxes when loading', () => {
    render(
      <DesktopTableView
        {...defaultProps}
        mode={AppMode.DELETE}
        loading={true}
      />
    );
    
    const checkboxes = screen.getAllByRole('checkbox');
    checkboxes.forEach(checkbox => {
      expect(checkbox).toBeDisabled();
    });
  });

  it('shows no pumps message when empty', () => {
    render(<DesktopTableView {...defaultProps} pumps={[]} />);
    
    expect(screen.getByText('No pumps found')).toBeInTheDocument();
  });

  it('shows no pumps message with correct colspan in delete mode', () => {
    render(
      <DesktopTableView
        {...defaultProps}
        pumps={[]}
        mode={AppMode.DELETE}
      />
    );
    
    const noDataCell = screen.getByText('No pumps found');
    expect(noDataCell).toHaveAttribute('colspan', '4'); // 3 columns + 1 checkbox column
  });

  it('passes filter props to TableHeader', () => {
    const filterOptions = {
      types: ['Centrifugal', 'Submersible'],
      areas: ['Area A', 'Area B'],
    };
    const filters = {
      types: new Set(['Centrifugal']),
      areas: new Set<string>(),
    };

    render(
      <DesktopTableView
        {...defaultProps}
        filterMode={true}
        filterOptions={filterOptions}
        filters={filters}
        onToggleTypeFilter={vi.fn()}
        onToggleAreaFilter={vi.fn()}
      />
    );
    
    // TableHeader should receive these props and render accordingly
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Type')).toBeInTheDocument();
    expect(screen.getByText('Area')).toBeInTheDocument();
  });

  it('handles missing optional props gracefully', () => {
    render(
      <DesktopTableView
        {...defaultProps}
        filterMode={undefined}
        filterOptions={undefined}
        filters={undefined}
        onToggleTypeFilter={undefined}
        onToggleAreaFilter={undefined}
      />
    );
    
    expect(screen.getByText('Pump 1')).toBeInTheDocument();
    expect(screen.getByText('Pump 2')).toBeInTheDocument();
  });

  it('applies responsive classes to table cells', () => {
    render(<DesktopTableView {...defaultProps} />);
    
    const rows = screen.getAllByRole('row');
    const firstDataRow = rows[1]; // Skip header row
    const cells = firstDataRow.querySelectorAll('td');
    
    // First cell (name) should not have responsive class
    expect(cells[0]).not.toHaveClass('d-none');
    
    // Second cell (type) should have responsive class
    expect(cells[1]).toHaveClass('d-none', 'd-md-table-cell');
    
    // Third cell (area) should have responsive class
    expect(cells[2]).toHaveClass('d-none', 'd-lg-table-cell');
  });

  it('is hidden on mobile devices', () => {
    const { container } = render(<DesktopTableView {...defaultProps} />);
    
    const tableContainer = container.firstChild;
    expect(tableContainer).toHaveClass('d-none', 'd-md-block');
  });
});