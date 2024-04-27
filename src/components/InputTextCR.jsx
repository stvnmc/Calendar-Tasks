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
    let taskText = "";

    if (stages === "weekend") {
      RoutineWeekend.forEach((item) => {
        if (item.hour === hourObj.hour) {
          taskText = item.task;
        }
      });
    } else {
      RoutineWorkday.forEach((item) => {
        if (item.hour === hourObj.hour) {
          taskText = item.task;
        }
      });
    }

    setTask(taskText);
  };

  const handleEnterPress = (e) => {
    if (e.key === "Enter") {
      handleAddTask();
    }
  };

  const handleAddTask = () => {
    addInfoRoutine(hourObj.hour, currentValueInputText);
    setOpenAddTask(false);
  };

  return (
    <div className={`hour ${hourObj.period}`} style={hourObj.style}>
      <div className="title-create">
        <h1>{hourObj.hour}</h1>
        <button
          onClick={() => setOpenAddTask(!openAddTask)}
          className={`create-input ${openAddTask}`}
        >
          <IoMdAdd />
        </button>
      </div>

      {openAddTask ? (
        <div className="input-create-routine">
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
      ) : Task === "" ? (
        <ul className="lines">
          <li></li>
          <li></li>
        </ul>
      ) : (
        <h2>{Task}</h2>
      )}
    </div>
  );
};

export default InputTextCR;
