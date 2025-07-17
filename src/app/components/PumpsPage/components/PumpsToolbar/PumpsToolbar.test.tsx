import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { PumpsToolbar } from './PumpsToolbar';
import { AppMode } from '../../../../types';
import { usePermissions } from '../../../../hooks';
import { PERMISSIONS } from '../../../../types/Permissions';
import type { UseSearchReturn } from '../../../../hooks';

// Mock the usePermissions hook
vi.mock('../../../../hooks', () => ({
  usePermissions: vi.fn(),
}));

const mockUsePermissions = usePermissions as ReturnType<typeof vi.fn>;

describe('PumpsToolbar', () => {
  const mockSearch: UseSearchReturn = {
    searchQuery: '',
    showSearchModal: false,
    setSearchQuery: vi.fn(),
    openSearchModal: vi.fn(),
    closeSearchModal: vi.fn(),
    clearSearch: vi.fn(),
    handleSearchSubmit: vi.fn(),
    handleSearchCancel: vi.fn(),
  };

  const defaultProps = {
    mode: AppMode.NORMAL,
    loading: false,
    search: mockSearch,
    filterMode: false,
    hasActiveFilters: false,
    activeFilterCount: 0,
    onFilter: vi.fn(),
    onDelete: vi.fn(),
    onModeChange: vi.fn(),
    onClearFilters: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render search and filter buttons for all users', () => {
    mockUsePermissions.mockReturnValue({
      hasPermission: vi.fn().mockReturnValue(false),
    });

    render(<PumpsToolbar {...defaultProps} />);

    expect(screen.getByTitle('Search pumps')).toBeInTheDocument();
    expect(screen.getByTitle('Filter pumps')).toBeInTheDocument();
  });

  it('should show edit button when user has edit permission', () => {
    mockUsePermissions.mockReturnValue({
      hasPermission: vi.fn().mockImplementation(permission => {
        return permission === PERMISSIONS.EDIT;
      }),
    });

    render(<PumpsToolbar {...defaultProps} />);

    expect(screen.getByTitle('Enter edit mode')).toBeInTheDocument();
  });

  it('should hide edit button when user does not have edit permission', () => {
    mockUsePermissions.mockReturnValue({
      hasPermission: vi.fn().mockReturnValue(false),
    });

    render(<PumpsToolbar {...defaultProps} />);

    expect(screen.queryByTitle('Enter edit mode')).not.toBeInTheDocument();
  });

  it('should show delete button when user has delete permission', () => {
    mockUsePermissions.mockReturnValue({
      hasPermission: vi.fn().mockImplementation(permission => {
        return permission === PERMISSIONS.DELETE;
      }),
    });

    render(<PumpsToolbar {...defaultProps} />);

    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  it('should hide delete button when user does not have delete permission', () => {
    mockUsePermissions.mockReturnValue({
      hasPermission: vi.fn().mockReturnValue(false),
    });

    render(<PumpsToolbar {...defaultProps} />);

    expect(screen.queryByText('Delete')).not.toBeInTheDocument();
  });

  it('should show both edit and delete buttons for admin user', () => {
    mockUsePermissions.mockReturnValue({
      hasPermission: vi.fn().mockImplementation(permission => {
        return [PERMISSIONS.EDIT, PERMISSIONS.DELETE].includes(permission);
      }),
    });

    render(<PumpsToolbar {...defaultProps} />);

    expect(screen.getByTitle('Enter edit mode')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  it('should show only edit button for operator user', () => {
    mockUsePermissions.mockReturnValue({
      hasPermission: vi.fn().mockImplementation(permission => {
        return permission === PERMISSIONS.EDIT;
      }),
    });

    render(<PumpsToolbar {...defaultProps} />);

    expect(screen.getByTitle('Enter edit mode')).toBeInTheDocument();
    expect(screen.queryByText('Delete')).not.toBeInTheDocument();
  });

  it('should show no edit or delete buttons for viewer user', () => {
    mockUsePermissions.mockReturnValue({
      hasPermission: vi.fn().mockReturnValue(false),
    });

    render(<PumpsToolbar {...defaultProps} />);

    expect(screen.queryByTitle('Enter edit mode')).not.toBeInTheDocument();
    expect(screen.queryByText('Delete')).not.toBeInTheDocument();
  });

  it('should show edit button in active state when in edit mode', () => {
    mockUsePermissions.mockReturnValue({
      hasPermission: vi.fn().mockImplementation(permission => {
        return permission === PERMISSIONS.EDIT;
      }),
    });

    render(<PumpsToolbar {...defaultProps} mode={AppMode.EDIT} />);

    const editButton = screen.getByTitle('Exit edit mode');
    expect(editButton).toHaveClass('btn-primary');
  });

  it('should show delete button in active state when in delete mode', () => {
    mockUsePermissions.mockReturnValue({
      hasPermission: vi.fn().mockImplementation(permission => {
        return permission === PERMISSIONS.DELETE;
      }),
    });

    render(
      <PumpsToolbar {...defaultProps} mode={AppMode.DELETE} selectedCount={2} />
    );

    expect(screen.getByText('Delete (2)')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('should disable delete button when in edit mode', () => {
    mockUsePermissions.mockReturnValue({
      hasPermission: vi.fn().mockImplementation(permission => {
        return [PERMISSIONS.EDIT, PERMISSIONS.DELETE].includes(permission);
      }),
    });

    render(<PumpsToolbar {...defaultProps} mode={AppMode.EDIT} />);

    const deleteButton = screen.getByRole('button', { name: /delete/i });
    expect(deleteButton).toBeDisabled();
  });

  it('should show search query when present', () => {
    mockUsePermissions.mockReturnValue({
      hasPermission: vi.fn().mockReturnValue(false),
    });

    render(
      <PumpsToolbar
        {...defaultProps}
        search={{
          ...mockSearch,
          searchQuery: 'test search',
        }}
      />
    );

    expect(screen.getByTitle('Searching: "test search"')).toBeInTheDocument();
    expect(screen.getByTitle('Clear search')).toBeInTheDocument();
  });

  it('should show filter count when filters are active', () => {
    mockUsePermissions.mockReturnValue({
      hasPermission: vi.fn().mockReturnValue(false),
    });

    render(
      <PumpsToolbar
        {...defaultProps}
        hasActiveFilters={true}
        activeFilterCount={3}
      />
    );

    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('should show clear filters button when in filter mode with active filters', () => {
    mockUsePermissions.mockReturnValue({
      hasPermission: vi.fn().mockReturnValue(false),
    });

    render(
      <PumpsToolbar
        {...defaultProps}
        filterMode={true}
        hasActiveFilters={true}
      />
    );

    expect(screen.getByText('Clear Filters')).toBeInTheDocument();
  });
});
