import React from 'react';
import { Button, Row, Col } from 'react-bootstrap';

interface PageHeaderProps {
  title: string;
  onNewPump?: () => void;
  showNewButton?: boolean;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  onNewPump,
  showNewButton = true,
}) => {
  return (
    <Row className="mb-4">
      <Col xs={12}>
        <div className="d-flex justify-content-between align-items-center">
          <h2 className="mb-0">{title}</h2>
          {showNewButton && (
            <Button variant="secondary" size="sm" onClick={onNewPump}>
              New Pump
            </Button>
          )}
        </div>
      </Col>
    </Row>
  );
};

export default PageHeader;
