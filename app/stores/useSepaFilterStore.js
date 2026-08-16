import { create } from "zustand";

export const useSepaFilterStore = create((set) => ({
    search: "",
    filters: [],
    yMain: 30,

    setYMain: (yMain) => set({ yMain: yMain }),

    setSearch: (search) => set({ search }),

    addFilter: (filter) =>
        set((state) => ({
        filters: state.filters.includes(filter)
            ? state.filters
            : [...state.filters, filter],
        })),

    removeFilter: (filter) =>
        set((state) => ({
        filters: state.filters.filter((f) => f !== filter),
        })),

    clearFilters: () => set({ filters: [] }),
    // saveFilters: toDB
}));