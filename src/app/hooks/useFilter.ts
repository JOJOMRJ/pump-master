import { useState, useCallback, useMemo, useEffect } from 'react';

export interface FilterState {
  types: Set<string>;
  areas: Set<string>;
}

export interface FilterOptions {
  types: string[];
  areas: string[];
}

export interface FilterExtractors<T> {
  types: (item: T) => string;
  areas: (item: T) => string;
}

export interface UseFilterReturn {
  // State
  filters: FilterState;
  filterMode: boolean;

  // Computed
  hasActiveFilters: boolean;
  activeFilterCount: number;
  filterOptions: FilterOptions;

  // Actions
  toggleFilterMode: () => void;
  toggleTypeFilter: (type: string) => void;
  toggleAreaFilter: (area: string) => void;
  clearFilters: () => void;
  clearTypeFilters: () => void;
  clearAreaFilters: () => void;

  // Utils
  getFilterParams: () => { types?: string[]; areas?: string[] };
}

export const useFilter = <T>(
  data: T[],
  extractors: FilterExtractors<T>,
  staticOptionsLoader?: () => Promise<FilterOptions>
): UseFilterReturn => {
  const [filterMode, setFilterMode] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    types: new Set(),
    areas: new Set(),
  });
  const [staticOptions, setStaticOptions] = useState<FilterOptions>({
    types: [],
    areas: [],
  });

  // 加载静态筛选选项
  useEffect(() => {
    if (staticOptionsLoader) {
      staticOptionsLoader().then(options => {
        setStaticOptions(options);
      });
    }
  }, [staticOptionsLoader]);

  // 从数据中提取筛选选项 - 使用staticOptions如果提供了，否则从data中提取
  const filterOptions = useMemo(() => {
    if (staticOptions.types.length > 0 || staticOptions.areas.length > 0) {
      return staticOptions;
    }

    const types = new Set<string>();
    const areas = new Set<string>();

    data.forEach((item: T) => {
      const type = extractors.types(item);
      const area = extractors.areas(item);

      if (type) types.add(type);
      if (area) areas.add(area);
    });

    return {
      types: Array.from(types).sort(),
      areas: Array.from(areas).sort(),
    };
  }, [staticOptions, data, extractors]);

  // Computed values
  const hasActiveFilters = useMemo(() => {
    return filters.types.size > 0 || filters.areas.size > 0;
  }, [filters.types.size, filters.areas.size]);

  const activeFilterCount = useMemo(() => {
    return filters.types.size + filters.areas.size;
  }, [filters.types.size, filters.areas.size]);

  // Actions
  const toggleFilterMode = useCallback(() => {
    setFilterMode(prev => !prev);
  }, []);

  const toggleTypeFilter = useCallback((type: string) => {
    setFilters(prev => {
      const newTypes = new Set(prev.types);
      if (newTypes.has(type)) {
        newTypes.delete(type);
      } else {
        newTypes.add(type);
      }
      return { ...prev, types: newTypes };
    });
  }, []);

  const toggleAreaFilter = useCallback((area: string) => {
    setFilters(prev => {
      const newAreas = new Set(prev.areas);
      if (newAreas.has(area)) {
        newAreas.delete(area);
      } else {
        newAreas.add(area);
      }
      return { ...prev, areas: newAreas };
    });
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      types: new Set(),
      areas: new Set(),
    });
  }, []);

  const clearTypeFilters = useCallback(() => {
    setFilters(prev => ({ ...prev, types: new Set() }));
  }, []);

  const clearAreaFilters = useCallback(() => {
    setFilters(prev => ({ ...prev, areas: new Set() }));
  }, []);

  const getFilterParams = useCallback(() => {
    const result: { types?: string[]; areas?: string[] } = {};

    if (filters.types.size > 0) {
      result.types = Array.from(filters.types);
    }

    if (filters.areas.size > 0) {
      result.areas = Array.from(filters.areas);
    }

    return result;
  }, [filters.types, filters.areas]);

  return {
    // State
    filters,
    filterMode,

    // Computed
    hasActiveFilters,
    activeFilterCount,
    filterOptions,

    // Actions
    toggleFilterMode,
    toggleTypeFilter,
    toggleAreaFilter,
    clearFilters,
    clearTypeFilters,
    clearAreaFilters,

    // Utils
    getFilterParams,
  };
};
