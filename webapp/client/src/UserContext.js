import React, { createContext, useState, useRef, useEffect } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [isConnected, setIsConnectedState] = useState(() => {
      const storedValue = localStorage.getItem('isConnected');
      return storedValue ? JSON.parse(storedValue) : false;
    });
  
    const setIsConnected = (value) => {
      localStorage.setItem('isConnected', JSON.stringify(value));
      setIsConnectedState(value);
    };
  
    const removeIsConnected = () => {
      localStorage.removeItem('isConnected');
      setIsConnectedState(false);
    };
  
    const MAX_SESSION_DURATION = 2 * 60 * 60 * 1000; // 2 hours in milliseconds
    const sessionTimeout = useRef(null);
  
    useEffect(() => {
      clearTimeout(sessionTimeout.current);
  
      if (isConnected) {
        sessionTimeout.current = setTimeout(removeIsConnected, MAX_SESSION_DURATION);
      }
    }, [isConnected]);
  
    const userContextValue = {
      isConnected,
      setIsConnected,
      removeIsConnected
    };
  
    return <UserContext.Provider value={userContextValue}>{children}</UserContext.Provider>;
  };
