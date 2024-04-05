import React, { useState } from "react";

const Routine = ({
  hour,
  period,
  style,
  routine,
  addTask,
  deleteTask,
  routineTaskCompleted,
}) => {
  const [completTask, setCompletTask] = useState(true);

  const isTaskCompleted = routineTaskCompleted.some(
    (item) => item.hour === hour
  );

  useState(() => {
    setCompletTask(!isTaskCompleted);
  }, [isTaskCompleted]);

  const chanceStateTask = () => {
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
      {routine?.task ? completTask ? <h2>{routine.task}</h2> : "complet" : ""}

      {routine?.task && <button onClick={chanceStateTask}>complet</button>}
    </div>
  );
};

export default Routine;
