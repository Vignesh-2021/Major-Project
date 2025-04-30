import React, { createContext, useState, useEffect, useContext } from "react";

const TimerContext = createContext();

export const TimerProvider = ({ children }) => {
  const [activeSession, setActiveSession] = useState(null);

  useEffect(() => {
    const updateSession = () => {
      const session = JSON.parse(localStorage.getItem("activeSession")) || null;
      setActiveSession(session);
      console.log("TimerContext check - Active session:", session);
    };
    updateSession();
    const interval = setInterval(updateSession, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <TimerContext.Provider value={{ activeSession }}>
      {children}
    </TimerContext.Provider>
  );
};

export const useTimer = () => useContext(TimerContext);