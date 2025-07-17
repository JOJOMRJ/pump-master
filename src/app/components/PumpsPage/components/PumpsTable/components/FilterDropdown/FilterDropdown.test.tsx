import { render, screen, fireEvent } from '@testing-library/react';
import { FilterDropdown } from './FilterDropdown';

describe('FilterDropdown', () => {
  const defaultProps = {
    filterType: 'type' as const,
    options: ['Centrifugal', 'Submersible', 'Jet'],
    selectedValues: new Set<string>(),
    onToggle: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders filter button', () => {
    render(<FilterDropdown {...defaultProps} />);
    const button = screen.getByRole('button', { name: 'Filter by Type' });
    expect(button).toBeInTheDocument();
  });

  it('renders filter button for area type', () => {
    render(<FilterDropdown {...defaultProps} filterType="areaBlock" />);
    const button = screen.getByRole('button', { name: 'Filter by Area' });
    expect(button).toBeInTheDocument();
  });

  it('shows dropdown when button is clicked', () => {
    render(<FilterDropdown {...defaultProps} />);
    const button = screen.getByRole('button', { name: 'Filter by Type' });
    
    fireEvent.click(button);
    
    expect(screen.getByText('Filter by Type')).toBeInTheDocument();
    expect(screen.getByText('Centrifugal')).toBeInTheDocument();
    expect(screen.getByText('Submersible')).toBeInTheDocument();
    expect(screen.getByText('Jet')).toBeInTheDocument();
  });

  it('displays checkboxes for all options', () => {
    render(<FilterDropdown {...defaultProps} />);
    const button = screen.getByRole('button', { name: 'Filter by Type' });
    
    fireEvent.click(button);
    
    defaultProps.options.forEach(option => {
      const checkbox = screen.getByRole('checkbox', { name: option });
      expect(checkbox).toBeInTheDocument();
      expect(checkbox).not.toBeChecked();
    });
  });

  it('shows selected values as checked', () => {
    const selectedValues = new Set(['Centrifugal', 'Jet']);
    render(<FilterDropdown {...defaultProps} selectedValues={selectedValues} />);
    const button = screen.getByRole('button', { name: 'Filter by Type' });
    
    fireEvent.click(button);
    
    expect(screen.getByRole('checkbox', { name: 'Centrifugal' })).toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'Submersible' })).not.toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'Jet' })).toBeChecked();
  });

  it('calls onToggle when checkbox is clicked', () => {
    const onToggle = vi.fn();
    render(<FilterDropdown {...defaultProps} onToggle={onToggle} />);
    const button = screen.getByRole('button', { name: 'Filter by Type' });
    
    fireEvent.click(button);
    
    const checkbox = screen.getByRole('checkbox', { name: 'Centrifugal' });
    fireEvent.click(checkbox);
    
    expect(onToggle).toHaveBeenCalledWith('Centrifugal');
  });

  it('closes dropdown when clicking outside', () => {
    render(<FilterDropdown {...defaultProps} />);
    const button = screen.getByRole('button', { name: 'Filter by Type' });
    
    fireEvent.click(button);
    expect(screen.getByText('Filter by Type')).toBeInTheDocument();
    
    fireEvent.click(document.body);
    expect(screen.queryByText('Filter by Type')).not.toBeInTheDocument();
  });

  it('handles area block filter type correctly', () => {
    const areaOptions = ['Area A', 'Area B', 'Area C'];
    render(
      <FilterDropdown
        {...defaultProps}
        filterType="areaBlock"
        options={areaOptions}
      />
    );
    const button = screen.getByRole('button', { name: 'Filter by Area' });
    
    fireEvent.click(button);
    
    expect(screen.getByText('Filter by Area')).toBeInTheDocument();
    areaOptions.forEach(option => {
      expect(screen.getByText(option)).toBeInTheDocument();
    });
  });

  it('handles empty options array', () => {
    render(<FilterDropdown {...defaultProps} options={[]} />);
    const button = screen.getByRole('button', { name: 'Filter by Type' });
    
    fireEvent.click(button);
    
    expect(screen.getByText('Filter by Type')).toBeInTheDocument();
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
  });
});