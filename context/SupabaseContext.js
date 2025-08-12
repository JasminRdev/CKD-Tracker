
// SupabaseContext.js
"use client"; 

import { createContext, useContext, useState } from 'react';

import { supabase } from '../app/lib/supabaseClient'

const SupabaseContext = createContext();

export const SupabaseProvider = ({ children }) => {
   const getNextId = async () => {
    const { count, error } = await supabase
      .from('testResult_data')
      .select('id', { count: 'exact'});

 
    if (error) {
      console.error('Error fetching row count:', error);
      return null;
    }
    console.log("count is current, and next ID: ", count, count +1)
    return count + 1;
  };

  return (
    <SupabaseContext.Provider value={{ getNextId }}>
      {children}
    </SupabaseContext.Provider>
  );
};

export const useSupabaseContext = () => useContext(SupabaseContext);
