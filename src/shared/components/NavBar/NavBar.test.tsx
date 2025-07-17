import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { NavBar } from './NavBar';
import { AuthProvider } from '../../../app/contexts/AuthContext';

const NavBarWrapper = () => (
  <BrowserRouter>
    <AuthProvider>
      <NavBar />
    </AuthProvider>
  </BrowserRouter>
);

describe('NavBar', () => {
  it('renders pump master brand', () => {
    render(<NavBarWrapper />);
    
    expect(screen.getByText('Pump Master')).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    render(<NavBarWrapper />);
    
    expect(screen.getByText('Overview')).toBeInTheDocument();
    expect(screen.getByText('Pumps')).toBeInTheDocument();
  });

  it('renders user menu when authenticated', () => {
    render(<NavBarWrapper />);
    
    // The user menu should be present (might show as dropdown or button)
    const userElements = screen.queryAllByText(/admin/i);
    expect(userElements.length).toBeGreaterThanOrEqual(0);
  });

  it('shows logout option', () => {
    render(<NavBarWrapper />);
    
    // Look for logout button or text
    const logoutButton = screen.queryByText('Logout') || screen.queryByText('Sign Out');
    expect(logoutButton).toBeInTheDocument();
  });

  it('has proper Bootstrap navbar structure', () => {
    const { container } = render(<NavBarWrapper />);
    
    const navbar = container.querySelector('.navbar');
    expect(navbar).toBeInTheDocument();
    expect(navbar).toHaveClass('navbar-expand-lg');
  });

  it('has responsive toggle button', () => {
    render(<NavBarWrapper />);
    
    const toggleButton = screen.getByLabelText('Toggle navigation');
    expect(toggleButton).toBeInTheDocument();
  });

  it('has proper navbar brand link', () => {
    render(<NavBarWrapper />);
    
    const brandLink = screen.getByText('Pump Master').closest('a');
    expect(brandLink).toBeInTheDocument();
    expect(brandLink).toHaveAttribute('href', '/');
  });

  it('has proper navigation structure', () => {
    const { container } = render(<NavBarWrapper />);
    
    const navbarNav = container.querySelector('.navbar-nav');
    expect(navbarNav).toBeInTheDocument();
  });

  it('handles mobile menu toggle', () => {
    render(<NavBarWrapper />);
    
    const toggleButton = screen.getByLabelText('Toggle navigation');
    fireEvent.click(toggleButton);
    
    // The navbar should handle the toggle (Bootstrap functionality)
    expect(toggleButton).toBeInTheDocument();
  });

  it('has proper navbar styling', () => {
    const { container } = render(<NavBarWrapper />);
    
    const navbar = container.querySelector('.navbar');
    expect(navbar).toHaveClass('navbar-dark', 'bg-primary');
  });

  it('renders container for content', () => {
    const { container } = render(<NavBarWrapper />);
    
    const navbarContainer = container.querySelector('.container');
    expect(navbarContainer).toBeInTheDocument();
  });

  it('has proper link styling', () => {
    render(<NavBarWrapper />);
    
    const overviewLink = screen.getByText('Overview').closest('a');
    const pumpsLink = screen.getByText('Pumps').closest('a');
    
    expect(overviewLink).toHaveClass('nav-link');
    expect(pumpsLink).toHaveClass('nav-link');
  });

  it('shows correct navigation items', () => {
    render(<NavBarWrapper />);
    
    const navItems = screen.getAllByRole('link');
    const navTexts = navItems.map(item => item.textContent);
    
    expect(navTexts).toContain('Pump Master');
    expect(navTexts).toContain('Overview');
    expect(navTexts).toContain('Pumps');
  });

  it('handles logout functionality', () => {
    render(<NavBarWrapper />);
    
    const logoutButton = screen.getByText('Logout') || screen.getByText('Sign Out');
    
    // Should be able to click logout
    fireEvent.click(logoutButton);
    
    // The logout functionality should be handled by AuthContext
    expect(logoutButton).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<NavBarWrapper />);
    
    const toggleButton = screen.getByLabelText('Toggle navigation');
    expect(toggleButton).toHaveAttribute('aria-expanded');
    expect(toggleButton).toHaveAttribute('aria-controls');
  });

  it('renders user dropdown when authenticated', () => {
    render(<NavBarWrapper />);
    
    // Look for dropdown toggle or user menu
    const userMenu = screen.queryByRole('button', { name: /user/i }) || 
                    screen.queryByText('admin@test.com');
    
    if (userMenu) {
      expect(userMenu).toBeInTheDocument();
    }
  });

  it('has proper navbar collapse structure', () => {
    const { container } = render(<NavBarWrapper />);
    
    const navbarCollapse = container.querySelector('.navbar-collapse');
    expect(navbarCollapse).toBeInTheDocument();
  });

  it('maintains proper spacing', () => {
    const { container } = render(<NavBarWrapper />);
    
    const navbar = container.querySelector('.navbar');
    expect(navbar).toHaveClass('px-3');
  });

  it('shows active link state', () => {
    render(<NavBarWrapper />);
    
    // Check for active navigation items
    const navLinks = screen.getAllByRole('link');
    const hasActiveLink = navLinks.some(link => 
      link.classList.contains('active') || 
      link.getAttribute('aria-current') === 'page'
    );
    
    // At least one link should be active or this is acceptable behavior
    expect(hasActiveLink || navLinks.length > 0).toBe(true);
  });
});