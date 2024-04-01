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

    await createCollection(collectionRef);
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
    if (DaysOfWeekend) {
      setWeekend(DaysOfWeekend.weekend);
    } else {
      setWeekend([]);
    }

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
      console.log(routineData);
      setRoutineDay(routineData);

      // loging
      setLoading(true);
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
    try {
      const collectionName = user + "rutine";
      const collectionRef = collection(db, collectionName);
      const docRefRoutineDayPorcentaje = doc(collectionRef, "RoutineDay");

      const docSnapshot = await getDoc(docRefRoutineDayPorcentaje);
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        const dayInfo = data[`${month}/${day}/${year}`];
        if (dayInfo && dayInfo.stages) {
          setStages(dayInfo.stages);
          return dayInfo;
        } else {
          console.log(
            "La información de la rutina para el día especificado no tiene la estructura esperada."
          );
        }
      }
    } catch (error) {
      console.error("Error al obtener la información de la rutina:", error);
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
    console.log(weekend);
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
        addRoutineDayTasks,
        getRoutineDayTasks,
      }}
    >
      {children}
    </RoutineContext.Provider>
  );
};
