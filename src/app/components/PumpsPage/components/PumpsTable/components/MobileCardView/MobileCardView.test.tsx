import { render, screen, fireEvent } from '@testing-library/react';
import { MobileCardView } from './MobileCardView';
import { AppMode } from '../../../../../../types';
import type { PumpDevice } from '../../../../../../types';

describe('MobileCardView', () => {
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

  it('renders pump cards with correct data', () => {
    render(<MobileCardView {...defaultProps} />);

    expect(screen.getByText('Pump 1')).toBeInTheDocument();
    expect(screen.getByText('Pump 2')).toBeInTheDocument();
    expect(screen.getByText(/Centrifugal/)).toBeInTheDocument();
    expect(screen.getByText(/Submersible/)).toBeInTheDocument();
    expect(screen.getByText(/Area A/)).toBeInTheDocument();
    expect(screen.getByText(/Area B/)).toBeInTheDocument();
  });

  it('displays formatted flow rate and pressure', () => {
    render(<MobileCardView {...defaultProps} />);

    expect(screen.getByText(/150 GPM/)).toBeInTheDocument();
    expect(screen.getByText(/120 GPM/)).toBeInTheDocument();
    expect(screen.getByText(/45 psi/)).toBeInTheDocument();
    expect(screen.getByText(/40 psi/)).toBeInTheDocument();
  });

  it('shows no pumps message when empty', () => {
    render(<MobileCardView {...defaultProps} pumps={[]} />);

    expect(screen.getByText('No pumps found')).toBeInTheDocument();
  });

  it('renders checkboxes in delete mode', () => {
    render(<MobileCardView {...defaultProps} mode={AppMode.DELETE} />);

    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes).toHaveLength(2);
  });

  it('shows selected cards with border in delete mode', () => {
    const selectedPumps = new Set(['pump-1']);
    const { container } = render(
      <MobileCardView
        {...defaultProps}
        mode={AppMode.DELETE}
        selectedPumps={selectedPumps}
      />
    );

    const cards = container.querySelectorAll('.card');
    expect(cards[0]).toHaveClass('border-primary');
    expect(cards[1]).not.toHaveClass('border-primary');
  });

  it('makes cards clickable in edit mode', () => {
    const onRowClick = vi.fn();
    const { container } = render(
      <MobileCardView
        {...defaultProps}
        mode={AppMode.EDIT}
        onRowClick={onRowClick}
      />
    );

    const cards = container.querySelectorAll('.card');
    expect(cards[0]).toHaveClass('pump-card-clickable');
    expect(cards[0]).toHaveStyle('cursor: pointer');

    fireEvent.click(cards[0]);
    expect(onRowClick).toHaveBeenCalledWith('pump-1');
  });

  it('handles checkbox selection in delete mode', () => {
    const onRowSelect = vi.fn();
    render(
      <MobileCardView
        {...defaultProps}
        mode={AppMode.DELETE}
        onRowSelect={onRowSelect}
      />
    );

    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[0]);

    expect(onRowSelect).toHaveBeenCalledWith('pump-1', true);
  });

  it('prevents card click when clicking on checkbox', () => {
    const onRowClick = vi.fn();
    render(
      <MobileCardView
        {...defaultProps}
        mode={AppMode.DELETE}
        onRowClick={onRowClick}
      />
    );

    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[0]);

    expect(onRowClick).not.toHaveBeenCalled();
  });

  it('disables checkboxes when loading', () => {
    render(
      <MobileCardView {...defaultProps} mode={AppMode.DELETE} loading={true} />
    );

    const checkboxes = screen.getAllByRole('checkbox');
    checkboxes.forEach(checkbox => {
      expect(checkbox).toBeDisabled();
    });
  });

  it('shows checkboxes for selected pumps', () => {
    const selectedPumps = new Set(['pump-1']);
    render(
      <MobileCardView
        {...defaultProps}
        mode={AppMode.DELETE}
        selectedPumps={selectedPumps}
      />
    );

    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes[0]).toBeChecked();
    expect(checkboxes[1]).not.toBeChecked();
  });

  it('does not show checkboxes in normal mode', () => {
    render(<MobileCardView {...defaultProps} mode={AppMode.NORMAL} />);

    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
  });

  it('does not show checkboxes in edit mode', () => {
    render(<MobileCardView {...defaultProps} mode={AppMode.EDIT} />);

    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
  });

  it('handles card click in normal mode', () => {
    const onRowClick = vi.fn();
    const { container } = render(
      <MobileCardView
        {...defaultProps}
        mode={AppMode.NORMAL}
        onRowClick={onRowClick}
      />
    );

    const cards = container.querySelectorAll('.card');
    fireEvent.click(cards[0]);

    expect(onRowClick).toHaveBeenCalledWith('pump-1');
  });

  it('maintains correct layout with minimum height for checkbox area', () => {
    const { container } = render(
      <MobileCardView {...defaultProps} mode={AppMode.DELETE} />
    );

    const checkboxContainers = container.querySelectorAll(
      '[style*="min-height"]'
    );

    checkboxContainers.forEach(container => {
      expect(container).toHaveStyle('min-height: 24px');
    });
  });

  it('renders type and area information correctly', () => {
    render(<MobileCardView {...defaultProps} />);

    expect(screen.getAllByText('Type:')).toHaveLength(2);
    expect(screen.getAllByText('Area:')).toHaveLength(2);
    expect(screen.getAllByText('Flow Rate:')).toHaveLength(2);
    expect(screen.getAllByText('Pressure:')).toHaveLength(2);
  });

  it('handles empty selectedPumps set', () => {
    render(
      <MobileCardView
        {...defaultProps}
        mode={AppMode.DELETE}
        selectedPumps={new Set()}
      />
    );

    const checkboxes = screen.getAllByRole('checkbox');
    checkboxes.forEach(checkbox => {
      expect(checkbox).not.toBeChecked();
    });
  });
});
