import React from "react";

const Routine = ({ hour, period, style, routine }) => {
  return (
    <div className={`hour ${period}`} style={style}>
      <h1>{hour}</h1>
      <h2>{routine && routine.task ? routine.task : "///"}</h2>
    </div>
  );
};

export default Routine;

