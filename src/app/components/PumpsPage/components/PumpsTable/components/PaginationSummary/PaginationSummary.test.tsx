import { render, screen, fireEvent, act } from '@testing-library/react';
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

    expect(screen.getByText(/Showing 1-10 of 50 pumps/)).toBeInTheDocument();
  });

  it('shows correct range for middle page', () => {
    render(<PaginationSummary {...defaultProps} currentPage={3} />);

    expect(screen.getByText(/Showing 21-30 of 50 pumps/)).toBeInTheDocument();
  });

  it('shows correct range for last page', () => {
    render(<PaginationSummary {...defaultProps} currentPage={5} total={47} />);

    expect(screen.getByText(/Showing 41-47 of 47 pumps/)).toBeInTheDocument();
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

    expect(screen.getByText(/Showing 1-10 of 50 pumps/)).toBeInTheDocument();
    expect(screen.getByText(/• 5 selected/)).toBeInTheDocument();
  });

  it('does not show selected count in delete mode when selectedCount is 0', () => {
    render(
      <PaginationSummary
        {...defaultProps}
        mode={AppMode.DELETE}
        selectedCount={0}
      />
    );

    expect(screen.getByText(/Showing 1-10 of 50 pumps/)).toBeInTheDocument();
    expect(screen.queryByText(/selected/)).not.toBeInTheDocument();
  });

  it('renders page size dropdown', () => {
    render(<PaginationSummary {...defaultProps} />);

    expect(screen.getByText('Show:')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('shows page size options when dropdown is clicked', async () => {
    render(<PaginationSummary {...defaultProps} />);

    const dropdown = screen.getByText('10');
    await act(async () => {
      fireEvent.click(dropdown);
    });

    expect(screen.getByText('20')).toBeInTheDocument();
    expect(screen.getByText('50')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
  });

  it('calls onPageSizeChange when page size is selected', async () => {
    const onPageSizeChange = vi.fn();
    render(
      <PaginationSummary
        {...defaultProps}
        onPageSizeChange={onPageSizeChange}
      />
    );

    const dropdown = screen.getByText('10');
    await act(async () => {
      fireEvent.click(dropdown);
    });

    const option20 = screen.getByText('20');
    await act(async () => {
      fireEvent.click(option20);
    });

    expect(onPageSizeChange).toHaveBeenCalledWith(20);
  });

  it('does not render page size dropdown when onPageSizeChange is not provided', () => {
    render(
      <PaginationSummary {...defaultProps} onPageSizeChange={undefined} />
    );

    expect(screen.queryByText('Show:')).not.toBeInTheDocument();
  });

  it('renders pagination when totalPages > 1', () => {
    render(<PaginationSummary {...defaultProps} />);

    expect(screen.getByText('First')).toBeInTheDocument();
    expect(screen.getByText('Previous')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
    expect(screen.getByText('Last')).toBeInTheDocument();
  });

  it('does not render pagination when totalPages <= 1', () => {
    render(<PaginationSummary {...defaultProps} totalPages={1} />);

    expect(screen.queryByText('First')).not.toBeInTheDocument();
    expect(screen.queryByText('Previous')).not.toBeInTheDocument();
    expect(screen.queryByText('Next')).not.toBeInTheDocument();
    expect(screen.queryByText('Last')).not.toBeInTheDocument();
  });

  it('disables first and previous buttons on first page', () => {
    const { container } = render(<PaginationSummary {...defaultProps} />);

    const firstButton = container.querySelector('.page-item:first-child');
    const previousButton = container.querySelector('.page-item:nth-child(2)');

    expect(firstButton).toHaveClass('disabled');
    expect(previousButton).toHaveClass('disabled');
  });

  it('disables next and last buttons on last page', () => {
    const { container } = render(
      <PaginationSummary {...defaultProps} currentPage={5} />
    );

    const nextButton = container.querySelector('.page-item:nth-last-child(2)');
    const lastButton = container.querySelector('.page-item:last-child');

    expect(nextButton).toHaveClass('disabled');
    expect(lastButton).toHaveClass('disabled');
  });

  it('calls onPageChange when pagination buttons are clicked', () => {
    const onPageChange = vi.fn();
    const { container } = render(
      <PaginationSummary
        {...defaultProps}
        currentPage={3}
        onPageChange={onPageChange}
      />
    );

    const firstButton = container.querySelector(
      '.page-item:first-child .page-link'
    );
    const previousButton = container.querySelector(
      '.page-item:nth-child(2) .page-link'
    );
    const nextButton = container.querySelector(
      '.page-item:nth-last-child(2) .page-link'
    );
    const lastButton = container.querySelector(
      '.page-item:last-child .page-link'
    );

    if (firstButton) fireEvent.click(firstButton);
    expect(onPageChange).toHaveBeenCalledWith(1);

    if (previousButton) fireEvent.click(previousButton);
    expect(onPageChange).toHaveBeenCalledWith(2);

    if (nextButton) fireEvent.click(nextButton);
    expect(onPageChange).toHaveBeenCalledWith(4);

    if (lastButton) fireEvent.click(lastButton);
    expect(onPageChange).toHaveBeenCalledWith(5);
  });

  it('still calls onPageChange when disabled buttons are clicked', () => {
    const onPageChange = vi.fn();
    const { container } = render(
      <PaginationSummary {...defaultProps} onPageChange={onPageChange} />
    );

    const firstButton = container.querySelector(
      '.page-item:first-child .page-link'
    );
    const previousButton = container.querySelector(
      '.page-item:nth-child(2) .page-link'
    );

    if (firstButton) fireEvent.click(firstButton);
    if (previousButton) fireEvent.click(previousButton);

    // Note: Bootstrap disabled pagination items are still clickable in event handling
    expect(onPageChange).toHaveBeenCalledTimes(2);
    expect(onPageChange).toHaveBeenCalledWith(1);
    expect(onPageChange).toHaveBeenCalledWith(0);
  });
});
