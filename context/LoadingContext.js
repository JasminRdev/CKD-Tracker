
// LoadingContext.js
"use client"; 

import { createContext, useContext, useState } from 'react';


const LoadingContext = createContext();

export const LoadingProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  
  const [showOverlay ,setShowOverlay] = useState(false)
  const [overlayerElement, setOverlayerElement] = useState(null)

  return (
    <LoadingContext.Provider value={{ loading, setLoading, showOverlay ,setShowOverlay,overlayerElement, setOverlayerElement }}>
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoadingContext = () => useContext(LoadingContext);
