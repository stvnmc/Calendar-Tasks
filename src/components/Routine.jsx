import React from "react";

const Routine = ({ hour, period, style }) => {

  return (
    <div className={`hour ${period}`} style={style}>
      <h1>{hour} </h1>
      <div>

      </div>
    </div>
  );
};

export default Routine;
