import { useNavigate } from "react-router-dom";
import { IoMdAdd } from "react-icons/io";
import { FaCheck } from "react-icons/fa";
import { useState } from "react";
import { db } from "../firebase/config";
import { addDoc, collection, doc, getDoc, setDoc } from "firebase/firestore";
import { addTaskDay } from "../function/addTask";

const DayContainer = ({ dayNumber, dayOfWeek, month, type, year }) => {
  const [createTask, setCreateTask] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [infoTask, setInfoTask] = useState([]);

  const navigate = useNavigate();

  const goToPageDay = () => {
    const nuevaFecha = `/m/${month}/d/${dayNumber}/y/${year}`;
    navigate(nuevaFecha);
  };

  const addTask = () => {
    setCreateTask(true);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      // console.log(inputValue);
      addTaskDay(month, dayNumber, inputValue);
      // setInfoTask((prev) => [...prev, inputValue]);
      setInputValue("");
      setCreateTask(false);

    }
  };

  // const docRef = doc(db, "2024", "enero");

  // // Obtener el documento
  // getDoc(docRef)
  //   .then((doc) => {
  //     if (doc.exists()) {
  //       const data = doc.data();

  //       console.log(data);
  //       // Verificar si la clave 1 existe en los datos
  //       if (data.hasOwnProperty(1)) {
  //         // Obtener el array actual asociado a la clave 1
  //         const arrayActual = data[1];

  //         // Agregar el nuevo string al array actual
  //         const nuevoString = "nuevo string";
  //         arrayActual.push(nuevoString);

  //         // Actualizar los datos con el nuevo array
  //         data[1] = arrayActual;

  //         // Guardar los cambios en Firestore
  //         setDoc(docRef, data)
  //           .then(() => {
  //             console.log(
  //               "Nuevo string agregado al array del documento 'enero'."
  //             );
  //           })
  //           .catch((error) => {
  //             console.error(
  //               "Error al actualizar el documento 'enero':",
  //               error
  //             );
  //           });
  //       } else {
  //         console.log("La clave 1 no está presente en los datos.");
  //       }
  //     } else {
  //       console.log("El documento 'enero' no existe.");
  //     }
  //   })
  //   .catch((error) => {
  //     console.error("Error al obtener el documento 'enero':", error);
  //   });

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  return (
    <div
      // onClick={goToPageDay}
      id={dayNumber}
      className={`containers num${dayNumber} ${type}`}
      style={{ gridColumn: `${dayOfWeek + 1}` }}
    >
      <div className="icons">
        <div>{dayNumber}</div>
        <button onClick={addTask}>
          <IoMdAdd />
        </button>
      </div>
      {createTask ? (
        <div className="create-task">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            autoFocus
          />
          <button onClick={handleKeyPress}>
            <FaCheck />
          </button>
        </div>
      ) : (
        <div>
          <div>
            {infoTask.map((item, index) => (
              <h1 key={index}>{item}</h1>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DayContainer;
