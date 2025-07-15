import type { PumpDevice } from '../../types/PumpDevice';

export const MOCK_PUMPS: PumpDevice[] = [
  {
    id: 'pump-001',
    name: 'Pump 1',
    type: 'Centrifugal',
    areaBlock: 'Area A',
    latitude: 34.0522,
    longitude: -118.2437,
    flowRate: { value: 1000, unit: 'GPM' },
    offset: { value: 5, unit: 'sec' },
    currentPressure: { value: 150, unit: 'psi' },
    minPressure: { value: 120, unit: 'psi' },
    maxPressure: { value: 180, unit: 'psi' },
  },
  {
    id: 'pump-002',
    name: 'Pump 2',
    type: 'Submersible',
    areaBlock: 'Area B',
    latitude: 34.0525,
    longitude: -118.244,
    flowRate: { value: 800, unit: 'GPM' },
    offset: { value: 3, unit: 'ft' },
    currentPressure: { value: 130, unit: 'psi' },
    minPressure: { value: 100, unit: 'psi' },
    maxPressure: { value: 160, unit: 'psi' },
  },
  {
    id: 'pump-003',
    name: 'Pump 3',
    type: 'Diaphragm',
    areaBlock: 'Area C',
    latitude: 34.053,
    longitude: -118.2445,
    flowRate: { value: 600, unit: 'GPM' },
    offset: { value: 2, unit: 'sec' },
    currentPressure: { value: 110, unit: 'psi' },
    minPressure: { value: 80, unit: 'psi' },
    maxPressure: { value: 140, unit: 'psi' },
  },
  {
    id: 'pump-004',
    name: 'Pump 4',
    type: 'Rotary',
    areaBlock: 'Area D',
    latitude: 34.0535,
    longitude: -118.245,
    flowRate: { value: 750, unit: 'GPM' },
    offset: { value: 1, unit: 'ft' },
    currentPressure: { value: 140, unit: 'psi' },
    minPressure: { value: 110, unit: 'psi' },
    maxPressure: { value: 170, unit: 'psi' },
  },
  {
    id: 'pump-005',
    name: 'Pump 5',
    type: 'Peristaltic',
    areaBlock: 'Area E',
    latitude: 34.054,
    longitude: -118.2455,
    flowRate: { value: 500, unit: 'GPM' },
    offset: { value: 0, unit: 'sec' },
    currentPressure: { value: 90, unit: 'psi' },
    minPressure: { value: 60, unit: 'psi' },
    maxPressure: { value: 120, unit: 'psi' },
  },
  {
    id: 'pump-006',
    name: 'Pump 6',
    type: 'Centrifugal',
    areaBlock: 'Area F',
    latitude: 34.0545,
    longitude: -118.246,
    flowRate: { value: 1200, unit: 'GPM' },
    offset: { value: 6, unit: 'ft' },
    currentPressure: { value: 160, unit: 'psi' },
    minPressure: { value: 130, unit: 'psi' },
    maxPressure: { value: 190, unit: 'psi' },
  },
  {
    id: 'pump-007',
    name: 'Pump 7',
    type: 'Submersible',
    areaBlock: 'Area G',
    latitude: 34.055,
    longitude: -118.2465,
    flowRate: { value: 900, unit: 'GPM' },
    offset: { value: 4, unit: 'sec' },
    currentPressure: { value: 135, unit: 'psi' },
    minPressure: { value: 105, unit: 'psi' },
    maxPressure: { value: 165, unit: 'psi' },
  },
  {
    id: 'pump-008',
    name: 'Pump 8',
    type: 'Diaphragm',
    areaBlock: 'Area H',
    latitude: 34.0555,
    longitude: -118.247,
    flowRate: { value: 650, unit: 'GPM' },
    offset: { value: 3, unit: 'ft' },
    currentPressure: { value: 115, unit: 'psi' },
    minPressure: { value: 85, unit: 'psi' },
    maxPressure: { value: 145, unit: 'psi' },
  },
  {
    id: 'pump-009',
    name: 'Pump 9',
    type: 'Rotary',
    areaBlock: 'Area I',
    latitude: 34.056,
    longitude: -118.2475,
    flowRate: { value: 800, unit: 'GPM' },
    offset: { value: 2, unit: 'sec' },
    currentPressure: { value: 145, unit: 'psi' },
    minPressure: { value: 115, unit: 'psi' },
    maxPressure: { value: 175, unit: 'psi' },
  },
  {
    id: 'pump-010',
    name: 'Pump 10',
    type: 'Peristaltic',
    areaBlock: 'Area J',
    latitude: 34.0565,
    longitude: -118.248,
    flowRate: { value: 550, unit: 'GPM' },
    offset: { value: 1, unit: 'ft' },
    currentPressure: { value: 95, unit: 'psi' },
    minPressure: { value: 65, unit: 'psi' },
    maxPressure: { value: 125, unit: 'psi' },
  },
];

// Helper function to get pumps by area
export const getPumpsByArea = (area: string): PumpDevice[] => {
  return MOCK_PUMPS.filter(pump => pump.areaBlock === area);
};

// Helper function to get pumps by type
export const getPumpsByType = (type: string): PumpDevice[] => {
  return MOCK_PUMPS.filter(pump => pump.type === type);
};

// Helper function to get pumps by flow rate range
export const getPumpsByFlowRateRange = (
  minFlow: number,
  maxFlow: number
): PumpDevice[] => {
  return MOCK_PUMPS.filter(
    pump => pump.flowRate.value >= minFlow && pump.flowRate.value <= maxFlow
  );
};
