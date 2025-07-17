import { getPaginationItems } from './pagination';

describe('getPaginationItems', () => {
  const mockOnPageChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns single page for totalPages = 1', () => {
    const items = getPaginationItems(1, 1, mockOnPageChange);
    expect(items).toHaveLength(1);
  });

  it('returns all pages when totalPages <= 5', () => {
    const items = getPaginationItems(3, 5, mockOnPageChange);
    expect(items).toHaveLength(5);
  });

  it('shows up to 5 pages when totalPages > 5 and currentPage is near start', () => {
    const items = getPaginationItems(2, 10, mockOnPageChange);
    expect(items).toHaveLength(5); // 1, 2, 3, 4, 5
  });

  it('shows up to 5 pages when totalPages > 5 and currentPage is near end', () => {
    const items = getPaginationItems(9, 10, mockOnPageChange);
    expect(items).toHaveLength(5); // 6, 7, 8, 9, 10
  });

  it('shows up to 5 pages when currentPage is in middle', () => {
    const items = getPaginationItems(5, 10, mockOnPageChange);
    expect(items).toHaveLength(5); // 3, 4, 5, 6, 7
  });

  it('handles edge case where currentPage is first page', () => {
    const items = getPaginationItems(1, 10, mockOnPageChange);
    expect(items).toHaveLength(5); // 1, 2, 3, ellipsis, 10
  });

  it('handles edge case where currentPage is last page', () => {
    const items = getPaginationItems(10, 10, mockOnPageChange);
    expect(items).toHaveLength(5); // 1, ellipsis, 8, 9, 10
  });

  it('handles totalPages = 7 exactly', () => {
    const items = getPaginationItems(4, 7, mockOnPageChange);
    expect(items).toHaveLength(5); // 2, 3, 4, 5, 6
  });

  it('handles totalPages = 8 with currentPage near start', () => {
    const items = getPaginationItems(2, 8, mockOnPageChange);
    expect(items).toHaveLength(5); // 1, 2, 3, 4, 5
  });

  it('handles totalPages = 8 with currentPage near end', () => {
    const items = getPaginationItems(7, 8, mockOnPageChange);
    expect(items).toHaveLength(5); // 4, 5, 6, 7, 8
  });

  it('handles currentPage = 4 with totalPages = 8', () => {
    const items = getPaginationItems(4, 8, mockOnPageChange);
    expect(items).toHaveLength(5); // 2, 3, 4, 5, 6
  });

  it('handles currentPage = 5 with totalPages = 8', () => {
    const items = getPaginationItems(5, 8, mockOnPageChange);
    expect(items).toHaveLength(5); // 3, 4, 5, 6, 7
  });

  it('handles large totalPages numbers', () => {
    const items = getPaginationItems(50, 100, mockOnPageChange);
    expect(items).toHaveLength(5); // 48, 49, 50, 51, 52
  });

  it('handles when onPageChange is undefined', () => {
    const items = getPaginationItems(3, 5, undefined);
    expect(items).toHaveLength(5);
  });

  it('handles totalPages = 0', () => {
    const items = getPaginationItems(1, 0, mockOnPageChange);
    expect(items).toHaveLength(0);
  });

  it('handles currentPage > totalPages', () => {
    const items = getPaginationItems(10, 5, mockOnPageChange);
    expect(items).toHaveLength(5);
  });

  it('handles currentPage = 0', () => {
    const items = getPaginationItems(0, 5, mockOnPageChange);
    expect(items).toHaveLength(5);
  });

  it('handles negative currentPage', () => {
    const items = getPaginationItems(-1, 5, mockOnPageChange);
    expect(items).toHaveLength(5);
  });

  it('handles negative totalPages', () => {
    const items = getPaginationItems(1, -1, mockOnPageChange);
    expect(items).toHaveLength(0);
  });
});
