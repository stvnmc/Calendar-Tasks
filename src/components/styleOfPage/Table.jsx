import React from "react";

function Table() {
  const textos = {
    workDay: ["Eat", "Study", "Exercise"],
    weekend: ["Rest", "Clean", "Play"],
  };

  return (
    <>
      <div className="contSecond">
        <h1>WorkDay</h1>
        <div className="listTask">
          {textos.workDay.map((item, i) => (
            <h2 key={i}>{item}</h2>
          ))}
        </div>
      </div>
      <div className="contSecond">
        <h1>Weekend</h1>
        <div className="listTask">
          {textos.weekend.map((item, i) => (
            <h2 key={i}>{item}</h2>
          ))}
        </div>
      </div>
    </>
  );
}

export default Table;
