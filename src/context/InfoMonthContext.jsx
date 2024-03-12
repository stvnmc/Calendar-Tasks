import React, { createContext, useContext, useState } from "react";
import { getInfoTaskDay } from "../firebase/TaskData";

export const InfoMonthContext = createContext();

export const useInfoMonth = () => {
  const context = useContext(InfoMonthContext);

  if (!context) {
    console.log("need login");
  }
  return context;
};

export const InfoMonthProvider = ({ children }) => {
  const [infoOfMonth, setInfoOfMonth] = useState([]);

  const getInfoMonthFirestore = async (id) => {
    const infoOfMonthRes = await getInfoTaskDay(id);
    setInfoOfMonth(infoOfMonthRes);
  };

  return (
    <InfoMonthContext.Provider value={{ getInfoMonthFirestore, infoOfMonth }}>
      {children}
    </InfoMonthContext.Provider>
  );
};
