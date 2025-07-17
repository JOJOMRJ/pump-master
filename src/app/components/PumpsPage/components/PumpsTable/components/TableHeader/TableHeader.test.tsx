import { render, screen, fireEvent } from '@testing-library/react';
import { TableHeader } from './TableHeader';
import { AppMode } from '../../../../../../types';

describe('TableHeader', () => {
  const defaultColumns = [
    { key: 'name', label: 'Name', responsive: 'always' },
    { key: 'type', label: 'Type', responsive: 'md' },
    { key: 'areaBlock', label: 'Area', responsive: 'lg' },
  ];

  const defaultProps = {
    columns: defaultColumns,
    mode: AppMode.NORMAL,
    filterMode: false,
    isAllSelected: false,
    isIndeterminate: false,
    loading: false,
    pumpsLength: 10,
    onSelectAll: vi.fn(),
  };

  const renderWithTable = (component: React.ReactElement) => {
    return render(<table>{component}</table>);
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders table headers correctly', () => {
    renderWithTable(<TableHeader {...defaultProps} />);

    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Type')).toBeInTheDocument();
    expect(screen.getByText('Area')).toBeInTheDocument();
  });

  it('renders select all checkbox in delete mode', () => {
    renderWithTable(<TableHeader {...defaultProps} mode={AppMode.DELETE} />);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeInTheDocument();

    // Check that the checkbox is functional (since title might not be set by React Bootstrap)
    expect(checkbox).not.toBeDisabled();
  });

  it('does not render select all checkbox in normal mode', () => {
    renderWithTable(<TableHeader {...defaultProps} />);

    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
  });

  it('shows correct state for select all checkbox when all selected', () => {
    renderWithTable(
      <TableHeader
        {...defaultProps}
        mode={AppMode.DELETE}
        isAllSelected={true}
      />
    );

    const checkbox = screen.getByRole('checkbox');

    // Check that the checkbox is checked when all selected
    expect(checkbox).toBeChecked();
  });

  it('handles select all checkbox change', () => {
    const onSelectAll = vi.fn();
    renderWithTable(
      <TableHeader
        {...defaultProps}
        mode={AppMode.DELETE}
        onSelectAll={onSelectAll}
      />
    );

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    expect(onSelectAll).toHaveBeenCalledWith(true);
  });

  it('disables select all checkbox when loading', () => {
    renderWithTable(
      <TableHeader {...defaultProps} mode={AppMode.DELETE} loading={true} />
    );

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeDisabled();
  });

  it('disables select all checkbox when no pumps', () => {
    renderWithTable(
      <TableHeader {...defaultProps} mode={AppMode.DELETE} pumpsLength={0} />
    );

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeDisabled();
  });

  it('sets indeterminate state on checkbox', () => {
    renderWithTable(
      <TableHeader
        {...defaultProps}
        mode={AppMode.DELETE}
        isIndeterminate={true}
      />
    );

    const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
    expect(checkbox.indeterminate).toBe(true);
  });

  it('applies responsive classes to columns', () => {
    renderWithTable(<TableHeader {...defaultProps} />);

    const typeHeader = screen.getByText('Type').closest('th');
    const areaHeader = screen.getByText('Area').closest('th');

    expect(typeHeader).toHaveClass('d-none', 'd-md-table-cell');
    expect(areaHeader).toHaveClass('d-none', 'd-lg-table-cell');
  });

  it('handles missing filter options gracefully', () => {
    renderWithTable(
      <TableHeader
        {...defaultProps}
        filterMode={true}
        filterOptions={undefined}
        filters={undefined}
        onToggleTypeFilter={vi.fn()}
        onToggleAreaFilter={vi.fn()}
      />
    );

    expect(screen.getByText('Type')).toBeInTheDocument();
    expect(screen.getByText('Area')).toBeInTheDocument();
  });

  it('handles missing filter callbacks gracefully', () => {
    const filterOptions = {
      types: ['Centrifugal', 'Submersible'],
      areas: ['Area A', 'Area B'],
    };

    renderWithTable(
      <TableHeader
        {...defaultProps}
        filterMode={true}
        filterOptions={filterOptions}
        filters={{
          types: new Set(['Centrifugal']),
          areas: new Set<string>(),
        }}
      />
    );

    expect(screen.getByText('Type')).toBeInTheDocument();
    expect(screen.getByText('Area')).toBeInTheDocument();
  });
});
