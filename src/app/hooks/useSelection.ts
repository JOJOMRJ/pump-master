import { useState, useCallback } from 'react';

interface UseSelectionOptions<T> {
  keyExtractor?: (item: T) => string;
  initialSelection?: Set<string>;
}

interface UseSelectionReturn<T> {
  selectedItems: Set<string>;
  selectItem: (item: T) => void;
  deselectItem: (item: T) => void;
  toggleItem: (item: T) => void;
  clearSelection: () => void;
  selectAll: (items: T[]) => void;
  isSelected: (item: T) => boolean;
  selectedCount: number;
  setSelectedItems: (items: Set<string>) => void;
  handleSelectAll: (checked: boolean, items: T[]) => void;
  handleItemSelect: (item: T, checked: boolean) => void;
}

export const useSelection = <T>(
  options: UseSelectionOptions<T> = {}
): UseSelectionReturn<T> => {
  const {
    keyExtractor = (item: T) => String(item),
    initialSelection = new Set<string>(),
  } = options;

  const [selectedItems, setSelectedItems] =
    useState<Set<string>>(initialSelection);

  const selectItem = useCallback(
    (item: T) => {
      const key = keyExtractor(item);
      setSelectedItems(prev => new Set(prev).add(key));
    },
    [keyExtractor]
  );

  const deselectItem = useCallback(
    (item: T) => {
      const key = keyExtractor(item);
      setSelectedItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(key);
        return newSet;
      });
    },
    [keyExtractor]
  );

  const toggleItem = useCallback(
    (item: T) => {
      const key = keyExtractor(item);
      setSelectedItems(prev => {
        const newSet = new Set(prev);
        if (newSet.has(key)) {
          newSet.delete(key);
        } else {
          newSet.add(key);
        }
        return newSet;
      });
    },
    [keyExtractor]
  );

  const clearSelection = useCallback(() => {
    setSelectedItems(new Set());
  }, []);

  const selectAll = useCallback(
    (items: T[]) => {
      const keys = items.map(keyExtractor);
      setSelectedItems(new Set(keys));
    },
    [keyExtractor]
  );

  const isSelected = useCallback(
    (item: T) => {
      const key = keyExtractor(item);
      return selectedItems.has(key);
    },
    [selectedItems, keyExtractor]
  );

  // Convenience method: handle select all operation
  const handleSelectAll = useCallback(
    (checked: boolean, items: T[]) => {
      if (checked) {
        selectAll(items);
      } else {
        clearSelection();
      }
    },
    [selectAll, clearSelection]
  );

  // Convenience method: handle single item selection
  const handleItemSelect = useCallback(
    (item: T, checked: boolean) => {
      if (checked) {
        selectItem(item);
      } else {
        deselectItem(item);
      }
    },
    [selectItem, deselectItem]
  );

  return {
    selectedItems,
    selectItem,
    deselectItem,
    toggleItem,
    clearSelection,
    selectAll,
    isSelected,
    selectedCount: selectedItems.size,
    setSelectedItems,
    handleSelectAll,
    handleItemSelect,
  };
};
