import { create } from "zustand";

export const useFormStore = create((set) => ({
  
  testType: [{
      value: 'Blood (Lab)',
      label: 'Blood (Lab)',
    },
    {
      value: 'Urine (Lab)',
      label: 'Urine (Lab)',
    },
    {
      value: 'Homekit urine',
      label: 'Homekit urine',
  }],
  selectedType: "Urine (Lab)",

  getForm: [],
  valueToRemoveInBetween: [],

  setSelectedType: (valueOrUpdater) =>
    set((state) => ({
      selectedType:
        typeof valueOrUpdater === "function"
          ? valueOrUpdater(state.selectedType)
          : valueOrUpdater,
    })),

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