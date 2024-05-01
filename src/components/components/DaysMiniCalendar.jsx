import React from "react";

export const DaysMiniCalendar = ({ item, goDay, month, day, year }) => {
  return (
    <button
      onClick={() => goDay(month, item.dayNumber, year, item.type)}
      className={
        item.type === "current" && item.dayNumber === parseInt(day)
          ? `day-mini-calendar today ${item.type}`
          : `day-mini-calendar ${item.type}`
      }
    >
      <h2>{item.dayNumber}</h2>
    </button>
  );
};
