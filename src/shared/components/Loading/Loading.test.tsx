import { render, screen } from '@testing-library/react';
import { Loading } from './Loading';

describe('Loading', () => {
  it('renders loading spinner by default', () => {
    render(<Loading />);
    
    const spinner = screen.getByRole('status');
    expect(spinner).toBeInTheDocument();
  });

  it('renders with default loading text', () => {
    render(<Loading />);
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders with custom text', () => {
    render(<Loading text="Please wait..." />);
    
    expect(screen.getByText('Please wait...')).toBeInTheDocument();
  });

  it('has proper Bootstrap spinner classes', () => {
    render(<Loading />);
    
    const spinner = screen.getByRole('status');
    expect(spinner).toHaveClass('spinner-border');
  });

  it('has proper accessibility attributes', () => {
    render(<Loading />);
    
    const spinner = screen.getByRole('status');
    expect(spinner).toHaveAttribute('aria-hidden', 'true');
  });

  it('has screen reader text', () => {
    render(<Loading />);
    
    const srText = screen.getByText('Loading...');
    expect(srText).toHaveClass('visually-hidden');
  });

  it('centers content by default', () => {
    const { container } = render(<Loading />);
    
    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('d-flex', 'justify-content-center', 'align-items-center');
  });

  it('applies custom className', () => {
    const { container } = render(<Loading className="custom-class" />);
    
    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('custom-class');
  });

  it('maintains default classes with custom className', () => {
    const { container } = render(<Loading className="custom-class" />);
    
    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('d-flex', 'justify-content-center', 'align-items-center', 'custom-class');
  });

  it('has proper spacing', () => {
    const { container } = render(<Loading />);
    
    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('py-4');
  });

  it('renders spinner with primary color', () => {
    render(<Loading />);
    
    const spinner = screen.getByRole('status');
    expect(spinner).toHaveClass('text-primary');
  });

  it('has proper gap between spinner and text', () => {
    const { container } = render(<Loading />);
    
    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('gap-2');
  });

  it('renders text with proper styling', () => {
    render(<Loading />);
    
    const text = screen.getByText('Loading...');
    expect(text).toHaveClass('text-muted');
  });

  it('works with empty text', () => {
    render(<Loading text="" />);
    
    const spinner = screen.getByRole('status');
    expect(spinner).toBeInTheDocument();
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
  });

  it('handles long loading text', () => {
    const longText = 'Please wait while we load your data...';
    render(<Loading text={longText} />);
    
    expect(screen.getByText(longText)).toBeInTheDocument();
  });

  it('has proper structure', () => {
    const { container } = render(<Loading />);
    
    const wrapper = container.firstChild;
    const spinner = wrapper?.querySelector('.spinner-border');
    const text = wrapper?.querySelector('.text-muted');
    
    expect(spinner).toBeInTheDocument();
    expect(text).toBeInTheDocument();
  });

  it('can be used inline', () => {
    const { container } = render(<Loading className="d-inline-flex" />);
    
    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('d-inline-flex');
  });

  it('has proper minimum height', () => {
    const { container } = render(<Loading />);
    
    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('py-4');
  });

  it('renders consistently', () => {
    const { container: container1 } = render(<Loading />);
    const { container: container2 } = render(<Loading />);
    
    expect(container1.innerHTML).toBe(container2.innerHTML);
  });
});