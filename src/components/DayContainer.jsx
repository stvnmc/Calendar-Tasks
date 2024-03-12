import { useNavigate } from "react-router-dom";
import { IoMdAdd } from "react-icons/io";
import { FaCheck } from "react-icons/fa";
import { useEffect, useState } from "react";
import { addTaskDay, deleteTaskDay } from "../firebase/TaskData";
import { useInfoMonth } from "../context/InfoMonthContext";

const DayContainer = ({ dayNumber, dayOfWeek, month, type, year }) => {
  const [createTask, setCreateTask] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [infoTask, setInfoTask] = useState([]);
  const navigate = useNavigate();

  const { infoOfMonth, getInfoMonthFirestore } = useInfoMonth();

  useEffect(() => {
    setInfoTask([]);
    if (dayNumber in infoOfMonth) {
      const infoOfDay = infoOfMonth[dayNumber];
      setInfoTask(infoOfDay);
    }
  }, [infoOfMonth]);

  const goToPageDay = () => {
    const nuevaFecha = `/m/${month}/d/${dayNumber}/y/${year}`;
    navigate(nuevaFecha);
  };

  const addTask = async () => {
    const refresh = await addTaskDay(month, dayNumber, inputValue);
    console.log(refresh);
    if (refresh === true) {
      getInfoMonthFirestore(month);
      console.log("ok");
    }
    setInputValue("");
    setCreateTask(false);
  };

  const deletTask = async (index) => {
    const deleted = await deleteTaskDay(month, dayNumber, index);
    if (deleted) {
      // La tarea se eliminó correctamente, actualiza la información del mes
      getInfoMonthFirestore(month);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      addTask();
    }
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
        <button onClick={() => setCreateTask(true)}>
          <IoMdAdd />
        </button>
      </div>
      {createTask ? (
        <div className="create-task">
          <input
            type="text"
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
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
              {Array.isArray(infoTask) &&
                infoTask.map((item, index) => (
                  <div key={index}>
                    <h1>{item}</h1>
                    <button onClick={() => deletTask(index)}>delet</button>
                  </div>
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
