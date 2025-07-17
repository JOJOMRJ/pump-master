import { render, screen, fireEvent } from '@testing-library/react';
import { PaginationSummary } from './PaginationSummary';
import { AppMode } from '../../../../../../types';

describe('PaginationSummary', () => {
  const defaultProps = {
    currentPage: 1,
    pageSize: 10,
    total: 50,
    totalPages: 5,
    selectedCount: 0,
    mode: AppMode.NORMAL,
    onPageChange: vi.fn(),
    onPageSizeChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders pagination summary correctly', () => {
    render(<PaginationSummary {...defaultProps} />);
    
    expect(screen.getByText('Showing 1-10 of 50 pumps')).toBeInTheDocument();
  });

  it('shows correct range for middle page', () => {
    render(<PaginationSummary {...defaultProps} currentPage={3} />);
    
    expect(screen.getByText('Showing 21-30 of 50 pumps')).toBeInTheDocument();
  });

  it('shows correct range for last page', () => {
    render(<PaginationSummary {...defaultProps} currentPage={5} total={47} />);
    
    expect(screen.getByText('Showing 41-47 of 47 pumps')).toBeInTheDocument();
  });

  it('shows no pumps message when total is 0', () => {
    render(<PaginationSummary {...defaultProps} total={0} />);
    
    expect(screen.getByText('No pumps found')).toBeInTheDocument();
  });

  it('shows selected count in delete mode', () => {
    render(
      <PaginationSummary
        {...defaultProps}
        mode={AppMode.DELETE}
        selectedCount={5}
      />
    );
    
    expect(screen.getByText('Showing 1-10 of 50 pumps • 5 selected')).toBeInTheDocument();
  });

  it('does not show selected count in delete mode when selectedCount is 0', () => {
    render(
      <PaginationSummary
        {...defaultProps}
        mode={AppMode.DELETE}
        selectedCount={0}
      />
    );
    
    expect(screen.getByText('Showing 1-10 of 50 pumps')).toBeInTheDocument();
    expect(screen.queryByText('selected')).not.toBeInTheDocument();
  });

  it('renders page size dropdown', () => {
    render(<PaginationSummary {...defaultProps} />);
    
    expect(screen.getByText('Show:')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('shows page size options when dropdown is clicked', () => {
    render(<PaginationSummary {...defaultProps} />);
    
    const dropdown = screen.getByText('10');
    fireEvent.click(dropdown);
    
    expect(screen.getByText('20')).toBeInTheDocument();
    expect(screen.getByText('50')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
  });

  it('calls onPageSizeChange when page size is selected', () => {
    const onPageSizeChange = vi.fn();
    render(<PaginationSummary {...defaultProps} onPageSizeChange={onPageSizeChange} />);
    
    const dropdown = screen.getByText('10');
    fireEvent.click(dropdown);
    
    const option20 = screen.getByText('20');
    fireEvent.click(option20);
    
    expect(onPageSizeChange).toHaveBeenCalledWith(20);
  });

  it('does not render page size dropdown when onPageSizeChange is not provided', () => {
    render(<PaginationSummary {...defaultProps} onPageSizeChange={undefined} />);
    
    expect(screen.queryByText('Show:')).not.toBeInTheDocument();
  });

  it('renders pagination when totalPages > 1', () => {
    render(<PaginationSummary {...defaultProps} />);
    
    expect(screen.getByLabelText('First')).toBeInTheDocument();
    expect(screen.getByLabelText('Previous')).toBeInTheDocument();
    expect(screen.getByLabelText('Next')).toBeInTheDocument();
    expect(screen.getByLabelText('Last')).toBeInTheDocument();
  });

  it('does not render pagination when totalPages <= 1', () => {
    render(<PaginationSummary {...defaultProps} totalPages={1} />);
    
    expect(screen.queryByLabelText('First')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Previous')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Next')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Last')).not.toBeInTheDocument();
  });

  it('disables first and previous buttons on first page', () => {
    render(<PaginationSummary {...defaultProps} />);
    
    expect(screen.getByLabelText('First')).toBeDisabled();
    expect(screen.getByLabelText('Previous')).toBeDisabled();
  });

  it('disables next and last buttons on last page', () => {
    render(<PaginationSummary {...defaultProps} currentPage={5} />);
    
    expect(screen.getByLabelText('Next')).toBeDisabled();
    expect(screen.getByLabelText('Last')).toBeDisabled();
  });

  it('calls onPageChange when pagination buttons are clicked', () => {
    const onPageChange = vi.fn();
    render(<PaginationSummary {...defaultProps} currentPage={3} onPageChange={onPageChange} />);
    
    fireEvent.click(screen.getByLabelText('First'));
    expect(onPageChange).toHaveBeenCalledWith(1);
    
    fireEvent.click(screen.getByLabelText('Previous'));
    expect(onPageChange).toHaveBeenCalledWith(2);
    
    fireEvent.click(screen.getByLabelText('Next'));
    expect(onPageChange).toHaveBeenCalledWith(4);
    
    fireEvent.click(screen.getByLabelText('Last'));
    expect(onPageChange).toHaveBeenCalledWith(5);
  });

  it('does not call onPageChange when buttons are disabled', () => {
    const onPageChange = vi.fn();
    render(<PaginationSummary {...defaultProps} onPageChange={onPageChange} />);
    
    fireEvent.click(screen.getByLabelText('First'));
    fireEvent.click(screen.getByLabelText('Previous'));
    
    expect(onPageChange).not.toHaveBeenCalled();
  });
});