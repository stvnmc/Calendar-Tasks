import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "./config";
import { monthsNames } from "../components/infor/MonthsDays";

export function addTaskDay(monthNumber, day, taskValue) {
  return new Promise((resolve, reject) => {
    const monthNames = monthsNames[monthNumber - 1];
    const docRef = doc(db, "2024", monthNames);

    getDoc(docRef)
      .then((doc) => {
        const data = doc.data();
        if (data.hasOwnProperty(day)) {
          // El día ya existe en el mes
          const arrayActual = data[day];
          arrayActual.push(taskValue);

          // Actualizar el documento con el nuevo valor del día
          updateDoc(docRef, {
            [day]: arrayActual,
          })
            .then(() => {
              console.log(
                "Tarea agregada al día existente",
                day,
                "en el mes",
                monthNames
              );
              resolve(true); // Resuelve la promesa con true
            })
            .catch((error) => {
              console.error("Error al actualizar el documento:", error);
              reject(error); // Rechaza la promesa con el error
            });
        } else {
          // El día no existe en el mes, crearlo y agregar la tarea
          setDoc(
            docRef,
            {
              [day]: [taskValue],
            },
            { merge: true }
          )
            .then(() => {
              console.log(
                "Nuevo día creado y tarea agregada en el mes",
                monthNames
              );
              resolve(true); // Resuelve la promesa con true
            })
            .catch((error) => {
              console.error(
                "Error al crear el nuevo día y agregar la tarea:",
                error
              );
              reject(error); // Rechaza la promesa con el error
            });
        }
      })
      .catch((error) => {
        console.error(
          "Error al obtener el documento del mes",
          monthNames,
          ":",
          error
        );
        reject(error); // Rechaza la promesa con el error
      });
  });
}

export function getInfoTaskDay(monthNumber) {
  const monthNames = monthsNames[monthNumber - 1];

  const docRef = doc(db, "2024", monthNames);

  return getDoc(docRef)
    .then((doc) => {
      const data = doc.data();
      return data; // Retornar los datos del documento
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

export async function deleteTaskDay(monthNumber, day, index) {
  const monthNames = monthsNames[monthNumber - 1];
  const docRef = doc(db, "2024", monthNames);

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
