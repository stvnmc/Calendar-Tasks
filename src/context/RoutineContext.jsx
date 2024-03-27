import React, { createContext, useContext, useState } from "react";
import { Hours } from "../components/infor/MonthsDays";
import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import { useUser } from "./userContext";
import { getInfoCalendar } from "../components/FunctionGetCalendar";

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

  const [loading, setLoading] = useState(false);
  const [weekend, setWeekend] = useState([]);
  const [openSFD, setOpenSFD] = useState(false);
  const [OpenCreateRutine, setOpenCreateRutine] = useState(true);
  const [routineDay, setRoutineDay] = useState([]);
  const [RoutineWorkday, setRoutineWorkday] = useState(Hours());
  const [RoutineWeekend, setRoutineWeekend] = useState(Hours());
  const [currentValueInputText, setCurrentValueInputText] = useState("");
  const [stages, setStages] = useState("Workday");

  // Firebase
  async function addRoutine() {
    const collectionName = user + "rutine";
    const collectionRef = collection(db, collectionName);

    const collectionExistsResult = await collectionExists(collectionRef);
    if (collectionExistsResult) {
      console.log("si existe");
    } else {
      console.log("no existe");
      await createCollection(collectionRef);
      console.log("collection create");
    }
  }

  async function getRoutine(day, month) {
    if (!user || typeof user !== "string") {
      return;
    }
    // collectionRef

    const collectionName = user + "rutine";
    const collectionRef = collection(db, collectionName);

    // get days of weekend
    const docRefDaysOfWeekend = doc(collectionRef, "DaysOfWeekend");
    const docSnapshot = await getDoc(docRefDaysOfWeekend);
    const DaysOfWeekend = docSnapshot.data();
    setWeekend(DaysOfWeekend.weekend);

    const calendar = await getInfoCalendar(day, month);

    const currentDay = calendar.find((d) => d.type === "current");

    const isWeekend = weekend.includes(currentDay.dayOfWeek);

    try {
      let routineData;
      if (isWeekend) {
        const docRefWeekend = doc(collectionRef, "weekend");
        const docSnapshot = await getDoc(docRefWeekend);
        routineData = docSnapshot.data();
        console.log("weekend");
      } else {
        const docRefWorkday = doc(collectionRef, "workday");
        const docSnapshot = await getDoc(docRefWorkday);
        routineData = docSnapshot.data();
        console.log("workday");
      }

      setRoutineDay(routineData);
    } catch (error) {
      console.error("Error al obtener la rutina:", error);
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

  async function createCollection(collectionRef) {
    try {
      const docRefWeekend = doc(collectionRef, "weekend");

      for (const item of RoutineWeekend) {
        const docData = {
          [item.hour]: item,
        };
        await setDoc(docRefWeekend, docData, { merge: true });
      }

      const docRefWorkday = doc(collectionRef, "workday");

      for (const item of RoutineWorkday) {
        const docData = {
          [item.hour]: item,
        };
        await setDoc(docRefWorkday, docData, { merge: true });
      }

      const docRefDaysOfWeekend = doc(collectionRef, "DaysOfWeekend");

      await setDoc(docRefDaysOfWeekend, { weekend }, { merge: true });

      return true;
    } catch (error) {
      console.error("Error al crear la colección:", error);
      return false;
    }
  }

  // local\\

  const rutine = async () => {
    const collectionName = user + "rutine";
    const collectionRef = collection(db, collectionName);

    const collectionExistsResult = await collectionExists(collectionRef);
    if (collectionExistsResult) {
      setOpenCreateRutine(true);
    } else {
      setOpenCreateRutine(false);
    }
    setLoading(true);
  };

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
        loading,
        routineDay,
        rutine,
        createRoutine,
        setWeekend,
        getRoutine,
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
