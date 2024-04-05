import React, { createContext, useContext, useEffect, useState } from "react";
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

  const [routineDay, setRoutineDay] = useState([]);
  const [RoutineWorkday, setRoutineWorkday] = useState(Hours());
  const [RoutineWeekend, setRoutineWeekend] = useState(Hours());
  const [currentValueInputText, setCurrentValueInputText] = useState("");
  const [stages, setStages] = useState("");
  const [currentDay, setCurrentDay] = useState([]);

  useEffect(() => {
    console.log(routineDay);
  }, [routineDay]);

  // Firebase routine
  async function addRoutine() {
    console.log(RoutineWeekend);
    console.log(RoutineWorkday);
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
  }

  async function getRoutine(month, day, year) {
    if (!user || typeof user !== "string") {
      return;
    }
    setLoading(false);
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

    await getWeekend();

    const isWeekend = weekend.includes(firstDayOfMonth);

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
      return;
    } catch (error) {
      console.error("Error al obtener la rutina:", error);
    }
  }

  // Firebase routine day task - porcentaje

  async function addRoutineDayTasks(
    month,
    day,
    year,
    porcentaje,
    TaskCompleted,
    TaskIncomplete,
    stages
  ) {
    try {
      const collectionName = user + "rutine";
      const collectionRef = collection(db, collectionName);
      const DaynPorcentaje = {
        [`${month}/${day}/${year}`]: {
          porcentaje,
          stages,
          TaskCompleted,
          TaskIncomplete,
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
    setLoading(false);

    const collectionName = user + "rutine";
    const collectionRef = collection(db, collectionName);
    const docRefRoutineDayPorcentaje = doc(collectionRef, "RoutineDay");

    const docSnapshot = await getDoc(docRefRoutineDayPorcentaje);

    await getWeekend();

    if (docSnapshot.exists()) {
      const data = docSnapshot.data();
      const dayInfo = await data[`${month}/${day}/${year}`];
      if (dayInfo) {
        setStages(dayInfo.stages);
        if (dayInfo.stages === "worday") {
          const combinedTasks = dayInfo.TaskCompleted.concat(
            dayInfo.TaskCompleted
          );
          combinedTasks.sort((a, b) =>
            a.hour === 24 ? -1 : b.hour === 24 ? 1 : a.hour - b.hour
          );

          setRoutineDay(combinedTasks);
        } else {
          const combinedTasks = dayInfo.TaskIncomplete.concat(
            dayInfo.TaskCompleted
          );
          combinedTasks.sort((a, b) => a.hour - b.hour);

          setRoutineDay(combinedTasks);
        }
        return dayInfo;
      } else {
        console.log("no existe");
        return null;
      }
    } else {
      setLoading(true);
      return null; // Devuelve null si el documento no existe
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
    console.log(RoutineWeekend);
    console.log(RoutineWorkday);
    setLoading(false);
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
    } finally {
      setLoading(true);
    }
  }

  // local\\

  const rutine = async () => {
    const collectionName = user + "rutine";
    const collectionRef = collection(db, collectionName);

    await collectionExists(collectionRef);
  };

  const createRoutine = () => {
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
