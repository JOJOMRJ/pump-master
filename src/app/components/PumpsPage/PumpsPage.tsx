import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Badge,
  Form,
  Container,
  Row,
  Col,
} from 'react-bootstrap';
import type { PumpDevice } from '../../types/PumpDevice';
import { mockPumpService } from '../../services/mockPumpService';
import { Loading } from '../../../shared/components';
import { RiDeleteBin5Fill } from 'react-icons/ri';
import { IoSearch } from 'react-icons/io5';
import { HiOutlineFilter } from 'react-icons/hi';
import { TiPencil } from 'react-icons/ti';

export const PumpsPage: React.FC = () => {
  const [pumps, setPumps] = useState<PumpDevice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPumps = async () => {
      try {
        setLoading(true);
        const response = await mockPumpService.getPumps();

        if (!response.success || !response.data) {
          console.error('Failed to load pumps:', response.error);
          setPumps([]);
          return;
        }

        setPumps(response.data);
      } catch (err) {
        console.error('Error fetching pumps:', err);
        setPumps([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPumps();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <Container>
      {/* Page Header */}
      <Row className="mb-4">
        <Col xs={12}>
          <div className="d-flex justify-content-between align-items-center">
            <h2 className="mb-0">Pumps</h2>
            <Button variant="secondary" size="sm">
              New Pump
            </Button>
          </div>
        </Col>
      </Row>

      {/* Toolbar */}
      <Row className="mb-3">
        <Col xs={12}>
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex gap-2">
              <Button variant="outline-secondary" className="border-0">
                <IoSearch />
              </Button>
              <Button variant="outline-secondary" className="border-0">
                <HiOutlineFilter />
              </Button>
              <Button variant="outline-secondary" className="border-0">
                <TiPencil />
              </Button>
            </div>
            <Button
              variant="primary"
              style={{ display: 'flex', alignItems: 'center' }}
            >
              <RiDeleteBin5Fill className="me-1" />
              <span>Delete</span>
            </Button>
          </div>
        </Col>
      </Row>

      {/* Pumps Table */}
      <Row>
        <Col xs={12}>
          <Table striped hover responsive>
            <thead className="table-dark">
              <tr>
                <th scope="col">
                  <Form.Check type="checkbox" />
                </th>
                <th scope="col">Pump Name</th>
                <th scope="col">Type</th>
                <th scope="col">Area/Block</th>
                <th scope="col">Latitude</th>
                <th scope="col">Longitude</th>
                <th scope="col">Flow Rate</th>
                <th scope="col">Offset</th>
                <th scope="col">Current Pressure</th>
                <th scope="col">Min Pressure</th>
                <th scope="col">Max Pressure</th>
              </tr>
            </thead>
            <tbody>
              {pumps.map(pump => (
                <tr key={pump.id}>
                  <td>
                    <Form.Check type="checkbox" />
                  </td>
                  <td>
                    <strong>{pump.name}</strong>
                  </td>
                  <td>
                    <Badge bg="secondary">{pump.type}</Badge>
                  </td>
                  <td>{pump.areaBlock}</td>
                  <td className="text-end">
                    <small className="text-muted">{pump.latitude}</small>
                  </td>
                  <td className="text-end">
                    <small className="text-muted">{pump.longitude}</small>
                  </td>
                  <td className="text-end">
                    <strong>{pump.flowRate.value.toLocaleString()}</strong>
                    <small className="text-muted ms-1">
                      {pump.flowRate.unit}
                    </small>
                  </td>
                  <td className="text-end">
                    <strong>{pump.offset.value}</strong>
                    <small className="text-muted ms-1">
                      {pump.offset.unit}
                    </small>
                  </td>
                  <td className="text-end">
                    <strong>{pump.currentPressure.value}</strong>
                    <small className="text-muted ms-1">
                      {pump.currentPressure.unit}
                    </small>
                  </td>
                  <td className="text-end">
                    <strong>{pump.minPressure.value}</strong>
                    <small className="text-muted ms-1">
                      {pump.minPressure.unit}
                    </small>
                  </td>
                  <td className="text-end">
                    <strong>{pump.maxPressure.value}</strong>
                    <small className="text-muted ms-1">
                      {pump.maxPressure.unit}
                    </small>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>

      {/* Summary */}
      <Row className="mt-3">
        <Col xs={12}>
          <div className="text-muted">Showing {pumps.length} pumps</div>
        </Col>
      </Row>
    </Container>
  );
};

export default PumpsPage;
