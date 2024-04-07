import React, { createContext, useContext, useState } from "react";
import {
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  collection,
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
  const { user } = useUser();

  const [infoOfMonth, setInfoOfMonth] = useState([]);

  // firebase

  function addTaskDay(year, monthNumber, day, taskValue) {
    return new Promise(async (resolve, reject) => {
      const monthNames = monthsNames[monthNumber - 1];
      const collectionName = user + year;

      try {
        const collectionExistsResult = await collectionExists(collectionName);
        if (collectionExistsResult) {
          try {
            const docRef = doc(db, collectionName, monthNames);

            const docSnapshot = await getDoc(docRef);
            const data = docSnapshot.data();

            if (data.hasOwnProperty(day)) {
              const arrayActual = data[day];
              arrayActual.push(taskValue);

              await updateDoc(docRef, {
                [day]: arrayActual,
              });
              resolve(true);
            } else {
              await setDoc(docRef, { [day]: [taskValue] }, { merge: true });
              resolve(true);
            }
          } catch (error) {}
          console.log(error);
        } else {
          const res = await createCollection(collectionName);

          if (res) {
            try {
              const docRef = doc(db, collectionName, monthNames);

              const docSnapshot = await getDoc(docRef);
              const data = docSnapshot.data();

              if (data.hasOwnProperty(day)) {
                const arrayActual = data[day];
                arrayActual.push(taskValue);

                await updateDoc(docRef, {
                  [day]: arrayActual,
                });
                resolve(true);
              } else {
                await setDoc(docRef, { [day]: [taskValue] }, { merge: true });
                resolve(true);
              }
            } catch (error) {}
            console.log("La colección ya existe.");
          }
          console.log(`Se ha creado la colección "${collectionName}".`);
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  function getInfoTaskDay(year, monthNumber) {
    if (!user || typeof user !== "string") {
      return;
    }

    const collectionName = user + year;

    const monthNames = monthsNames[monthNumber - 1];

    const docRef = doc(db, collectionName, monthNames);

    return getDoc(docRef)
      .then((doc) => {
        const data = doc.data();
        setInfoOfMonth(data);
      })
      .catch((error) => {
        console.error(
          "Error al obtener el documento del mes",
          monthNames,
          ":",
          error
        );
      });
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
      return true; // Indicar que se eliminó la tarea correctamente
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

      for (const monthName in months) {
        const docRef = doc(collectionRef, monthName);
        try {
          await setDoc(docRef, months[monthName]);
        } catch (error) {
          console.error("Error al crear la colección:", error);
        }
      }
      return true;
    } catch (error) {
      console.error("Error al crear la colección:", error);
      return false;
    }
  }

  return (
    <MonthDataContext.Provider
      value={{
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
