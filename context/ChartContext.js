
// ChartContext.js
"use client"; 

import { createContext, useContext, useState } from 'react';

import { supabase } from '../app/lib/supabaseClient'

const ChartContext = createContext();

export const ChartProvider = ({ children }) => {
  const [dateRangeRaw, setDateRangeRaw] = useState([new Date(), new Date()]);
  const [dateFilter, setDateFilter] = useState({startDate: "11.2023", endDate: "7.2025"})

  const formatMonthYear = (date) => {
    if (!date) return "";
    const month = date.getMonth();
    const year = date.getFullYear();
    return `${month}.${year}`;
  };

  const handleDateRangePicker = (range) => {
    setDateRangeRaw(range);
    setDateFilter({
      startDate: formatMonthYear(range[0]),
      endDate: formatMonthYear(range[1]),
    });
  };
    
   
  return (
    <ChartContext.Provider value={{ dateFilter, dateRangeRaw, handleDateRangePicker }}>
      {children}
    </ChartContext.Provider>
  );
};

export const useChartContext = () => useContext(ChartContext);
