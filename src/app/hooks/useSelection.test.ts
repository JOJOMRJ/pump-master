import { renderHook, act } from '@testing-library/react';
import { useSelection } from './useSelection';

describe('useSelection', () => {
  const mockItems = [
    { id: 'item-1', name: 'Item 1' },
    { id: 'item-2', name: 'Item 2' },
    { id: 'item-3', name: 'Item 3' },
    { id: 'item-4', name: 'Item 4' },
  ];

  const keyExtractor = (item: { id: string; name: string }) => item.id;

  it('initializes with empty selection', () => {
    const { result } = renderHook(() => useSelection());

    expect(result.current.selectedItems).toEqual(new Set());
    expect(result.current.selectedCount).toBe(0);
  });

  it('initializes with provided initial selection', () => {
    const initialSelection = new Set(['item-1', 'item-2']);
    const { result } = renderHook(() => useSelection({ initialSelection }));

    expect(result.current.selectedItems).toEqual(initialSelection);
    expect(result.current.selectedCount).toBe(2);
  });

  it('selects an item', () => {
    const { result } = renderHook(() => useSelection({ keyExtractor }));

    act(() => {
      result.current.selectItem(mockItems[0]);
    });

    expect(result.current.selectedItems.has('item-1')).toBe(true);
    expect(result.current.selectedCount).toBe(1);
  });

  it('deselects an item', () => {
    const { result } = renderHook(() => useSelection({ keyExtractor }));

    act(() => {
      result.current.selectItem(mockItems[0]);
    });

    expect(result.current.selectedItems.has('item-1')).toBe(true);

    act(() => {
      result.current.deselectItem(mockItems[0]);
    });

    expect(result.current.selectedItems.has('item-1')).toBe(false);
    expect(result.current.selectedCount).toBe(0);
  });

  it('toggles an item', () => {
    const { result } = renderHook(() => useSelection({ keyExtractor }));

    act(() => {
      result.current.toggleItem(mockItems[0]);
    });

    expect(result.current.selectedItems.has('item-1')).toBe(true);

    act(() => {
      result.current.toggleItem(mockItems[0]);
    });

    expect(result.current.selectedItems.has('item-1')).toBe(false);
  });

  it('clears selection', () => {
    const { result } = renderHook(() => useSelection({ keyExtractor }));

    act(() => {
      result.current.selectItem(mockItems[0]);
      result.current.selectItem(mockItems[1]);
    });

    expect(result.current.selectedCount).toBe(2);

    act(() => {
      result.current.clearSelection();
    });

    expect(result.current.selectedCount).toBe(0);
  });

  it('selects all items', () => {
    const { result } = renderHook(() => useSelection({ keyExtractor }));

    act(() => {
      result.current.selectAll(mockItems);
    });

    expect(result.current.selectedCount).toBe(4);
    mockItems.forEach(item => {
      expect(result.current.selectedItems.has(item.id)).toBe(true);
    });
  });

  it('checks if item is selected', () => {
    const { result } = renderHook(() => useSelection({ keyExtractor }));

    expect(result.current.isSelected(mockItems[0])).toBe(false);

    act(() => {
      result.current.selectItem(mockItems[0]);
    });

    expect(result.current.isSelected(mockItems[0])).toBe(true);
  });

  it('handles select all operation', () => {
    const { result } = renderHook(() => useSelection({ keyExtractor }));

    act(() => {
      result.current.handleSelectAll(true, mockItems);
    });

    expect(result.current.selectedCount).toBe(4);

    act(() => {
      result.current.handleSelectAll(false, mockItems);
    });

    expect(result.current.selectedCount).toBe(0);
  });

  it('handles item select operation', () => {
    const { result } = renderHook(() => useSelection({ keyExtractor }));

    act(() => {
      result.current.handleItemSelect(mockItems[0], true);
    });

    expect(result.current.isSelected(mockItems[0])).toBe(true);

    act(() => {
      result.current.handleItemSelect(mockItems[0], false);
    });

    expect(result.current.isSelected(mockItems[0])).toBe(false);
  });

  it('sets selected items directly', () => {
    const { result } = renderHook(() => useSelection({ keyExtractor }));

    const newSelection = new Set(['item-1', 'item-3']);

    act(() => {
      result.current.setSelectedItems(newSelection);
    });

    expect(result.current.selectedItems).toEqual(newSelection);
    expect(result.current.selectedCount).toBe(2);
  });

  it('uses default key extractor when none provided', () => {
    const stringItems = ['item-1', 'item-2', 'item-3'];
    const { result } = renderHook(() => useSelection<string>());

    act(() => {
      result.current.selectItem(stringItems[0]);
    });

    expect(result.current.selectedItems.has('item-1')).toBe(true);
  });

  it('handles duplicate selections', () => {
    const { result } = renderHook(() => useSelection({ keyExtractor }));

    act(() => {
      result.current.selectItem(mockItems[0]);
      result.current.selectItem(mockItems[0]);
    });

    expect(result.current.selectedCount).toBe(1);
  });

  it('handles deselection of non-selected items', () => {
    const { result } = renderHook(() => useSelection({ keyExtractor }));

    act(() => {
      result.current.deselectItem(mockItems[0]);
    });

    expect(result.current.selectedCount).toBe(0);
  });

  it('maintains immutability of selectedItems', () => {
    const { result } = renderHook(() => useSelection({ keyExtractor }));

    const initialSet = result.current.selectedItems;

    act(() => {
      result.current.selectItem(mockItems[0]);
    });

    const updatedSet = result.current.selectedItems;

    expect(initialSet).not.toBe(updatedSet);
    expect(initialSet.has('item-1')).toBe(false);
    expect(updatedSet.has('item-1')).toBe(true);
  });

  it('handles empty items array in selectAll', () => {
    const { result } = renderHook(() => useSelection({ keyExtractor }));

    act(() => {
      result.current.selectAll([]);
    });

    expect(result.current.selectedCount).toBe(0);
  });

  it('handles custom key extractor', () => {
    const customKeyExtractor = (item: { id: string; name: string }) =>
      `custom-${item.id}`;
    const { result } = renderHook(() =>
      useSelection({ keyExtractor: customKeyExtractor })
    );

    act(() => {
      result.current.selectItem(mockItems[0]);
    });

    expect(result.current.selectedItems.has('custom-item-1')).toBe(true);
  });

  it('updates selectedCount when items are added/removed', () => {
    const { result } = renderHook(() => useSelection({ keyExtractor }));

    expect(result.current.selectedCount).toBe(0);

    act(() => {
      result.current.selectItem(mockItems[0]);
    });

    expect(result.current.selectedCount).toBe(1);

    act(() => {
      result.current.selectItem(mockItems[1]);
    });

    expect(result.current.selectedCount).toBe(2);

    act(() => {
      result.current.deselectItem(mockItems[0]);
    });

    expect(result.current.selectedCount).toBe(1);
  });

  it('handles mixed operations correctly', () => {
    const { result } = renderHook(() => useSelection({ keyExtractor }));

    act(() => {
      result.current.selectItem(mockItems[0]);
      result.current.toggleItem(mockItems[1]);
      result.current.handleItemSelect(mockItems[2], true);
    });

    expect(result.current.selectedCount).toBe(3);

    act(() => {
      result.current.deselectItem(mockItems[0]);
      result.current.toggleItem(mockItems[1]);
      result.current.handleItemSelect(mockItems[2], false);
    });

    expect(result.current.selectedCount).toBe(0);
  });
});
