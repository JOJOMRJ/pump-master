import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { PumpsToolbar } from './PumpsToolbar';

describe('PumpsToolbar', () => {
  const mockHandlers = {
    onSearch: vi.fn(),
    onFilter: vi.fn(),
    onEdit: vi.fn(),
    onDelete: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render all toolbar buttons', () => {
    render(<PumpsToolbar {...mockHandlers} />);

    expect(screen.getByTitle('Search pumps')).toBeInTheDocument();
    expect(screen.getByTitle('Filter pumps')).toBeInTheDocument();
    expect(screen.getByTitle('Edit selected pumps')).toBeInTheDocument();
    expect(screen.getByText(/Delete/)).toBeInTheDocument();
  });

  it('should disable edit and delete buttons when no items selected', () => {
    render(<PumpsToolbar selectedCount={0} {...mockHandlers} />);

    expect(screen.getByTitle('Edit selected pumps')).toBeDisabled();
    expect(screen.getByTitle('Select pumps to delete')).toBeDisabled();
  });

  it('should enable edit and delete buttons when items selected', () => {
    render(<PumpsToolbar selectedCount={3} {...mockHandlers} />);

    expect(screen.getByTitle('Edit selected pumps')).not.toBeDisabled();
    expect(screen.getByTitle('Delete 3 selected pump(s)')).not.toBeDisabled();
  });

  it('should show selected count in delete button', () => {
    render(<PumpsToolbar selectedCount={5} {...mockHandlers} />);

    expect(screen.getByText('Delete (5)')).toBeInTheDocument();
  });

  it('should call onSearch when search button clicked', () => {
    render(<PumpsToolbar {...mockHandlers} />);

    fireEvent.click(screen.getByTitle('Search pumps'));
    expect(mockHandlers.onSearch).toHaveBeenCalledTimes(1);
  });

  it('should call onFilter when filter button clicked', () => {
    render(<PumpsToolbar {...mockHandlers} />);

    fireEvent.click(screen.getByTitle('Filter pumps'));
    expect(mockHandlers.onFilter).toHaveBeenCalledTimes(1);
  });

  it('should call onEdit when edit button clicked and items selected', () => {
    render(<PumpsToolbar selectedCount={2} {...mockHandlers} />);

    fireEvent.click(screen.getByTitle('Edit selected pumps'));
    expect(mockHandlers.onEdit).toHaveBeenCalledTimes(1);
  });

  it('should call onDelete when delete button clicked and items selected', () => {
    render(<PumpsToolbar selectedCount={1} {...mockHandlers} />);

    fireEvent.click(screen.getByTitle('Delete 1 selected pump(s)'));
    expect(mockHandlers.onDelete).toHaveBeenCalledTimes(1);
  });

  it('should disable all buttons when disabled prop is true', () => {
    render(
      <PumpsToolbar selectedCount={5} disabled={true} {...mockHandlers} />
    );

    expect(screen.getByTitle('Search pumps')).toBeDisabled();
    expect(screen.getByTitle('Filter pumps')).toBeDisabled();
    expect(screen.getByTitle('Edit selected pumps')).toBeDisabled();
    expect(screen.getByTitle('Delete 5 selected pump(s)')).toBeDisabled();
  });
});
