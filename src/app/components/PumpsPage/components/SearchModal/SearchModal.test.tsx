import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { SearchModal } from './SearchModal';

describe('SearchModal', () => {
  const mockOnSubmit = vi.fn();
  const mockOnCancel = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render search modal when show is true', () => {
    render(
      <SearchModal
        show={true}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByText('Search Pumps')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('Enter search terms...')
    ).toBeInTheDocument();
    expect(screen.getByText('Search')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('should not render when show is false', () => {
    render(
      <SearchModal
        show={false}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.queryByText('Search Pumps')).not.toBeInTheDocument();
  });

  it('should populate input with current query', () => {
    render(
      <SearchModal
        show={true}
        currentQuery="test query"
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    const input = screen.getByDisplayValue('test query');
    expect(input).toBeInTheDocument();
  });

  it('should show clear button when current query exists', () => {
    render(
      <SearchModal
        show={true}
        currentQuery="test query"
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByText('Clear Search')).toBeInTheDocument();
  });

  it('should call onSubmit with query when form is submitted', () => {
    render(
      <SearchModal
        show={true}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    const input = screen.getByPlaceholderText('Enter search terms...');
    const searchButton = screen.getByText('Search');

    fireEvent.change(input, { target: { value: 'pump test' } });
    fireEvent.click(searchButton);

    expect(mockOnSubmit).toHaveBeenCalledWith('pump test');
  });

  it('should call onCancel when cancel button is clicked', () => {
    render(
      <SearchModal
        show={true}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it('should call onSubmit with empty string when clear button is clicked', () => {
    render(
      <SearchModal
        show={true}
        currentQuery="test query"
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    const clearButton = screen.getByText('Clear Search');
    fireEvent.click(clearButton);

    expect(mockOnSubmit).toHaveBeenCalledWith('');
  });

  it('should trim whitespace from query on submit', () => {
    render(
      <SearchModal
        show={true}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    const input = screen.getByPlaceholderText('Enter search terms...');
    const searchButton = screen.getByText('Search');

    fireEvent.change(input, { target: { value: '  pump test  ' } });
    fireEvent.click(searchButton);

    expect(mockOnSubmit).toHaveBeenCalledWith('pump test');
  });
});
