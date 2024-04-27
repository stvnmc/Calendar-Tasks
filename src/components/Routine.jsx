import React, { useState } from "react";
//icons

import { MdWbSunny } from "react-icons/md";
import { IoMdMoon } from "react-icons/io";
import { IoMdAdd } from "react-icons/io";

const Routine = ({
  hour,
  period,
  style,
  routine,
  setNewRoutineDay,
  dayExists,
}) => {
  const [completTask, setCompletTask] = useState(routine?.completed);

  const chanceStateTask = () => {
    if (completTask) {
      setNewRoutineDay(hour, false);
    } else {
      setNewRoutineDay(hour, true);
    }
    setCompletTask(!completTask);
  };

  const renderTaskSection = () => {
    if (!routine?.task) return null;

    return (
      <>
        <div className="task-routine">
          <h2>{routine?.task}</h2>
          {dayExists && (
            <button
              onClick={chanceStateTask}
              className={completTask ? "none" : "incomplet"}
            >
              <IoMdAdd />
            </button>
          )}
        </div>
      </>
    );
  };

  return (
    <div className={`hour ${period}`} style={style}>
      <div className="title-hour">
        <h1>{hour}:00</h1>
        {period === "early-Morning" || period === "night" ? (
          <IoMdMoon />
        ) : (
          <MdWbSunny />
        )}
      </div>
      {renderTaskSection()}
    </div>
  );
};

export default Routine;
