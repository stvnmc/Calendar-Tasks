import React, { createContext, useContext, useEffect, useState } from "react";
import { Hours } from "../components/infor/MonthsDays";
import { addDoc, collection, doc, getDocs, setDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import { useUser } from "./userContext";
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
  //context

  const { user } = useUser();

  const [weekend, setWeekend] = useState([]);
  const [openSFD, setOpenSFD] = useState(false);
  const [OpenCreateRutine, setOpenCreateRutine] = useState(false);
  const [RoutineWorkday, setRoutineWorkday] = useState(Hours());
  const [RoutineWeekend, setRoutineWeekend] = useState(Hours());
  const [currentValueInputText, setCurrentValueInputText] = useState("");
  const [stages, setStages] = useState("Workday");

  useEffect(() => {
    console.log(stages);
  }, [stages]);

  // Firebase
  async function addRoutine() {
    const collectionName = user + "rutine";
    const collectionRef = collection(db, collectionName);

    const collectionExistsResult = await collectionExists(collectionRef);
    if (collectionExistsResult) {
      console.log("si existe");
    } else {
      await createCollection(collectionRef);
    }
  }

  // create collection

  async function collectionExists(collectionRef) {
    try {
      const querySnapshot = await getDocs(collectionRef);
      return !querySnapshot.empty;
    } catch (error) {
      console.error(
        "Error al verificar la existencia de la colección:",
        error.message
      );
      return false;
    }
  }

  async function createCollection(collectionName) {
    try {
      

      return true;
    } catch (error) {
      console.error("Error al crear la colección:", error);
      return false;
    }
  }

  // local

  const createRoutine = () => {
    setOpenSFD(true);
  };

  const addInfoRoutine = (h, t) => {
    if (stages === "Workday") {
      console.log(h, t, stages);
      console.log(RoutineWorkday);

      setRoutineWorkday((prev) =>
        prev.map((item) => {
          if (item.hour === h) {
            return { ...item, task: t };
          }
          return item;
        })
      );
    } else {
      setRoutineWeekend((prev) =>
        prev.map((item) => {
          if (item.hour === h) {
            return { ...item, task: t };
          }
          return item;
        })
      );
    }
  };

  return (
    <RoutineContext.Provider
      value={{
        createRoutine,
        setWeekend,
        weekend,
        openSFD,
        RoutineWorkday,
        RoutineWeekend,
        setRoutineWorkday,
        setRoutineWeekend,
        addInfoRoutine,
        setCurrentValueInputText,
        currentValueInputText,
        setStages,
        stages,
        setOpenSFD,
        OpenCreateRutine,
        setOpenCreateRutine,
        addRoutine,
      }}
    >
      {children}
    </RoutineContext.Provider>
  );
};
