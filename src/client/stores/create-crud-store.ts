// CRUD Store Factory
// Her entity için tekrar tekrar store yazmak yerine bu factory'yi kullan
//
// Kullanım:
//   const useProductStore = createCrudStore<Product>("products");
//   const { items, addItem, updateItem, removeItem } = useProductStore();

import { create, type StateCreator } from "zustand";
import { persist } from "zustand/middleware";

interface CrudState<T extends { id: string }> {
  items: T[];
  selectedId: string | null;
  searchQuery: string;

  // CRUD aksiyonları
  setItems: (items: T[]) => void;
  addItem: (item: T) => void;
  updateItem: (id: string, updates: Partial<T>) => void;
  removeItem: (id: string) => void;

  // Seçim
  selectItem: (id: string | null) => void;
  getSelectedItem: () => T | undefined;

  // Arama
  setSearchQuery: (query: string) => void;

  // Toplu işlemler
  removeMany: (ids: string[]) => void;
  clear: () => void;
}

export function createCrudStore<T extends { id: string }>(
  name: string,
  options?: { persist?: boolean }
) {
  const storeCreator: StateCreator<CrudState<T>> = (set, get) => ({
    items: [],
    selectedId: null,
    searchQuery: "",

    setItems: (items) => set({ items }),

    addItem: (item) =>
      set((state) => ({ items: [...state.items, item] })),

    updateItem: (id, updates) =>
      set((state) => ({
        items: state.items.map((item) =>
          item.id === id ? { ...item, ...updates } : item
        ),
      })),

    removeItem: (id) =>
      set((state) => ({
        items: state.items.filter((item) => item.id !== id),
        selectedId: state.selectedId === id ? null : state.selectedId,
      })),

    selectItem: (id) => set({ selectedId: id }),

    getSelectedItem: () => {
      const { items, selectedId } = get();
      return items.find((item) => item.id === selectedId);
    },

    setSearchQuery: (query) => set({ searchQuery: query }),

    removeMany: (ids) =>
      set((state) => ({
        items: state.items.filter((item) => !ids.includes(item.id)),
        selectedId:
          state.selectedId && ids.includes(state.selectedId)
            ? null
            : state.selectedId,
      })),

    clear: () => set({ items: [], selectedId: null, searchQuery: "" }),
  });

  if (options?.persist) {
    return create<CrudState<T>>()(
      persist(storeCreator, {
        name: `nexus-${name}-store`,
        partialize: (state) => ({ items: state.items }),
      })
    );
  }

  return create<CrudState<T>>()(storeCreator);
}
