import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { SlArrowUp, SlArrowDown } from "react-icons/sl";
import { dayNames, monthNames } from "../components/infor/MonthsDays";

const DayContainer = ({ dayNumber, dayOfWeek }) => (
  <div className="containers" style={{ gridColumn: `${dayOfWeek + 1}` }}>
    {dayNumber}
  </div>
);

const Month = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [year, setYear] = useState(2024);
  const [time, setTime] = useState(new Date());

  const getInfoMonth = (type) => {
    const idAdjustment = (e) => {
      if (e === "date") {
        return type === "next"
          ? parseInt(id) + 1
          : type === "former"
          ? id - 1
          : id;
      }
      if (e === "day") {
        return type === "next"
          ? id
          : type === "former"
          ? parseInt(id) - 2
          : id - 1;
      }
    };

    const daysInMonth = new Date(year, idAdjustment("date"), 0).getDate();
    const firstDayOfMonth = new Date(year, idAdjustment("day"), 1).getDay();

    const daysArray = Array.from({ length: daysInMonth }, (_, i) => ({
      dayNumber: i + 1,
      dayOfWeek: (firstDayOfMonth + i) % 7,
    }));

    if (type === "next") {
      const reversedArrayNext = daysArray;
      let extractedArrayNext = [];
      let i = 0;
      for (const day of reversedArrayNext) {
        extractedArrayNext.push(day);
        if (day.dayOfWeek === 6 && ++i === 2) break;
      }
      return extractedArrayNext;
    }

    if (type === "former") {
      const reversedArray = daysArray.slice().reverse();
      let extractedArray = [];
      for (const day of reversedArray) {
        if (day.dayOfWeek === 6) break;
        extractedArray.unshift(day);
        if (day.dayOfWeek === 0) break;
      }
      return extractedArray;
    }

    return daysArray;
  };

  const handleMonthChange = (delta) => {
    let newId = parseInt(id) + delta;
    let newYear = year;

    if (newId < 1) {
      newId = 12;
      newYear--;
    } else if (newId > 12) {
      newId = 1;
      newYear++;
    }

    const nuevaFecha = `/month/${newId}`;
    setYear(newYear);
    navigate(nuevaFecha);
  };

  return (
    <div className="container">
      <div>
        {dayNames[time.getDay()]}, {time.getDate()} {" "}
        {monthNames[time.getMonth()]} {time.getFullYear()}
      </div>
      <div className="month-chanceMonth">
        <h2>
          {monthNames[id - 1]} {year}
        </h2>
        <div>
          <a onClick={() => handleMonthChange(-1)}>
            <SlArrowUp />
          </a>
          <a onClick={() => handleMonthChange(1)}>
            <SlArrowDown />
          </a>
        </div>
      </div>
      <div className="days-of-week">
        {dayNames.map((dayName, index) => (
          <div key={index}>{dayName}</div>
        ))}
      </div>
      <div className="days">
        {getInfoMonth("former").map(({ dayNumber, dayOfWeek }, index) => (
          <DayContainer
            key={index}
            dayNumber={dayNumber}
            dayOfWeek={dayOfWeek}
          />
        ))}
        {getInfoMonth("current").map(({ dayNumber, dayOfWeek }, index) => (
          <DayContainer
            key={index}
            dayNumber={dayNumber}
            dayOfWeek={dayOfWeek}
          />
        ))}
        {getInfoMonth("current").length + getInfoMonth("former").length > 34
          ? getInfoMonth("next")
              .reverse()
              .slice(7)
              .reverse()
              .map(({ dayNumber, dayOfWeek }, index) => (
                <DayContainer
                  key={index}
                  dayNumber={dayNumber}
                  dayOfWeek={dayOfWeek}
                />
              ))
          : getInfoMonth("next").map(({ dayNumber, dayOfWeek }, index) => (
              <DayContainer
                key={index}
                dayNumber={dayNumber}
                dayOfWeek={dayOfWeek}
              />
            ))}
      </div>
    </div>
  );
};

export default Month;
