import React from 'react';
import { Row, Col, Card, Form } from 'react-bootstrap';
import type { PumpDevice } from '../../../../../../types';
import { AppMode } from '../../../../../../types';
import { formatValue } from '../../utils';

interface MobileCardViewProps {
  pumps: PumpDevice[];
  selectedPumps: Set<string>;
  mode: AppMode;
  loading?: boolean;
  onRowSelect: (pumpId: string, checked: boolean) => void;
  onRowClick: (pumpId: string) => void;
}

export const MobileCardView: React.FC<MobileCardViewProps> = ({
  pumps,
  selectedPumps,
  mode,
  loading = false,
  onRowSelect,
  onRowClick,
}) => {
  if (pumps.length === 0) {
    return (
      <Row>
        <Col xs={12}>
          <Card className="text-center">
            <Card.Body className="py-5">
              <Card.Text className="text-muted">No pumps found</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    );
  }

  return (
    <Row>
      {pumps.map(pump => {
        const isSelected =
          mode === AppMode.DELETE && selectedPumps.has(pump.id);
        const isEditable = mode === AppMode.EDIT;

        return (
          <Col xs={12} key={pump.id} className="mb-3">
            <Card
              className={`${isSelected ? 'border-primary' : ''} ${isEditable ? 'pump-card-clickable' : ''}`}
              onClick={() => onRowClick(pump.id)}
              style={isEditable ? { cursor: 'pointer' } : {}}
            >
              <Card.Body>
                <div
                  className="d-flex justify-content-between align-items-center mb-2"
                  style={{ minHeight: '24px' }}
                >
                  <Card.Title className="h6 mb-0">{pump.name}</Card.Title>
                  <div style={{ width: '24px' }}>
                    {mode === AppMode.DELETE && (
                      <Form.Check
                        type="checkbox"
                        checked={selectedPumps.has(pump.id)}
                        onChange={e => onRowSelect(pump.id, e.target.checked)}
                        disabled={loading}
                        onClick={e => e.stopPropagation()}
                      />
                    )}
                  </div>
                </div>
                <Card.Text className="mb-2">
                  <small className="text-muted">
                    <strong>Type:</strong> {pump.type} | <strong>Area:</strong>{' '}
                    {pump.areaBlock}
                  </small>
                </Card.Text>
                <Card.Text className="mb-0">
                  <small>
                    <strong>Flow Rate:</strong> {formatValue(pump.flowRate)} |
                    <strong> Pressure:</strong>{' '}
                    {formatValue(pump.currentPressure)}
                  </small>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        );
      })}
    </Row>
  );
};

export default MobileCardView;
