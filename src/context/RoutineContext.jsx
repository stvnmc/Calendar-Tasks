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

  // Firebase routine
  async function addRoutine() {
    const collectionName = user + "rutine";
    const collectionRef = collection(db, collectionName);

    const collectionExistsResult = await collectionExists(collectionRef);
    if (collectionExistsResult) {
    } else {
      await createCollection(collectionRef);
    }
  }

  async function getRoutine(day, month) {
    if (!user || typeof user !== "string") {
      return;
    }
    setLoading(false);
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

    // add all routine
    try {
      let routineData;
      if (isWeekend) {
        const docRefWeekend = doc(collectionRef, "weekend");
        const docSnapshot = await getDoc(docRefWeekend);
        routineData = docSnapshot.data();
        setStages("weekend");
      } else {
        const docRefWorkday = doc(collectionRef, "workday");
        const docSnapshot = await getDoc(docRefWorkday);
        routineData = docSnapshot.data();
        setStages("workday");
      }

      setRoutineDay(routineData);

      // loging
      setLoading(true);
    } catch (error) {
      console.error("Error al obtener la rutina:", error);
    }
  }

  // Firebase routine day porcentaje

  async function addRoutineDayporcentaje(
    month,
    day,
    year,
    porcentaje,
    routinePercentage
  ) {
    console.log(routinePercentage);
    try {
      const collectionName = user + "rutine";
      const collectionRef = collection(db, collectionName);
      const DaynPorcentaje = {
        [`${month}/${day}/${year}`]: { porcentaje, routinePercentage },
      };

      const docRefRoutineDayPorcentaje = doc(
        collectionRef,
        "RoutineDayPorcentaje"
      );
      await setDoc(docRefRoutineDayPorcentaje, DaynPorcentaje, { merge: true });

      console.log("Porcentaje de rutina para el día agregado correctamente.");
    } catch (error) {
      console.error(
        "Error al agregar el porcentaje de rutina para el día:",
        error
      );
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
  };

  const createRoutine = () => {
    setOpenSFD(true);
  };

  const addInfoRoutine = (hour, text) => {
    if (stages === "Workday") {
      setRoutineWorkday((prev) =>
        prev.map((item) => {
          if (item.hour === hour) {
            return { ...item, task: text };
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
        setLoading,
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
        addRoutineDayporcentaje,
      }}
    >
      {children}
    </RoutineContext.Provider>
  );
};
