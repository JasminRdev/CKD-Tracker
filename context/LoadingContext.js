"use client"; 

import { createContext, useContext, useEffect, useState } from 'react';
import useUser from '../app/lib/useUser'

const LoadingContext = createContext();

export const LoadingProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [foundUser, setFoundUser] = useState(false);
  const [showOverlay ,setShowOverlay] = useState(false)
  const [overlayerElement, setOverlayerElement] = useState(null)
  
  const [notification_warn, setNotification_warn] = useState(false);
  const [notification_warn_color, setNotification_warn_color] = useState("")
  const [notification_warn_message, setNotification_warn_message] = useState("")
  
  
  const user = useUser();

  useEffect(() => {
    setLoading(true)
    user ? setFoundUser(true) : setFoundUser(false);
    setLoading(false)
    console.log("user login ", user && user)
    //55 -> jasmin08
    //7 -> matilda
  },[user])

  
  useEffect(() => {
    if(showOverlay){
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [showOverlay]);



  return (
    <LoadingContext.Provider value={{ 
      foundUser,
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
