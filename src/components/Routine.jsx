import React, { useState } from "react";
//icons
import { CiBookmarkPlus } from "react-icons/ci";
import { CiBookmarkCheck } from "react-icons/ci";
import { MdWbSunny } from "react-icons/md";
import { IoMdMoon } from "react-icons/io";

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
      <div>
        <div>{completTask ? <CiBookmarkCheck /> : <CiBookmarkPlus />}</div>
        <h2>{routine?.task}</h2>
        {dayExists && (
          <button onClick={chanceStateTask}>
            {completTask ? "incomplet" : "complet"}
          </button>
        )}
      </div>
    );
  };

  return (
    <div className={`hour ${period}`} style={style}>
      {period === "early-Morning" || period === "night" ? (
        <IoMdMoon />
      ) : (
        <MdWbSunny />
      )}

      <h1>{hour}:00</h1>
      {renderTaskSection()}
    </div>
  );
};

export default Routine;
