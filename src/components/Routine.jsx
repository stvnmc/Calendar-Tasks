import React, { useState } from "react";

const Routine = ({ hour, period, style, routine, addTask, deleteTask }) => {
  const [completTask, setCompletTask] = useState(true);

  const chanceStateTask = () => {
    if (completTask) {
      addTask(hour, routine.task);
    } else {
      deleteTask(hour);
    }
    setCompletTask(!completTask);
  };

  return (
    <div className={`hour ${period}`} style={style} onClick={chanceStateTask}>
      <h1>{hour}</h1>

      {routine?.task ? completTask ? <h2>{routine.task}</h2> : "complet" : ""}
    </div>
  );
};

export default Routine;
