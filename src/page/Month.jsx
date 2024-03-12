import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { SlArrowUp, SlArrowDown } from "react-icons/sl";
import { dayNames, monthsNames } from "../components/infor/MonthsDays";

import DayContainer from "../components/DayContainer";

import { useInfoMonth } from "../context/InfoMonthContext";
import { Loading } from "../components/Loading";

const Month = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [year, setYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(false);
  const [infoCalendar, setinfoCalendar] = useState(null);

  const { getInfoMonthFirestore } = useInfoMonth();

  useEffect(() => {
    getInfoCalendar();
    getInfoMonthFirestore(id);
    console.log("new");
  }, [id]);

  const getInfoCalendar = () => {
    setLoading(false);

    try {
      const former = getInfoMonth("former");
      const current = getInfoMonth("current");
      let next;

      if (current.length + former.length > 34) {
        next = getInfoMonth("next").reverse().slice(7).reverse();
      } else {
        next = getInfoMonth("next");
      }

      setinfoCalendar([...former, ...current, ...next]);
      setLoading(true);
    } catch (error) {
      console.error("Error al obtener el calendario:", error);
      setLoading(false);
    }
  };

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
      month: id,
      year: year,
      type: type,
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

  const handleScroll = (event) => {
    const deltaY = event.deltaY;

    if (deltaY > 0) {
      handleMonthChange(1);
    } else {
      handleMonthChange(-1);
    }
  };

  return (
    <div className="container">
      {loading ? (
        <>
          <div>
            {/* <button onClick={addmeseback}>add meses</button> */}
            {dayNames[new Date().getDay()]}, {new Date().getDate()}{" "}
            {monthsNames[new Date().getMonth()]} {new Date().getFullYear()}
          </div>
          <div className="month-chanceMonth">
            <a>
              {monthsNames[id - 1]} {year}
            </a>
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
          <div className="days" id="scrollable" onWheel={handleScroll}>
            {infoCalendar?.map(
              ({ dayNumber, dayOfWeek, month, type }, index) => (
                <DayContainer
                  key={index}
                  dayNumber={dayNumber}
                  month={month}
                  type={type}
                  year={year}
                  dayOfWeek={dayOfWeek}
                />
              )
            )}
          </div>
        </>
      ) : (
        <Loading />
      )}
    </div>
  );
};

export default Month;
