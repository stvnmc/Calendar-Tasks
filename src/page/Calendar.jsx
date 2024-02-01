import React from "react";
import { monthNames } from "../components/MonthsDays";

const Calendar = () => {
  return (
    <div className="containers">
      <h1>Selecciona un mes: </h1>
      <div className="containers">
        {monthNames.map((month, index) => (
          <div key={index} className="container">
            <a href={`/month/${1 + index}`}>{month}</a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
