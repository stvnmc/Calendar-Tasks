import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

// icons
import { IoMdAdd } from "react-icons/io";
import { FaCheck } from "react-icons/fa";
import { FaList } from "react-icons/fa6";

import { useMonthData } from "../context/MonthDataContext";
import { Loading } from "./Loading";

const DayContainer = ({ dayNumber, dayOfWeek, month, type, year }) => {
  const [createTask, setCreateTask] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [infoTask, setInfoTask] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const { infoOfMonth, getInfoTaskDay, addTaskDay, deleteTaskDay } =
    useMonthData();

  useEffect(() => {
    if (infoOfMonth && dayNumber in infoOfMonth) {
      const infoOfDay = infoOfMonth[dayNumber];
      setInfoTask(infoOfDay);
    }
  }, [infoOfMonth, dayNumber]);

  useEffect(() => {
    setInfoTask([]);
  }, []);

  const goToPageDay = () => {
    console.log(dayNumber);
    const nuevaFecha = `/m/${month}/d/${dayNumber}/y/${year}`;
    navigate(nuevaFecha);
  };

  const addTask = async () => {
    setLoading(false);
    try {
      const refresh = await addTaskDay(year, month, dayNumber, inputValue);

      if (refresh === true) {
        getInfoTaskDay(year, month);
      }
      setInputValue("");
      setCreateTask(false);
      setLoading(true);
    } catch (error) {}
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
      id={dayNumber}
      className={`containers num${dayNumber} ${type}`}
      style={{ gridColumn: `${dayOfWeek + 1}` }}
    >
      <div className="icons">
        <div>{dayNumber}</div>
        {type === "current" ? (
          <div>
            <button onClick={goToPageDay}>
              <FaList />
            </button>
            <button onClick={() => setCreateTask(true)}>
              <IoMdAdd />
            </button>
          </div>
        ) : (
          ""
        )}
      </div>
      {loading ? (
        createTask ? (
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
                  infoTask.map((item, index) => {
                    return (
                      <div key={index}>
                        <h1>{item}</h1>
                        <button onClick={() => deletTask(index)}>delete</button>
                      </div>
                    );
                  })}
              </div>
            ) : (
              <div></div>
            )}
          </div>
        )
      ) : (
        <Loading />
      )}
    </div>
  );
};

export default DayContainer;
