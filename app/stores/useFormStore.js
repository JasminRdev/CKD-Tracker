import { create } from "zustand";

const iniNewInput = {
  name: "",
  keyword: "",
  datum: new Date().toISOString().split("T")[0],
  min: null,
  max: null,
  unit: "",
  value: "",
};

const iniNewUnitForm = {
  name: "",
  fromUnit: "",
  settedUnit: "",
  offset: "",
  calcForFactor: ""
};

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
  selectedType: "Blood (Lab)",

  getForm: [],
  valueToRemoveInBetween: [],
  usersUnits: [],
  chosenUnit: [],
  iniNewUnitForm,
  newUnitForm: [iniNewUnitForm],

  iniNewInput,
  newInput: [iniNewInput],
  

  setNewUnitForm: (valueOrUpdater) =>
    set((state) => ({
      newUnitForm:
        typeof valueOrUpdater === "function"
          ? valueOrUpdater(state.newUnitForm)
          : valueOrUpdater,
    })),

  setNewInput: (valueOrUpdater) =>
    set((state) => ({
      newInput:
        typeof valueOrUpdater === "function"
          ? valueOrUpdater(state.newInput)
          : valueOrUpdater,
    })),
    
  setChosenUnit: (valueOrUpdater) =>
    set((state) => ({
      chosenUnit:
        typeof valueOrUpdater === "function"
          ? valueOrUpdater(state.chosenUnit)
          : valueOrUpdater,
    })),
    
  setUsersUnits: (valueOrUpdater) =>
    set((state) => ({
      usersUnits:
        typeof valueOrUpdater === "function"
          ? valueOrUpdater(state.usersUnits)
          : valueOrUpdater,
    })),

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