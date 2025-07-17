import { render, screen } from '@testing-library/react';
import { Loading } from './Loading';

describe('Loading', () => {
  it('renders with default props', () => {
    render(<Loading />);

    const spinner = screen.getByRole('status');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass('spinner-border');
    expect(spinner).toHaveClass('text-primary');
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders with custom text', () => {
    render(<Loading message="Please wait..." />);

    expect(screen.getByText('Please wait...')).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<Loading />);

    const spinner = screen.getByRole('status');
    expect(spinner).toBeInTheDocument();

    const hiddenText = screen.getByText('Loading...');
    expect(hiddenText).toHaveClass('visually-hidden');
  });

  it('applies custom height', () => {
    const { container } = render(<Loading height="300px" />);

    const wrapper = container.firstChild;
    expect(wrapper).toHaveStyle('height: 300px');
  });

  it('applies custom size', () => {
    render(<Loading size="sm" />);

    const spinner = screen.getByRole('status');
    expect(spinner).toHaveClass('spinner-border-sm');
  });

  it('applies custom variant', () => {
    render(<Loading variant="danger" />);

    const spinner = screen.getByRole('status');
    expect(spinner).toHaveClass('text-danger');
  });

  it('has proper container classes', () => {
    const { container } = render(<Loading />);

    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('d-flex');
    expect(wrapper).toHaveClass('justify-content-center');
    expect(wrapper).toHaveClass('align-items-center');
  });

  it('has proper default height', () => {
    const { container } = render(<Loading />);

    const wrapper = container.firstChild;
    expect(wrapper).toHaveStyle('height: 200px');
  });

  it('renders spinner with proper animation', () => {
    render(<Loading />);

    const spinner = screen.getByRole('status');
    expect(spinner).toHaveClass('spinner-border');
  });

  it('handles different variants correctly', () => {
    const { rerender } = render(<Loading variant="success" />);

    expect(screen.getByRole('status')).toHaveClass('text-success');

    rerender(<Loading variant="warning" />);
    expect(screen.getByRole('status')).toHaveClass('text-warning');
  });

  it('works with empty message', () => {
    render(<Loading message="" />);

    const spinner = screen.getByRole('status');
    expect(spinner).toBeInTheDocument();

    const hiddenText = spinner.querySelector('.visually-hidden');
    expect(hiddenText).toBeInTheDocument();
    expect(hiddenText).toHaveTextContent('');
  });

  it('maintains proper structure', () => {
    const { container } = render(<Loading />);

    const wrapper = container.firstChild;
    expect(wrapper).toBeInTheDocument();
    expect(wrapper?.firstChild).toHaveClass('spinner-border');
  });
});
