import React from 'react';
import { Dropdown, Form } from 'react-bootstrap';

interface FilterDropdownProps {
  filterType: 'type' | 'areaBlock';
  options: string[];
  selectedValues: Set<string>;
  onToggle: (value: string) => void;
}

export const FilterDropdown: React.FC<FilterDropdownProps> = ({
  filterType,
  options,
  selectedValues,
  onToggle,
}) => {
  const getTitle = () => {
    switch (filterType) {
      case 'type':
        return 'Filter by Type';
      case 'areaBlock':
        return 'Filter by Area';
      default:
        return 'Filter';
    }
  };

  return (
    <Dropdown>
      <Dropdown.Toggle
        variant="link"
        size="sm"
        className="p-0 border-0 text-light"
        style={{ fontSize: '0.8rem' }}
      ></Dropdown.Toggle>
      <Dropdown.Menu>
        <div className="px-3 py-2" style={{ minWidth: '200px' }}>
          <div className="fw-bold mb-2">{getTitle()}</div>
          {options.map(option => (
            <Form.Check
              key={option}
              type="checkbox"
              id={`${filterType}-${option}`}
              label={option}
              checked={selectedValues.has(option)}
              onChange={() => onToggle(option)}
              className="mb-1"
            />
          ))}
        </div>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default FilterDropdown;
