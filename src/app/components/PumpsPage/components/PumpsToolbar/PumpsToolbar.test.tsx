import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { PumpsToolbar } from './PumpsToolbar';

describe('PumpsToolbar', () => {
  const mockHandlers = {
    onFilter: vi.fn(),
    onDelete: vi.fn(),
    onToggleEditMode: vi.fn(),
    onEnterDeleteMode: vi.fn(),
    onExitDeleteMode: vi.fn(),
  };

  const defaultUiState = {
    deleteMode: false,
    editMode: false,
    loading: false,
  };

  const defaultSearchState = {
    searchQuery: '',
    onSearch: vi.fn(),
    onClearSearch: vi.fn(),
  };

  const defaultProps = {
    ...mockHandlers,
    uiState: defaultUiState,
    searchState: defaultSearchState,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render all toolbar buttons in default mode', () => {
    render(<PumpsToolbar {...defaultProps} />);

    expect(screen.getByTitle('Search pumps')).toBeInTheDocument();
    expect(screen.getByTitle('Filter pumps')).toBeInTheDocument();
    expect(screen.getByTitle('Enter edit mode')).toBeInTheDocument();
    expect(screen.getByText(/Delete/)).toBeInTheDocument();
  });

  it('should render edit mode UI', () => {
    render(
      <PumpsToolbar
        {...defaultProps}
        uiState={{ ...defaultUiState, editMode: true }}
      />
    );

    // Search and filter buttons should still be visible in edit mode
    expect(screen.getByTitle('Search pumps')).toBeInTheDocument();
    expect(screen.getByTitle('Filter pumps')).toBeInTheDocument();
    // Edit button should show "Exit edit mode" and be primary variant
    expect(screen.getByTitle('Exit edit mode')).toBeInTheDocument();
  });

  it('should render delete mode UI', () => {
    render(
      <PumpsToolbar
        {...defaultProps}
        uiState={{ ...defaultUiState, deleteMode: true }}
        selectedCount={3}
      />
    );

    expect(screen.queryByTitle('Search pumps')).not.toBeInTheDocument();
    expect(screen.queryByTitle('Filter pumps')).not.toBeInTheDocument();
    expect(screen.getByTitle('Delete 3 selected pump(s)')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('should call onSearch when search button clicked', () => {
    render(<PumpsToolbar {...defaultProps} />);

    fireEvent.click(screen.getByTitle('Search pumps'));
    expect(defaultSearchState.onSearch).toHaveBeenCalledTimes(1);
  });

  it('should call onFilter when filter button clicked', () => {
    render(<PumpsToolbar {...defaultProps} />);

    fireEvent.click(screen.getByTitle('Filter pumps'));
    expect(mockHandlers.onFilter).toHaveBeenCalledTimes(1);
  });

  it('should call onToggleEditMode when edit button clicked', () => {
    render(<PumpsToolbar {...defaultProps} />);

    fireEvent.click(screen.getByTitle('Enter edit mode'));
    expect(mockHandlers.onToggleEditMode).toHaveBeenCalledTimes(1);
  });

  it('should call onEnterDeleteMode when delete button clicked', () => {
    render(<PumpsToolbar {...defaultProps} />);

    fireEvent.click(screen.getByTitle('Enter delete mode'));
    expect(mockHandlers.onEnterDeleteMode).toHaveBeenCalledTimes(1);
  });

  it('should disable all buttons when disabled prop is true', () => {
    render(
      <PumpsToolbar
        {...defaultProps}
        selectedCount={5}
        uiState={{ ...defaultUiState, loading: true }}
      />
    );

    expect(screen.getByTitle('Search pumps')).toBeDisabled();
    expect(screen.getByTitle('Filter pumps')).toBeDisabled();
    expect(screen.getByTitle('Enter edit mode')).toBeDisabled();
    expect(screen.getByTitle('Enter delete mode')).toBeDisabled();
  });
});
