import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { PumpsToolbar } from './PumpsToolbar';

describe('PumpsToolbar', () => {
  const mockHandlers = {
    onSearch: vi.fn(),
    onFilter: vi.fn(),
    onEdit: vi.fn(),
    onDelete: vi.fn(),
    onEnterEditMode: vi.fn(),
    onExitEditMode: vi.fn(),
    onEnterDeleteMode: vi.fn(),
    onExitDeleteMode: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render all toolbar buttons in default mode', () => {
    render(<PumpsToolbar {...mockHandlers} />);

    expect(screen.getByTitle('Search pumps')).toBeInTheDocument();
    expect(screen.getByTitle('Filter pumps')).toBeInTheDocument();
    expect(screen.getByTitle('Enter edit mode')).toBeInTheDocument();
    expect(screen.getByText(/Delete/)).toBeInTheDocument();
  });

  it('should render edit mode UI', () => {
    render(<PumpsToolbar editMode={true} {...mockHandlers} />);

    expect(screen.queryByTitle('Search pumps')).not.toBeInTheDocument();
    expect(screen.queryByTitle('Filter pumps')).not.toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('should render delete mode UI', () => {
    render(
      <PumpsToolbar deleteMode={true} selectedCount={3} {...mockHandlers} />
    );

    expect(screen.queryByTitle('Search pumps')).not.toBeInTheDocument();
    expect(screen.queryByTitle('Filter pumps')).not.toBeInTheDocument();
    expect(screen.getByTitle('Delete 3 selected pump(s)')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
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

  it('should call onEnterEditMode when edit button clicked', () => {
    render(<PumpsToolbar {...mockHandlers} />);

    fireEvent.click(screen.getByTitle('Enter edit mode'));
    expect(mockHandlers.onEnterEditMode).toHaveBeenCalledTimes(1);
  });

  it('should call onEnterDeleteMode when delete button clicked', () => {
    render(<PumpsToolbar {...mockHandlers} />);

    fireEvent.click(screen.getByTitle('Enter delete mode'));
    expect(mockHandlers.onEnterDeleteMode).toHaveBeenCalledTimes(1);
  });

  it('should disable all buttons when disabled prop is true', () => {
    render(
      <PumpsToolbar selectedCount={5} disabled={true} {...mockHandlers} />
    );

    expect(screen.getByTitle('Search pumps')).toBeDisabled();
    expect(screen.getByTitle('Filter pumps')).toBeDisabled();
    expect(screen.getByTitle('Enter edit mode')).toBeDisabled();
    expect(screen.getByTitle('Enter delete mode')).toBeDisabled();
  });
});
