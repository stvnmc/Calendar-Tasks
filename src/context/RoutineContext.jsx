import React, { createContext, useContext, useEffect, useState } from "react";
// import {
//   createUserWithEmailAndPassword,
//   signInWithEmailAndPassword,
//   signOut,
// } from "firebase/auth";
// import { dbAuth } from "../firebase/config";

export const RoutineContext = createContext();

export const useRoutine = () => {
  const context = useContext(RoutineContext);

  if (!context) {
    console.warn(
      "RoutineContext not found. Make sure you are using UserProvider."
    );
  }

  return context;
};

export const RoutineProvider = ({ children }) => {
  const [freeDays, setFreeDays] = useState([]);
  const [openSFD, setOpenSFD] = useState(false);

  const createRoutine = () => {
    console.log(freeDays);
    setOpenSFD(true);
  };

  return (
    <RoutineContext.Provider
      value={{ createRoutine, setFreeDays, freeDays, openSFD }}
    >
      {children}
    </RoutineContext.Provider>
  );
};
