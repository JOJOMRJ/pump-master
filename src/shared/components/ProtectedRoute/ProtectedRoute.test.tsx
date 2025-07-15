import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';

// Mock useAuth hook
const mockUseAuth = vi.fn();
vi.mock('../../../app/contexts', () => ({
  useAuth: () => mockUseAuth(),
}));

// Helper component to track navigation
const LocationDisplay = () => {
  const location = useLocation();
  return <div data-testid="location">{location.pathname}</div>;
};

// Helper to render with router
const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
      <LocationDisplay />
    </BrowserRouter>
  );
};

describe('ProtectedRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render children when user is authenticated', () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: true });

    renderWithRouter(
      <ProtectedRoute>
        <div data-testid="protected-content">Protected Content</div>
      </ProtectedRoute>
    );

    expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('should redirect to login when user is not authenticated', () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: false });

    renderWithRouter(
      <ProtectedRoute>
        <div data-testid="protected-content">Protected Content</div>
      </ProtectedRoute>
    );

    // Protected content should not be rendered
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('should call useAuth hook', () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: true });

    renderWithRouter(
      <ProtectedRoute>
        <div>Content</div>
      </ProtectedRoute>
    );

    expect(mockUseAuth).toHaveBeenCalledTimes(1);
  });

  it('should render different types of children when authenticated', () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: true });

    const { rerender } = renderWithRouter(
      <ProtectedRoute>
        <span>Text content</span>
      </ProtectedRoute>
    );

    expect(screen.getByText('Text content')).toBeInTheDocument();

    rerender(
      <BrowserRouter>
        <ProtectedRoute>
          <div>
            <h1>Title</h1>
            <p>Paragraph</p>
          </div>
        </ProtectedRoute>
        <LocationDisplay />
      </BrowserRouter>
    );

    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Paragraph')).toBeInTheDocument();
  });

  it('should handle null children when authenticated', () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: true });

    expect(() => {
      renderWithRouter(<ProtectedRoute>{null}</ProtectedRoute>);
    }).not.toThrow();
  });

  it('should handle multiple children when authenticated', () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: true });

    renderWithRouter(
      <ProtectedRoute>
        <div>First child</div>
        <div>Second child</div>
      </ProtectedRoute>
    );

    expect(screen.getByText('First child')).toBeInTheDocument();
    expect(screen.getByText('Second child')).toBeInTheDocument();
  });

  it('should not render any children when not authenticated', () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: false });

    renderWithRouter(
      <ProtectedRoute>
        <div data-testid="child1">Child 1</div>
        <div data-testid="child2">Child 2</div>
      </ProtectedRoute>
    );

    expect(screen.queryByTestId('child1')).not.toBeInTheDocument();
    expect(screen.queryByTestId('child2')).not.toBeInTheDocument();
  });

  it('should re-render when authentication state changes', () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: false });

    const { rerender } = renderWithRouter(
      <ProtectedRoute>
        <div data-testid="content">Content</div>
      </ProtectedRoute>
    );

    // Initially not authenticated
    expect(screen.queryByTestId('content')).not.toBeInTheDocument();

    // Change to authenticated
    mockUseAuth.mockReturnValue({ isAuthenticated: true });

    rerender(
      <BrowserRouter>
        <ProtectedRoute>
          <div data-testid="content">Content</div>
        </ProtectedRoute>
        <LocationDisplay />
      </BrowserRouter>
    );

    expect(screen.getByTestId('content')).toBeInTheDocument();
  });
});
