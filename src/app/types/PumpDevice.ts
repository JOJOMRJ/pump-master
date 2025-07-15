export interface PumpDevice {
  id: string;
  name: string; // Pump 1, Pump 2, etc.
  type: string; // Centrifugal, Submersible, Diaphragm, Rotary, Peristaltic
  areaBlock: string; // Area A, Area B, etc.
  latitude: number; // 34.0522
  longitude: number; // -118.2437
  flowRate: {
    value: number; // 1000, 800, 600, etc.
    unit: 'GPM'; // 固定单位 GPM
  };
  offset: {
    value: number; // 5, 3, 2, 1, 0, 6, 4
    unit: 'sec' | 'ft'; // sec 或 ft
  };
  currentPressure: {
    value: number; // 150, 130, 110, etc.
    unit: 'psi'; // 固定单位 psi
  };
  minPressure: {
    value: number; // 120, 100, 80, etc.
    unit: 'psi';
  };
  maxPressure: {
    value: number; // 180, 160, 140, etc.
    unit: 'psi';
  };
}

export type PumpType =
  | 'Centrifugal'
  | 'Submersible'
  | 'Diaphragm'
  | 'Rotary'
  | 'Peristaltic';
export type PumpStatus = 'active' | 'inactive' | 'maintenance';
