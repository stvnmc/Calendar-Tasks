import React, { useState } from "react";

const Routine = ({ hour, period, style, routine, addTask, deleteTask }) => {
  const { task, completed } = routine;

  const [completTask, setCompletTask] = useState(completed);

  const chanceStateTask = () => {
    console.log(completTask)
    if (completTask) {
      addTask(hour);
    } else {
      deleteTask(hour);
    }
    setCompletTask(!completTask);
  };

  return (
    <div className={`hour ${period}`} style={style}>
      <h1>{hour}</h1>
      {task ? completed ? "complet" : <h2>{task}</h2> : ""}

      {task && <button onClick={chanceStateTask}>complet</button>}
    </div>
  );
};

export default Routine;
