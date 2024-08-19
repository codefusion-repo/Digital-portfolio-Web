"use client";
// mobileContext.tsx

import React, { createContext, useContext, useEffect, useState } from "react";

// Crear MobileContext
const MobileContext = createContext(null);

// Exportar MobileProvider
export const MobileProvider = ({ children }) => {
  const [hasWindow, setHasWindow] = useState(false);
  const [isSet, setIsSet] = useState(false);

  const [device, setDevice] = useState(4);

  useEffect(() => {
    if (!hasWindow) {
      if (typeof window !== "undefined") {
        setHasWindow(true);
      } else {
        setHasWindow(false);
      }
    }
  }, [hasWindow]);

  const adjustSize = () => {
    const screenWidth = window.innerWidth;

    if (screenWidth < 480) {
      setDevice(0);
    } else if (screenWidth < 768) {
      setDevice(1);
    } else if (screenWidth < 1024) {
      setDevice(2);
    } else if (screenWidth < 1200) {
      setDevice(3);
    } else {
      setDevice(4);
    }
  };

  useEffect(() => {
    if (hasWindow && !isSet) {
      adjustSize();
      setIsSet(true);
    }
  }, [hasWindow, isSet]);

  useEffect(() => {
    window.addEventListener("resize", adjustSize);
    return () => {
      window.addEventListener("resize", adjustSize);
    };
  }, []);

  useEffect(() => {
    console.log("device: ", device);
  }, [device]);

  return (
    <MobileContext.Provider
      value={{
        hasWindow,
        device,
      }}
    >
      {children}
    </MobileContext.Provider>
  );
};

// Exportar useMobile para usar las variables de MobileContext
export const useMobile = () => {
  const context = useContext(MobileContext);
  if (!context) {
    throw new Error("useMobile debe usarse dentro de un MobileProvider");
  }

  return context;
};
