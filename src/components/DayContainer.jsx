import { useNavigate } from "react-router-dom";
import { IoMdAdd } from "react-icons/io";
import { FaCheck } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useMonthData } from "../context/MonthDataContext";

const DayContainer = ({ dayNumber, dayOfWeek, month, type, year }) => {
  const [createTask, setCreateTask] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [infoTask, setInfoTask] = useState([]);
  const navigate = useNavigate();

  const { infoOfMonth, getInfoTaskDay, addTaskDay, deleteTaskDay } =
    useMonthData();

  useEffect(() => {
    setInfoTask([]);
    if (infoOfMonth && dayNumber in infoOfMonth) {
      const infoOfDay = infoOfMonth[dayNumber];
      setInfoTask(infoOfDay);
    }
  }, [infoOfMonth, dayNumber]);

  const goToPageDay = () => {
    const nuevaFecha = `/m/${month}/d/${dayNumber}/y/${year}`;
    navigate(nuevaFecha);
  };

  const addTask = async () => {
    const refresh = await addTaskDay(year, month, dayNumber, inputValue);

    if (refresh === true) {
      getInfoTaskDay(year, month);
    }
    setInputValue("");
    setCreateTask(false);
  };

  const deletTask = async (index) => {
    const deleted = await deleteTaskDay(year, month, dayNumber, index);

    if (deleted) {
      getInfoTaskDay(year, month);
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
        {type === "current" ? (
          <button onClick={() => setCreateTask(true)}>
            <IoMdAdd />
          </button>
        ) : (
          ""
        )}
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
