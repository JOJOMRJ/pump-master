import React, { useState, useEffect } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';

interface SearchModalProps {
  show: boolean;
  currentQuery?: string;
  onSubmit: (query: string) => void;
  onCancel: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  show,
  currentQuery = '',
  onSubmit,
  onCancel,
}) => {
  const [query, setQuery] = useState(currentQuery);

  useEffect(() => {
    setQuery(currentQuery);
  }, [currentQuery, show]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(query.trim());
  };

  const handleClear = () => {
    setQuery('');
    onSubmit('');
  };

  return (
    <Modal show={show} onHide={onCancel} centered>
      <Modal.Header closeButton>
        <Modal.Title>Search Pumps</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Search by name, type, or area</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter search terms..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              autoFocus
            />
            <Form.Text className="text-muted">
              Search will look for matches in pump name, type, and area/block
              fields.
            </Form.Text>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          {currentQuery && (
            <Button variant="outline-danger" onClick={handleClear}>
              Clear Search
            </Button>
          )}
          <Button variant="primary" type="submit">
            Search
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default SearchModal;
