import { renderHook, act } from '@testing-library/react';
import { useFilter } from './useFilter';
import type { PumpDevice } from '../types';

describe('useFilter', () => {
  const mockPumps: PumpDevice[] = [
    {
      id: 'pump-1',
      name: 'Pump 1',
      type: 'Centrifugal',
      areaBlock: 'Area A',
      latitude: 40.7128,
      longitude: -74.006,
      flowRate: { value: 150, unit: 'GPM' },
      offset: { value: 30, unit: 'sec' },
      currentPressure: { value: 45, unit: 'psi' },
      minPressure: { value: 35, unit: 'psi' },
      maxPressure: { value: 55, unit: 'psi' },
    },
    {
      id: 'pump-2',
      name: 'Pump 2',
      type: 'Submersible',
      areaBlock: 'Area B',
      latitude: 40.7589,
      longitude: -73.9851,
      flowRate: { value: 120, unit: 'GPM' },
      offset: { value: 25, unit: 'sec' },
      currentPressure: { value: 40, unit: 'psi' },
      minPressure: { value: 30, unit: 'psi' },
      maxPressure: { value: 50, unit: 'psi' },
    },
    {
      id: 'pump-3',
      name: 'Pump 3',
      type: 'Centrifugal',
      areaBlock: 'Area A',
      latitude: 40.7505,
      longitude: -73.9934,
      flowRate: { value: 180, unit: 'GPM' },
      offset: { value: 35, unit: 'sec' },
      currentPressure: { value: 50, unit: 'psi' },
      minPressure: { value: 40, unit: 'psi' },
      maxPressure: { value: 60, unit: 'psi' },
    },
  ];

  const extractors = {
    types: (pump: PumpDevice) => pump.type,
    areas: (pump: PumpDevice) => pump.areaBlock,
  };

  it('initializes with empty filters', () => {
    const { result } = renderHook(() => useFilter(mockPumps, extractors));

    expect(result.current.filters.types).toEqual(new Set());
    expect(result.current.filters.areas).toEqual(new Set());
  });

  it('generates filter options from pumps', () => {
    const { result } = renderHook(() => useFilter(mockPumps, extractors));

    expect(result.current.filterOptions.types).toEqual([
      'Centrifugal',
      'Submersible',
    ]);
    expect(result.current.filterOptions.areas).toEqual(['Area A', 'Area B']);
  });

  it('starts with filter mode disabled', () => {
    const { result } = renderHook(() => useFilter(mockPumps, extractors));

    expect(result.current.filterMode).toBe(false);
  });

  it('toggles filter mode', () => {
    const { result } = renderHook(() => useFilter(mockPumps, extractors));

    act(() => {
      result.current.toggleFilterMode();
    });

    expect(result.current.filterMode).toBe(true);
  });

  it('toggles type filter', () => {
    const { result } = renderHook(() => useFilter(mockPumps, extractors));

    act(() => {
      result.current.toggleTypeFilter('Centrifugal');
    });

    expect(result.current.filters.types.has('Centrifugal')).toBe(true);
  });

  it('toggles area filter', () => {
    const { result } = renderHook(() => useFilter(mockPumps, extractors));

    act(() => {
      result.current.toggleAreaFilter('Area A');
    });

    expect(result.current.filters.areas.has('Area A')).toBe(true);
  });

  it('removes filter when toggled off', () => {
    const { result } = renderHook(() => useFilter(mockPumps, extractors));

    act(() => {
      result.current.toggleTypeFilter('Centrifugal');
    });

    expect(result.current.filters.types.has('Centrifugal')).toBe(true);

    act(() => {
      result.current.toggleTypeFilter('Centrifugal');
    });

    expect(result.current.filters.types.has('Centrifugal')).toBe(false);
  });

  it('clears all filters', () => {
    const { result } = renderHook(() => useFilter(mockPumps, extractors));

    act(() => {
      result.current.toggleTypeFilter('Centrifugal');
      result.current.toggleAreaFilter('Area A');
    });

    expect(result.current.filters.types.size).toBe(1);
    expect(result.current.filters.areas.size).toBe(1);

    act(() => {
      result.current.clearFilters();
    });

    expect(result.current.filters.types.size).toBe(0);
    expect(result.current.filters.areas.size).toBe(0);
  });

  it('clears type filters only', () => {
    const { result } = renderHook(() => useFilter(mockPumps, extractors));

    act(() => {
      result.current.toggleTypeFilter('Centrifugal');
      result.current.toggleAreaFilter('Area A');
    });

    act(() => {
      result.current.clearTypeFilters();
    });

    expect(result.current.filters.types.size).toBe(0);
    expect(result.current.filters.areas.size).toBe(1);
  });

  it('clears area filters only', () => {
    const { result } = renderHook(() => useFilter(mockPumps, extractors));

    act(() => {
      result.current.toggleTypeFilter('Centrifugal');
      result.current.toggleAreaFilter('Area A');
    });

    act(() => {
      result.current.clearAreaFilters();
    });

    expect(result.current.filters.types.size).toBe(1);
    expect(result.current.filters.areas.size).toBe(0);
  });

  it('reports has active filters correctly', () => {
    const { result } = renderHook(() => useFilter(mockPumps, extractors));

    expect(result.current.hasActiveFilters).toBe(false);

    act(() => {
      result.current.toggleTypeFilter('Centrifugal');
    });

    expect(result.current.hasActiveFilters).toBe(true);
  });

  it('reports active filter count correctly', () => {
    const { result } = renderHook(() => useFilter(mockPumps, extractors));

    expect(result.current.activeFilterCount).toBe(0);

    act(() => {
      result.current.toggleTypeFilter('Centrifugal');
      result.current.toggleAreaFilter('Area A');
    });

    expect(result.current.activeFilterCount).toBe(2);
  });

  it('returns filter params correctly', () => {
    const { result } = renderHook(() => useFilter(mockPumps, extractors));

    act(() => {
      result.current.toggleTypeFilter('Centrifugal');
      result.current.toggleAreaFilter('Area A');
    });

    const params = result.current.getFilterParams();
    expect(params.types).toEqual(['Centrifugal']);
    expect(params.areas).toEqual(['Area A']);
  });

  it('handles empty pumps array', () => {
    const { result } = renderHook(() => useFilter([], extractors));

    expect(result.current.filterOptions.types).toEqual([]);
    expect(result.current.filterOptions.areas).toEqual([]);
  });

  it('updates filter options when pumps change', () => {
    const { result, rerender } = renderHook(
      ({ pumps }) => useFilter(pumps, extractors),
      { initialProps: { pumps: mockPumps.slice(0, 2) } }
    );

    expect(result.current.filterOptions.types).toEqual([
      'Centrifugal',
      'Submersible',
    ]);
    expect(result.current.filterOptions.areas).toEqual(['Area A', 'Area B']);

    rerender({ pumps: mockPumps });

    expect(result.current.filterOptions.types).toEqual([
      'Centrifugal',
      'Submersible',
    ]);
    expect(result.current.filterOptions.areas).toEqual(['Area A', 'Area B']);
  });
});
