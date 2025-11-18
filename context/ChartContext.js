"use client"; 

import { supabase } from '../app/lib/supabaseClient'

import { createContext, useContext, useEffect, useState } from 'react';

const ChartContext = createContext();

export const ChartProvider = ({ children }) => {

  // setTestResults([
  //   { date: '01', Kreatinin: 139, Protein: 62.5, ...
  //   { date: '07', Kreatinin: 133, Protein: 62 },
  // ]);
  const [testResults, setTestResults] = useState([])
  const [dateRangeRaw, setDateRangeRaw] = useState();
  const [dateFilter, setDateFilter] = useState({startDate: "10.2009", endDate: "12.2028"})
  const [chosenPetName, setChosenPetName] = useState("Blus (admin)");
  
  useEffect(() => {
    setDateRangeRaw([
    new Date(2009, 12, 1), 
    new Date(2029, 11, 20)
  ])
  }, [])

  const getBloodTestData = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;

    const res = await fetch(`/api/getTestResults?pet=${chosenPetName}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const json = await res.json();
    console.log("first ", json)
    return json.data;
  };


  useEffect(() => {
    const fetchAndTransform = async () => {
      const rawData = await getBloodTestData();
      const testResults_func = rawData
        .filter(item => {
          const itemDate = new Date(item.test_date);

          const [startMonth, startYear] = dateFilter.startDate.split(".").map(Number);
          const [endMonth, endYear] = dateFilter.endDate.split(".").map(Number);

          const start = new Date(startYear, startMonth - 1, 1); // first day of month
          const end = new Date(endYear, endMonth, 0, 23, 59, 59); // last day of month

          return itemDate >= start && itemDate <= end;
        })
        .sort((a, b) => new Date(a.test_date) - new Date(b.test_date)) 
        .map(item => {
          const monthDate = new Date(item.test_date);
          const month = String(monthDate.getMonth() + 1).padStart(2, '0');
          const year = monthDate.getFullYear();

          let result = { date: `${month}.${year}` };
          // Convert array of JSON strings to object
          item.data.forEach(str => {
            const { name, value } = JSON.parse(str);

            if (value !== "") {
              // convert to number if possible
              const numValue = isNaN(value) ? value : parseFloat(value);
              result[name] = numValue;
            }
          });
          return result; 
        });
        console.log("testResults", testResults_func);
        setTestResults(testResults_func);
      };
      fetchAndTransform();    
  }, [dateFilter, chosenPetName]);

 
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

  const generateColors = (keys) => {
    const colors = {};
    const step = 360 / keys.length; // evenly space hues

    keys.forEach((key, i) => {
      const hue = Math.round(i * step); 
      colors[key] = `hsl(${hue}, 50%, 40%)`;
    });

    return colors;
  };


  return (
    <ChartContext.Provider value={{ chosenPetName, setChosenPetName, generateColors, testResults, dateRangeRaw, handleDateRangePicker }}>
      {children}
    </ChartContext.Provider>
  );
};

export const useChartContext = () => useContext(ChartContext);
