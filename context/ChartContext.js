"use client"; 

import { supabase } from '../app/lib/supabaseClient'
import { useFormStore } from "../app/stores/useFormStore";
import { createContext, useContext, useEffect, useState } from 'react';

import { useLoadingContext } from './LoadingContext';

import useUser from '../app/lib/useUser'
import { encode } from 'punycode';
const ChartContext = createContext();

export const ChartProvider = ({ children }) => {
  const {
    loading, 
    showOverlay, 
    setNotification_warn_message,
    setNotification_warn_color,
    setNotification_warn, 
    setLoading, 
    setShowOverlay, 
    setOverlayerElement} = useLoadingContext();
  
  const user = useUser();
  // setTestResults([
  //   { date: '01', Kreatinin: 139, Protein: 62.5, ...
  //   { date: '07', Kreatinin: 133, Protein: 62 },
  // ]);
  
  const [testResults, setTestResults] = useState([])
  const [dateRangeRaw, setDateRangeRaw] = useState();
  const [dateFilter, setDateFilter] = useState({startDate: "1.2000", endDate: "12.2029"})
  const [chosenPetName, setChosenPetName] = useState("Blus (admin)");
  
  const { getForm, selectedType, newInput } = useFormStore()

  async function updatePossi(newestForm){
    let cleanedForm = newestForm.map(field => ({
      ...field,
      value: "",
      normalizedValue: "",
      originalUnit: ""
    }));

    //update new form to own possi
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;

    try {
      const payload = {
        form: cleanedForm
      };

      const res = await fetch(`/api/updateOwnPossi?pet=${chosenPetName}&testtype=${selectedType}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
          const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || `HTTP ${res.status}`);
      }

      console.log("update successful:", json);

      return json;
    } catch (error) {
      console.error("updatePossi failed:", error);
      
      setNotification_warn(true)
      setNotification_warn_message("Something went wrong. Data could not be saved.")
      setNotification_warn_color("warning")
    }
  };
  
  
  useEffect(() => {
    setDateRangeRaw([
    new Date(2000, 1, 1), 
    new Date(2029, 11, 20)
  ])
  }, [])

  const getBloodTestData = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;

    const res = await fetch(`/api/getTestResults?pet=${chosenPetName}&testtype=${selectedType}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const json = await res.json();
    return json.data;
  };


  useEffect(() => {
    const fetchAndTransform = async () => {
      const rawData = await getBloodTestData();
      console.log("raaaw", rawData)
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
          // item.data.forEach(str => {
          //   const { name, value, normalizedValue } = JSON.parse(str);
          //   if (value !== "") {
          //     // convert to number if possible
          //     const numValue = isNaN(value) ? value : parseFloat(value);
          //     result[name] = numValue;
          //   }
            
          //   // if (normalizedValue !== "") {
          //   //   // convert to number if possible
          //   //   const numValue = isNaN(normalizedValue) ? normalizedValue : parseFloat(normalizedValue);
          //   //   result[name] = numValue;
          //   // }
          // });
          item.data.forEach(str => {
            const { name, value, normalizedValue } = JSON.parse(str);

            const resultValue = {};

            if (value !== "" && value !== null && value !== undefined) {
              resultValue.value = isNaN(value) ? value : parseFloat(value);
            }

            if (normalizedValue !== "" && normalizedValue !== null && normalizedValue !== undefined) {
              resultValue.normalizedValue = isNaN(normalizedValue)
                ? normalizedValue
                : parseFloat(normalizedValue);
            }

            if (Object.keys(resultValue).length > 0) {
              result[name] = resultValue;
            }
          });
          return result; 
        });
        console.log("testResults", testResults_func);
        setTestResults(testResults_func);
      };
      fetchAndTransform();  
      // console.log("getForm and api update possi ", getForm) 
      if(!user) return
      // if(getForm.length){
      //   updatePossi() 
      // }
  }, [dateFilter, chosenPetName, getForm]);

 

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
    <ChartContext.Provider value={{ getBloodTestData,
      chosenPetName, 
      setChosenPetName, 
      generateColors, 
      testResults, 
      dateRangeRaw, 
      updatePossi,
      handleDateRangePicker }}>
      {children}
    </ChartContext.Provider>
  );
};

export const useChartContext = () => useContext(ChartContext);
