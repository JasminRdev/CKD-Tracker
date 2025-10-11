"use client"; 

import { createContext, useContext, useState } from 'react';


const LoadingContext = createContext();

export const LoadingProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [showOverlay ,setShowOverlay] = useState(false)
  const [overlayerElement, setOverlayerElement] = useState(null)
  
  const [notification_warn, setNotification_warn] = useState(false);
  const [notification_warn_color, setNotification_warn_color] = useState("")
  const [notification_warn_message, setNotification_warn_message] = useState("")
  return (
    <LoadingContext.Provider value={{ 
      notification_warn_message, setNotification_warn_message,
      notification_warn_color, setNotification_warn_color,
      notification_warn, setNotification_warn, 
      loading, setLoading, showOverlay, 
      setShowOverlay,overlayerElement, setOverlayerElement }}>
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoadingContext = () => useContext(LoadingContext);
