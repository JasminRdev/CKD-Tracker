import { create } from "zustand";

export const useFormStore = create((set) => ({
  getForm: [],

  setForm: (valueOrUpdater) =>
    set((state) => ({
      getForm:
        typeof valueOrUpdater === "function"
          ? valueOrUpdater(state.getForm)
          : valueOrUpdater,
    })),
}));