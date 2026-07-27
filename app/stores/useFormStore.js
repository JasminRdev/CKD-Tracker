import { create } from "zustand";

export const useFormStore = create((set) => ({
  getForm: [],
  valueToRemoveInBetween: [],

  setForm: (valueOrUpdater) =>
    set((state) => ({
      getForm:
        typeof valueOrUpdater === "function"
          ? valueOrUpdater(state.getForm)
          : valueOrUpdater,
    })),
    
  setValueToRemoveInBetween: (valueOrUpdater) =>
  set((state) => ({
    valueToRemoveInBetween:
      typeof valueOrUpdater === "function"
        ? valueOrUpdater(state.valueToRemoveInBetween)
        : valueOrUpdater,
    })),
}));