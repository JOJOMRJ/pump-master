import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { PageHeader } from './PageHeader';

describe('PageHeader', () => {
  it('should render title correctly', () => {
    render(<PageHeader title="Test Title" />);

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
      'Test Title'
    );
  });

  it('should render New Pump button by default', () => {
    render(<PageHeader title="Pumps" />);

    expect(screen.getByText('New Pump')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'New Pump' })
    ).toBeInTheDocument();
  });

  it('should hide New Pump button when showNewButton is false', () => {
    render(<PageHeader title="Pumps" showNewButton={false} />);

    expect(screen.queryByText('New Pump')).not.toBeInTheDocument();
  });

  it('should call onNewPump when New Pump button is clicked', () => {
    const mockOnNewPump = vi.fn();
    render(<PageHeader title="Pumps" onNewPump={mockOnNewPump} />);

    const newPumpButton = screen.getByText('New Pump');
    fireEvent.click(newPumpButton);

    expect(mockOnNewPump).toHaveBeenCalledTimes(1);
  });

  it('should have correct Bootstrap classes and structure', () => {
    render(<PageHeader title="Pumps" />);

    const row = screen.getByText('Pumps').closest('.row');
    expect(row).toHaveClass('mb-4');

    const col = screen.getByText('Pumps').closest('.col-12');
    expect(col).toBeInTheDocument();

    const flexContainer = screen.getByText('Pumps').closest('.d-flex');
    expect(flexContainer).toHaveClass(
      'justify-content-between',
      'align-items-center'
    );
  });
});
