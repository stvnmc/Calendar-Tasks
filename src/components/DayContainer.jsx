import { useNavigate } from "react-router-dom";
import { IoMdAdd } from "react-icons/io";
import { FaCheck } from "react-icons/fa";
import { useEffect, useState } from "react";
// import { db } from "../firebase/config";
// import { addDoc, collection, doc, getDoc, setDoc } from "firebase/firestore";
import { addTaskDay } from "../function/addTask";
import { useInfoMonth } from "../context/InfoMonthContext";

const DayContainer = ({ dayNumber, dayOfWeek, month, type, year }) => {
  const [createTask, setCreateTask] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [infoTask, setInfoTask] = useState([]);

  const { infoOfMonth, getInfoMonthFirestore } = useInfoMonth();

  useEffect(() => {
    setInfoTask([]);
    if (dayNumber in infoOfMonth) {
      // El número está presente como una clave en el objeto
      // Puedes acceder al valor correspondiente utilizando la clave
      const infoOfDay = infoOfMonth[dayNumber];
      setInfoTask(infoOfDay);
    }
  }, [infoOfMonth]);

  const navigate = useNavigate();

  const goToPageDay = () => {
    const nuevaFecha = `/m/${month}/d/${dayNumber}/y/${year}`;
    navigate(nuevaFecha);
  };

  const openAddTask = () => {
    setCreateTask(true);
  };

  const addTask = async () => {
    try {
      const refresh = await addTaskDay(month, dayNumber, inputValue);
      console.log(refresh);
      if (refresh === true) {
        getInfoMonthFirestore(month);
        console.log("ok");
      }
      setInputValue("");
      setCreateTask(false);
    } catch (error) {
      console.error("Error al agregar la tarea:", error);
      // Manejar el error según sea necesario
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      addTask();
    }
  };

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
        <button onClick={openAddTask}>
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
          <button onClick={addTask}>
            <FaCheck />
          </button>
        </div>
      ) : (
        <div>
          {type === "current" ? (
            <div>
              {infoTask.map((item, index) => (
                <h1 key={index}>{item}</h1>
              ))}
            </div>
          ) : (
            <div></div>
          )}
        </div>
      )}
    </div>
  );
};

export default DayContainer;
