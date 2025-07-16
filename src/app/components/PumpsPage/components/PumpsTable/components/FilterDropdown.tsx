import React, { useRef, useState } from 'react';
import { Button, Overlay, Popover, Form } from 'react-bootstrap';

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
  const [show, setShow] = useState(false);
  const target = useRef<HTMLButtonElement | null>(null);

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
    <>
      <Button
        ref={target}
        variant="link"
        size="sm"
        className="p-0 border-0 text-light"
        style={{ fontSize: '0.8rem' }}
        onClick={() => setShow(!show)}
        aria-label={getTitle()}
      >
        <span style={{ fontSize: '1.2em' }}>▼</span>
      </Button>
      <Overlay
        show={show}
        target={target.current}
        placement="bottom"
        container={document.body}
        rootClose
        onHide={() => setShow(false)}
      >
        <Popover
          id={`filter-popover-${filterType}`}
          style={{ minWidth: 200, padding: 0 }}
        >
          <div className="px-3 py-2">
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
        </Popover>
      </Overlay>
    </>
  );
};

export default FilterDropdown;
