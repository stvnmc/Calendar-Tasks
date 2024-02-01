import { useParams, useNavigate } from "react-router-dom";
import { dayNames, monthNames } from "../components/MonthsDays";
import { SlArrowUp } from "react-icons/sl";
import { SlArrowDown } from "react-icons/sl";
import { useState } from "react";

const Month = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [year, setYear] = useState(2024);

  const daysInMonth = new Date(year, id, 0).getDate();

  const firstDayOfMonth = new Date(year, id - 1, 1).getDay();

  // current month
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => {
    const dayNumber = i + 1;
    const dayOfWeek = (firstDayOfMonth + i) % 7;
    return { dayNumber, dayOfWeek };
  });

  // former month
  const daysInMonthFormerMonth = new Date(year, id - 1, 0).getDate();
  const firstDayOfMonthFormer = new Date(year, id - 2, 1).getDay();

  const daysArrayFormerMonth = Array.from(
    { length: daysInMonthFormerMonth },
    (_, i) => {
      const dayNumber = i + 1;
      const dayOfWeek = (firstDayOfMonthFormer + i) % 7;
      return { dayNumber, dayOfWeek };
    }
  );

  const reversedArray = daysArrayFormerMonth.slice().reverse(); // Copia y revierte el array original

  let extractedArray = [];

  for (const day of reversedArray) {
    console.log(day);
    if (day.dayOfWeek === 6) {
      break;
    }
    extractedArray.unshift(day);

    if (day.dayOfWeek === 0) {
      break;
    }
  }

  // next month
  const daysInMonthNextMonth = new Date(year, id + 1, 0).getDate();
  const firstDayOfMonthNext = new Date(year, id, 1).getDay();

  const daysArrayFormerNext = Array.from(
    { length: daysInMonthNextMonth },
    (_, i) => {
      const dayNumber = i + 1;
      const dayOfWeek = (firstDayOfMonthNext + i) % 7;
      return { dayNumber, dayOfWeek };
    }
  );

  const reversedArrayNext = daysArrayFormerNext;

  let extractedArrayNext = [];

  let i = 0;
  for (const day of reversedArrayNext) {
    // if (day.dayOfWeek === 0) {
    //   break;
    // }
    extractedArrayNext.push(day);

    if (day.dayOfWeek === 6) {
      i++;
    }
    if (i == 2) {
      break;
    }
    console.log(i);
  }

  console.log("next", extractedArrayNext);

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
        {dayNames.map((dayName) => (
          <div key={dayName}>{dayName}</div>
        ))}
      </div>
      <div className="days">
        {extractedArray.map(({ dayNumber, dayOfWeek }) => (
          <div
            key={dayNumber}
            className="containers"
            style={{ gridColumn: `${dayOfWeek + 1}` }}
          >
            {dayNumber}
          </div>
        ))}
        {daysArray.map(({ dayNumber, dayOfWeek }) => (
          <div
            key={dayNumber}
            className="containers"
            style={{ gridColumn: `${dayOfWeek + 1}` }}
          >
            {dayNumber}
          </div>
        ))}
        {extractedArrayNext.map(({ dayNumber, dayOfWeek }) => (
          <div
            key={dayNumber}
            className="containers"
            style={{ gridColumn: `${dayOfWeek + 1}` }}
          >
            {dayNumber}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Month;
