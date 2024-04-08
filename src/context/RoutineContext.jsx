import React, { createContext, useContext, useState } from "react";
import { Hours } from "../components/infor/MonthsDays";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  writeBatch,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { useUser } from "./userContext";

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

  const [routineDay, setRoutineDay] = useState([]);
  const [RoutineWorkday, setRoutineWorkday] = useState(Hours());
  const [RoutineWeekend, setRoutineWeekend] = useState(Hours());
  const [currentValueInputText, setCurrentValueInputText] = useState("");
  const [stages, setStages] = useState("");
  const [currentDay, setCurrentDay] = useState([]);

  // Firebase routine
  async function addRoutine() {
    const collectionName = user + "rutine";
    const collectionRef = collection(db, collectionName);

    return await createCollection(collectionRef);
  }

  async function getWeekend() {
    const collectionName = user + "rutine";
    const collectionRef = collection(db, collectionName);

    // get days of weekend
    const docRefDaysOfWeekend = doc(collectionRef, "DaysOfWeekend");
    const docSnapshot = await getDoc(docRefDaysOfWeekend);
    const DaysOfWeekend = docSnapshot.data();

    if (DaysOfWeekend) {
      setWeekend(DaysOfWeekend.weekend);
    } else {
      setWeekend([]);
    }
    return DaysOfWeekend;
  }

  async function getRoutine(month, day, year) {
    // collectionRef

    const collectionName = user + "rutine";

    const collectionRef = collection(db, collectionName);

    let firstDayOfMonth =
      new Date(parseInt(year), parseInt(month) - 1, parseInt(day)).getDay() + 1;

    if (firstDayOfMonth === 0) {
      firstDayOfMonth = 6;
    } else {
      firstDayOfMonth--;
    }

    // Searching if the day exists in the weekends to determine if it's a workday or weekend

    const res = await getWeekend();

    const isWeekend = res.weekend.includes(firstDayOfMonth);

    try {
      let routineData;
      if (isWeekend) {
        const docRefWeekend = doc(collectionRef, "weekend");
        const docSnapshot = await getDoc(docRefWeekend);
        routineData = docSnapshot.data();
        setStages("weekend");
        return routineData;
      } else {
        const docRefWorkday = doc(collectionRef, "workday");
        const docSnapshot = await getDoc(docRefWorkday);
        routineData = docSnapshot.data();
        setStages("workday");
        return routineData;
      }
    } catch (error) {
      console.error("Error al obtener la rutina:", error);
    }
  }

  // Firebase routine day task - porcentaje

  async function addRoutineDayTasks(month, day, year, porcentaje) {
    try {
      const collectionName = user + "rutine";
      const collectionRef = collection(db, collectionName);

      const DaynPorcentaje = {
        [`${month}/${day}/${year}`]: {
          porcentaje,
          stages,
          routineDay,
        },
      };

      const docRefRoutineDayPorcentaje = doc(collectionRef, "RoutineDay");
      await setDoc(docRefRoutineDayPorcentaje, DaynPorcentaje, { merge: true });
    } catch (error) {
      console.error(
        "Error al agregar el porcentaje de rutina para el día:",
        error
      );
    }
  }

  async function getRoutineDayTasks(month, day, year) {
    try {
      setLoading(false);

      const collectionName = user + "rutine";
      const collectionRef = collection(db, collectionName);

      const docRefRoutineDayPorcentaje = doc(collectionRef, "RoutineDay");

      const docSnapshot = await getDoc(docRefRoutineDayPorcentaje);

      if (!docSnapshot.exists()) return false;

      const data = docSnapshot.data();

      const dayInfo = await data[`${month}/${day}/${year}`];

      if (!dayInfo) return false;

      setStages(dayInfo.stages);

      setRoutineDay(dayInfo.routineDay);
      return true;
    } catch (error) {}
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
    setLoading(false);
    try {
      const batch = writeBatch(db);

      // Combine RoutineWeekend into a single object
      const weekendData = {};
      RoutineWeekend.forEach((item) => {
        weekendData[item.hour] = item;
      });

      // Combine RoutineWorkday into a single object
      const workdayData = {};
      RoutineWorkday.forEach((item) => {
        workdayData[item.hour] = item;
      });

      // Update weekend collection with combined data
      const docRefWeekend = doc(collectionRef, "weekend");
      batch.set(docRefWeekend, weekendData, { merge: true });

      // Update workday collection with combined data
      const docRefWorkday = doc(collectionRef, "workday");
      batch.set(docRefWorkday, workdayData, { merge: true });

      // Update DaysOfWeekend collection with 'weekend' data
      const docRefDaysOfWeekend = doc(collectionRef, "DaysOfWeekend");
      batch.set(docRefDaysOfWeekend, { weekend }, { merge: true });

      // Commit the batched writes
      await batch.commit();

      return true;
    } catch (error) {
      console.error("Error al crear la colección:", error);
      return false;
    } finally {
      setLoading(true);
    }
  }

  // local\\

  const rutine = async () => {
    const collectionName = user + "rutine";
    const collectionRef = collection(db, collectionName);

    const res = await collectionExists(collectionRef);
    return res;
  };

  const createRoutine = () => {
    setStages("workday");
    setOpenSFD(true);
  };

  const addInfoRoutine = (hour, text) => {
    if (stages === "workday") {
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
          if (item.hour === hour) {
            return { ...item, task: text };
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
        setRoutineDay,
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
        addRoutine,
        addRoutineDayTasks,
        getRoutineDayTasks,
        setCurrentDay,
        currentDay,
      }}
    >
      {children}
    </RoutineContext.Provider>
  );
};
