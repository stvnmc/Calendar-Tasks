import React, { createContext, useContext, useState } from "react";
import {
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  collection,
  writeBatch,
} from "firebase/firestore";

import { db } from "../firebase/config";
import { months, monthsNames } from "../components/infor/MonthsDays";
import { useUser } from "./userContext";

export const MonthDataContext = createContext();

export const useMonthData = () => {
  const context = useContext(MonthDataContext);

  if (!context) {
    console.log("need login");
  }
  return context;
};

export const MonthDataProvider = ({ children }) => {
  const [loadingMonth, setLoadingMonth] = useState(true);
  const [infoOfMonth, setInfoOfMonth] = useState([]);

  const { user } = useUser();
  // firebase

  async function getInfoTaskDay(year, monthNumber) {
    if (!user || typeof user !== "string") {
      return;
    }
    try {
      const collectionName = user + year;

      const ress = await collectionExists(collectionName);

      if (!ress) {
        await createCollection(collectionName);
        return;
      }
      const monthNames = monthsNames[monthNumber - 1];

      const docRef = doc(db, collectionName, monthNames);

      const res = await getDoc(docRef);

      const data = res.data();

      setInfoOfMonth(data);
    } catch (error) {
      console.log(error);
    }
  }

  async function addTaskDay(year, monthNumber, day, taskValue) {
    const monthNames = monthsNames[monthNumber - 1];
    const collectionName = user + year;

    const docRef = doc(db, collectionName, monthNames);
    try {
      const docSnapshot = await getDoc(docRef);
      const data = docSnapshot.data();
      if (data.hasOwnProperty(day)) {
        const arrayActual = data[day];
        arrayActual.push(taskValue);

        await updateDoc(docRef, {
          [day]: arrayActual,
        });
      } else {
        await setDoc(docRef, { [day]: [taskValue] }, { merge: true });
      }
      await getInfoTaskDay(year, monthNumber);
    } catch (error) {
      console.log(error);
    }
  }

  async function deleteTaskDay(year, monthNumber, day, index) {
    const monthNames = monthsNames[monthNumber - 1];

    const collectionName = user + year;

    const docRef = doc(db, collectionName, monthNames);

    try {
      const docSnap = await getDoc(docRef);

      const data = docSnap.data();

      const updatedTasks = data[day].filter((_, i) => i !== index);
      await updateDoc(docRef, {
        [day]: updatedTasks,
      });

      await getInfoTaskDay(year, monthNumber);
    } catch (error) {
      console.error("Error al eliminar la tarea:", error);
    }
  }

  // create collection
  async function collectionExists(collectionName) {
    try {
      const querySnapshot = await getDocs(collection(db, collectionName));
      // Si no hay documentos en la colección, consideramos que la colección existe
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
      const collectionRef = collection(db, collectionName);
      const batch = writeBatch(db);

      for (const monthName in months) {
        const docRef = doc(collectionRef, monthName);
        batch.set(docRef, months[monthName]);
      }

      await batch.commit();
      return true;
    } catch (error) {
      console.error("Error al crear la colección:", error);
      return false;
    }
  }

  return (
    <MonthDataContext.Provider
      value={{
        loadingMonth,
        setLoadingMonth,
        infoOfMonth,
        addTaskDay,
        getInfoTaskDay,
        deleteTaskDay,
        setInfoOfMonth,
      }}
    >
      {children}
    </MonthDataContext.Provider>
  );
};
