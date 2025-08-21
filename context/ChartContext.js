
// ChartContext.js
"use client"; 

import { createContext, useContext, useState } from 'react';

import { supabase } from '../app/lib/supabaseClient'

const ChartContext = createContext();

export const ChartProvider = ({ children }) => {

    
   
  return (
    <ChartContext.Provider value={{  }}>
      {children}
    </ChartContext.Provider>
  );
};

export const useChartContext = () => useContext(ChartContext);
