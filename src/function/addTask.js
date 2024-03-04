import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import { monthsNames } from "../components/infor/MonthsDays";

export function addTaskDay(monthNumber, day, taskValue) {
  const monthNames = monthsNames[monthNumber - 1];
  const docRef = doc(db, "2024", monthNames);

  getDoc(docRef)
    .then((doc) => {
      if (doc.exists()) {
        const data = doc.data();
        if (data.hasOwnProperty(day)) {
          // El día ya existe en el mes
          const arrayActual = data[day];
          arrayActual.push(taskValue);

          // Actualizar el documento con el nuevo valor del día
          updateDoc(docRef, {
            [day]: arrayActual
          })
            .then(() => {
              console.log("Tarea agregada al día existente", day, "en el mes", monthNames);
            })
            .catch((error) => {
              console.error("Error al actualizar el documento:", error);
            });
        } else {
          // El día no existe en el mes, crearlo y agregar la tarea
          setDoc(docRef, {
            [day]: [taskValue]
          }, { merge: true })
            .then(() => {
              console.log("Nuevo día creado y tarea agregada en el mes", monthNames);
            })
            .catch((error) => {
              console.error("Error al crear el nuevo día y agregar la tarea:", error);
            });
        }
      } else {
        console.log("El documento para el mes", monthNames, "no existe.");
      }
    })
    .catch((error) => {
      console.error("Error al obtener el documento del mes", monthNames, ":", error);
    });
}
