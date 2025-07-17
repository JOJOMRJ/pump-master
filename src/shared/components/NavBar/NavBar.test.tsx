import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { NavBar } from './NavBar';

// Mock the useAuth hook
vi.mock('../../../app/contexts/AuthContext', () => ({
  useAuth: () => ({
    isAuthenticated: false,
    user: null,
    logout: vi.fn(),
  }),
}));

const NavBarWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('NavBar', () => {
  it('renders pump master brand', () => {
    render(
      <NavBarWrapper>
        <NavBar />
      </NavBarWrapper>
    );

    expect(screen.getByText('PumpMaster')).toBeInTheDocument();
  });

  it('renders brand as link', () => {
    render(
      <NavBarWrapper>
        <NavBar />
      </NavBarWrapper>
    );

    const brandLink = screen.getByText('PumpMaster').closest('a');
    expect(brandLink).toHaveAttribute('href', '/');
  });

  it('has proper navbar structure', () => {
    const { container } = render(
      <NavBarWrapper>
        <NavBar />
      </NavBarWrapper>
    );

    const navbar = container.querySelector('.navbar');
    expect(navbar).toBeInTheDocument();
    expect(navbar).toHaveClass('bg-white');
    expect(navbar).toHaveClass('border-bottom');
  });

  it('has proper container structure', () => {
    const { container } = render(
      <NavBarWrapper>
        <NavBar />
      </NavBarWrapper>
    );

    const containerFluid = container.querySelector('.container-fluid');
    expect(containerFluid).toBeInTheDocument();
    expect(containerFluid).toHaveClass('px-4');
  });

  it('does not show authenticated content when not logged in', () => {
    render(
      <NavBarWrapper>
        <NavBar />
      </NavBarWrapper>
    );

    expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
    expect(screen.queryByText('Pumps')).not.toBeInTheDocument();
    expect(screen.queryByPlaceholderText('Search')).not.toBeInTheDocument();
  });

  it('renders without toggle button when not authenticated', () => {
    render(
      <NavBarWrapper>
        <NavBar />
      </NavBarWrapper>
    );

    expect(
      screen.queryByRole('button', { name: /toggle navigation/i })
    ).not.toBeInTheDocument();
  });

  it('shows only brand when not authenticated', () => {
    render(
      <NavBarWrapper>
        <NavBar />
      </NavBarWrapper>
    );

    expect(screen.getByText('PumpMaster')).toBeInTheDocument();
    expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
    expect(screen.queryByText('Pumps')).not.toBeInTheDocument();
    expect(screen.queryByText('Reports')).not.toBeInTheDocument();
    expect(screen.queryByText('Alerts')).not.toBeInTheDocument();
  });

  it('has brand with star icon', () => {
    render(
      <NavBarWrapper>
        <NavBar />
      </NavBarWrapper>
    );

    const brand = screen.getByText('PumpMaster').closest('a');
    expect(brand).toHaveClass('d-flex', 'align-items-center');

    // Check if SVG icon is present
    const svg = brand?.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('has proper brand styling', () => {
    render(
      <NavBarWrapper>
        <NavBar />
      </NavBarWrapper>
    );

    const brand = screen.getByText('PumpMaster').closest('a');
    expect(brand).toHaveClass('text-dark');
    expect(brand).toHaveClass('fw-bold');
    expect(brand).toHaveClass('text-decoration-none');
  });

  it('renders navbar with light variant', () => {
    const { container } = render(
      <NavBarWrapper>
        <NavBar />
      </NavBarWrapper>
    );

    const navbar = container.querySelector('.navbar');
    expect(navbar).toHaveClass('navbar-light');
  });

  it('has expandable navbar structure', () => {
    const { container } = render(
      <NavBarWrapper>
        <NavBar />
      </NavBarWrapper>
    );

    const navbar = container.querySelector('.navbar');
    expect(navbar).toHaveClass('navbar-expand-lg');
  });

  it('shows minimal structure when not authenticated', () => {
    const { container } = render(
      <NavBarWrapper>
        <NavBar />
      </NavBarWrapper>
    );

    // Should have navbar collapse div but it should be empty or minimal
    const collapse = container.querySelector('.navbar-collapse');
    expect(collapse).toBeInTheDocument();

    // Should not have navigation links
    expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
  });
});
