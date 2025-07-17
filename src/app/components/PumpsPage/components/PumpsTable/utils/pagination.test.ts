import { render } from '@testing-library/react';
import { getPaginationItems } from './pagination';

describe('getPaginationItems', () => {
  const mockOnPageChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns single page for totalPages = 1', () => {
    const items = getPaginationItems(1, 1, mockOnPageChange);
    const { container } = render(<div>{items}</div>);
    
    expect(container.textContent).toBe('1');
  });

  it('returns all pages when totalPages <= 7', () => {
    const items = getPaginationItems(3, 5, mockOnPageChange);
    const { container } = render(<div>{items}</div>);
    
    expect(container.textContent).toBe('12345');
  });

  it('shows ellipsis when currentPage is near start and totalPages > 7', () => {
    const items = getPaginationItems(2, 10, mockOnPageChange);
    const { container } = render(<div>{items}</div>);
    
    expect(container.textContent).toBe('1234…10');
  });

  it('shows ellipsis when currentPage is near end and totalPages > 7', () => {
    const items = getPaginationItems(9, 10, mockOnPageChange);
    const { container } = render(<div>{items}</div>);
    
    expect(container.textContent).toBe('1…78910');
  });

  it('shows ellipsis on both sides when currentPage is in middle', () => {
    const items = getPaginationItems(5, 10, mockOnPageChange);
    const { container } = render(<div>{items}</div>);
    
    expect(container.textContent).toBe('1…45610');
  });

  it('handles edge case where currentPage is first page', () => {
    const items = getPaginationItems(1, 10, mockOnPageChange);
    const { container } = render(<div>{items}</div>);
    
    expect(container.textContent).toBe('123…10');
  });

  it('handles edge case where currentPage is last page', () => {
    const items = getPaginationItems(10, 10, mockOnPageChange);
    const { container } = render(<div>{items}</div>);
    
    expect(container.textContent).toBe('1…81010');
  });

  it('handles totalPages = 7 exactly', () => {
    const items = getPaginationItems(4, 7, mockOnPageChange);
    const { container } = render(<div>{items}</div>);
    
    expect(container.textContent).toBe('1234567');
  });

  it('handles totalPages = 8 with currentPage near start', () => {
    const items = getPaginationItems(2, 8, mockOnPageChange);
    const { container } = render(<div>{items}</div>);
    
    expect(container.textContent).toBe('1234…8');
  });

  it('handles totalPages = 8 with currentPage near end', () => {
    const items = getPaginationItems(7, 8, mockOnPageChange);
    const { container } = render(<div>{items}</div>);
    
    expect(container.textContent).toBe('1…5678');
  });

  it('handles currentPage = 4 with totalPages = 8', () => {
    const items = getPaginationItems(4, 8, mockOnPageChange);
    const { container } = render(<div>{items}</div>);
    
    expect(container.textContent).toBe('1…3458');
  });

  it('handles currentPage = 5 with totalPages = 8', () => {
    const items = getPaginationItems(5, 8, mockOnPageChange);
    const { container } = render(<div>{items}</div>);
    
    expect(container.textContent).toBe('1…4568');
  });

  it('handles large totalPages numbers', () => {
    const items = getPaginationItems(50, 100, mockOnPageChange);
    const { container } = render(<div>{items}</div>);
    
    expect(container.textContent).toBe('1…495051100');
  });

  it('handles when onPageChange is undefined', () => {
    const items = getPaginationItems(3, 5, undefined);
    const { container } = render(<div>{items}</div>);
    
    expect(container.textContent).toBe('12345');
  });

  it('handles totalPages = 0', () => {
    const items = getPaginationItems(1, 0, mockOnPageChange);
    const { container } = render(<div>{items}</div>);
    
    expect(container.textContent).toBe('');
  });

  it('handles currentPage > totalPages', () => {
    const items = getPaginationItems(10, 5, mockOnPageChange);
    const { container } = render(<div>{items}</div>);
    
    // Should still render pages 1-5
    expect(container.textContent).toBe('12345');
  });

  it('handles currentPage = 0', () => {
    const items = getPaginationItems(0, 5, mockOnPageChange);
    const { container } = render(<div>{items}</div>);
    
    // Should still render pages 1-5
    expect(container.textContent).toBe('12345');
  });

  it('handles negative currentPage', () => {
    const items = getPaginationItems(-1, 5, mockOnPageChange);
    const { container } = render(<div>{items}</div>);
    
    // Should still render pages 1-5
    expect(container.textContent).toBe('12345');
  });

  it('handles negative totalPages', () => {
    const items = getPaginationItems(1, -1, mockOnPageChange);
    const { container } = render(<div>{items}</div>);
    
    expect(container.textContent).toBe('');
  });

  it('creates proper pagination structure for middle pages', () => {
    const items = getPaginationItems(5, 10, mockOnPageChange);
    const { container } = render(<div>{items}</div>);
    
    // Should have: 1, ellipsis, 4, 5, 6, ellipsis, 10
    const paginationItems = container.querySelectorAll('.page-item');
    expect(paginationItems.length).toBe(6); // 1 + ellipsis + 4,5,6 + ellipsis + 10
  });

  it('handles boundary case where currentPage is 3 with totalPages = 8', () => {
    const items = getPaginationItems(3, 8, mockOnPageChange);
    const { container } = render(<div>{items}</div>);
    
    expect(container.textContent).toBe('1234…8');
  });

  it('handles boundary case where currentPage is 6 with totalPages = 8', () => {
    const items = getPaginationItems(6, 8, mockOnPageChange);
    const { container } = render(<div>{items}</div>);
    
    expect(container.textContent).toBe('1…5678');
  });
});