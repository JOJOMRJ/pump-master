import type { PumpDevice, PaginationParams, PaginatedResponse } from '../types';
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

// Get pumps with pagination
export const getPumps = async (
  params?: PaginationParams
): Promise<PumpServiceResponse<PaginatedResponse<PumpDevice>>> => {
  try {
    await simulateDelay();

    // Default pagination params
    const page = params?.page || 1;
    const pageSize = params?.pageSize || 10;
    const searchQuery = params?.searchQuery?.trim() || '';

    // Filter data based on search query and filters
    let filteredPumps = MOCK_PUMPS;

    // Apply search filter
    if (searchQuery) {
      filteredPumps = filteredPumps.filter(
        pump =>
          pump.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          pump.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
          pump.areaBlock.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply filters
    if (params?.filters) {
      const { types, areas } = params.filters;

      if (types && types.length > 0) {
        filteredPumps = filteredPumps.filter(pump => types.includes(pump.type));
      }

      if (areas && areas.length > 0) {
        filteredPumps = filteredPumps.filter(pump =>
          areas.includes(pump.areaBlock)
        );
      }
    }

    // Calculate pagination
    const total = filteredPumps.length;
    const totalPages = Math.ceil(total / pageSize);
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = filteredPumps.slice(startIndex, endIndex);

    return {
      success: true,
      data: {
        data: paginatedData,
        pagination: {
          page,
          pageSize,
          total,
          totalPages,
        },
      },
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

// Legacy search function - now handled by getPumps with params
export const searchPumps = async (
  query: string
): Promise<PumpServiceResponse<PumpDevice[]>> => {
  try {
    const result = await getPumps({
      page: 1,
      pageSize: 1000,
      searchQuery: query,
    });

    if (!result.success || !result.data) {
      return {
        success: false,
        error: result.error || {
          code: 'SEARCH_ERROR',
          message: 'Search failed',
        },
      };
    }

    return {
      success: true,
      data: result.data.data,
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
