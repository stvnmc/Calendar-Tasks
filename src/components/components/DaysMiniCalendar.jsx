import React from "react";

export const DaysMiniCalendar = ({ item, goDay, month, day, year }) => {
  return (
    <button
      onClick={() => goDay(month, item.dayNumber, year)}
      className={
        item.type === "current" && item.dayNumber === parseInt(day)
          ? "day-mini-calendar today "
          : "day-mini-calendar"
      }
    >
      <h2>{item.dayNumber}</h2>
    </button>
  );
};
