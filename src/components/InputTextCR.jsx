import React, { useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";

const InputTextCR = ({
  hourObj,
  addInfoRoutine,
  setCurrentValueInputText,
  currentValueInputText,
  RoutineWorkday,
  RoutineWeekend,
  stages,
}) => {
  const [openAddTask, setOpenAddTask] = useState(false);
  const [Task, setTask] = useState("");

  useEffect(() => {
    showInfoTask();
  }, [RoutineWorkday, RoutineWeekend, stages]);

  const showInfoTask = () => {
    if (stages === "weekend") {
      setTask(
        RoutineWeekend.map((item) => {
          if (item.hour === hourObj.hour) {
            return item.task;
          }
        })
      );
    } else {
      setTask(
        RoutineWorkday.map((item) => {
          if (item.hour === hourObj.hour) {
            return item.task;
          }
        })
      );
    }
  };

  const handleEnterPress = (e) => {
    if (e.key === "Enter") {
      addInfoRoutine(hourObj.hour, currentValueInputText);
      setOpenAddTask(false);
    }
  };

  const handleAddTask = () => {
    addInfoRoutine(hourObj.hour, currentValueInputText);
    setOpenAddTask(false);
  };

  return (
    <div className={`hour ${hourObj.period}`} style={hourObj.style}>
      <h1>{hourObj.hour}</h1>
      {openAddTask ? (
        <div>
          <input
            type="text"
            placeholder="Task"
            value={currentValueInputText}
            onChange={(e) => setCurrentValueInputText(e.target.value)}
            onKeyPress={handleEnterPress}
            autoFocus
            onFocus={(e) => e.target.select()}
          />
          <button onClick={handleAddTask}>
            <FaCheck />
          </button>
        </div>
      ) : (
        <button onClick={() => setOpenAddTask(true)}>
          <IoMdAdd />
        </button>
      )}

      <h4>{Task}</h4>
    </div>
  );
};

export default InputTextCR;
