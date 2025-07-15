import type { PumpDevice } from '../types/PumpDevice';
import { MOCK_PUMPS } from './data/mockPumps';

// Simple network delay simulation
const simulateDelay = (): Promise<void> => {
  const delay = Math.random() * 500 + 200; // 200-700ms
  return new Promise(resolve => setTimeout(resolve, delay));
};

// Response interface for API calls
interface PumpServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

// Get all pumps
export const getPumps = async (): Promise<
  PumpServiceResponse<PumpDevice[]>
> => {
  try {
    // Simulate network delay
    await simulateDelay();

    return {
      success: true,
      data: MOCK_PUMPS,
    };
  } catch {
    return {
      success: false,
      error: {
        code: 'FETCH_ERROR',
        message: 'Failed to fetch pumps',
      },
    };
  }
};

// Get pump by ID
export const getPumpById = async (
  id: string
): Promise<PumpServiceResponse<PumpDevice>> => {
  try {
    await simulateDelay();

    const pump = MOCK_PUMPS.find(p => p.id === id);

    if (!pump) {
      return {
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Pump not found',
        },
      };
    }

    return {
      success: true,
      data: pump,
    };
  } catch {
    return {
      success: false,
      error: {
        code: 'FETCH_ERROR',
        message: 'Failed to fetch pump',
      },
    };
  }
};

// Search pumps by name
export const searchPumps = async (
  query: string
): Promise<PumpServiceResponse<PumpDevice[]>> => {
  try {
    await simulateDelay();

    const filteredPumps = MOCK_PUMPS.filter(
      pump =>
        pump.name.toLowerCase().includes(query.toLowerCase()) ||
        pump.type.toLowerCase().includes(query.toLowerCase()) ||
        pump.areaBlock.toLowerCase().includes(query.toLowerCase())
    );

    return {
      success: true,
      data: filteredPumps,
    };
  } catch {
    return {
      success: false,
      error: {
        code: 'SEARCH_ERROR',
        message: 'Failed to search pumps',
      },
    };
  }
};

// Filter pumps by criteria
export const filterPumps = async (filters: {
  type?: string;
  area?: string;
  flowRateMin?: number;
  flowRateMax?: number;
  pressureMin?: number;
  pressureMax?: number;
}): Promise<PumpServiceResponse<PumpDevice[]>> => {
  try {
    await simulateDelay();

    let filteredPumps = MOCK_PUMPS;

    if (filters.type) {
      filteredPumps = filteredPumps.filter(pump => pump.type === filters.type);
    }

    if (filters.area) {
      filteredPumps = filteredPumps.filter(
        pump => pump.areaBlock === filters.area
      );
    }

    if (filters.flowRateMin !== undefined) {
      filteredPumps = filteredPumps.filter(
        pump => pump.flowRate.value >= filters.flowRateMin!
      );
    }

    if (filters.flowRateMax !== undefined) {
      filteredPumps = filteredPumps.filter(
        pump => pump.flowRate.value <= filters.flowRateMax!
      );
    }

    if (filters.pressureMin !== undefined) {
      filteredPumps = filteredPumps.filter(
        pump => pump.currentPressure.value >= filters.pressureMin!
      );
    }

    if (filters.pressureMax !== undefined) {
      filteredPumps = filteredPumps.filter(
        pump => pump.currentPressure.value <= filters.pressureMax!
      );
    }

    return {
      success: true,
      data: filteredPumps,
    };
  } catch {
    return {
      success: false,
      error: {
        code: 'FILTER_ERROR',
        message: 'Failed to filter pumps',
      },
    };
  }
};

// Delete pumps by IDs
export const deletePumps = async (
  ids: string[]
): Promise<PumpServiceResponse<string[]>> => {
  try {
    await simulateDelay();

    // Check if all IDs exist
    const existingIds = ids.filter(id =>
      MOCK_PUMPS.some(pump => pump.id === id)
    );

    if (existingIds.length === 0) {
      return {
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'No pumps found with the provided IDs',
        },
      };
    }

    // Remove pumps from the mock data
    // Note: In a real app, this would be a database operation
    for (let i = MOCK_PUMPS.length - 1; i >= 0; i--) {
      if (existingIds.includes(MOCK_PUMPS[i].id)) {
        MOCK_PUMPS.splice(i, 1);
      }
    }

    return {
      success: true,
      data: existingIds,
    };
  } catch {
    return {
      success: false,
      error: {
        code: 'DELETE_ERROR',
        message: 'Failed to delete pumps',
      },
    };
  }
};

// Default export containing all methods
export const mockPumpService = {
  getPumps,
  getPumpById,
  searchPumps,
  filterPumps,
  deletePumps,
};
