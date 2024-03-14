import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { SlArrowUp, SlArrowDown } from "react-icons/sl";
import { dayNames, monthsNames } from "../components/infor/MonthsDays";

import DayContainer from "../components/DayContainer";

import { useMonthData } from "../context/MonthDataContext";
import { Loading } from "../components/Loading";
import { useUser } from "../context/userContext";

const Month = () => {
  const { id1, id2 } = useParams();

  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [infoCalendar, setinfoCalendar] = useState(null);

  const { getInfoTaskDay } = useMonthData();
  const { user } = useUser();

  useEffect(() => {
    getInfoCalendar();
    getInfoTaskDay(id2, id1);
  }, [user, id1]);

  const getInfoCalendar = async () => {
    setLoading(false);

    try {
      const formerPromise = getDaysMonth("former");
      const currentPromise = getDaysMonth("current");

      // Obtener la información de los meses de forma asincrónica
      const [former, current] = await Promise.all([
        formerPromise,
        currentPromise,
      ]);

      let next; // Declarar next aquí

      // Determinar si se necesita obtener el próximo mes
      if (current.length + former.length > 34) {
        next = getDaysMonth("next").reverse().slice(7).reverse();
      } else {
        next = getDaysMonth("next");
      }

      // Combinar la información de los tres meses
      const calendarInfo = [...former, ...current, ...next];
      setinfoCalendar(calendarInfo);

      setLoading(true);
    } catch (error) {
      console.error("Error al obtener el calendario:", error);
    }
  };

  const getDaysMonth = (type) => {
    const idAdjustment = (e) => {
      if (e === "date") {
        return type === "next"
          ? parseInt(id1) + 1
          : type === "former"
          ? id1 - 1
          : id1;
      }
      if (e === "day") {
        return type === "next"
          ? id1
          : type === "former"
          ? parseInt(id1) - 2
          : id1 - 1;
      }
    };

    const daysInMonth = new Date(id2, idAdjustment("date"), 0).getDate();
    const firstDayOfMonth = new Date(id2, idAdjustment("day"), 1).getDay();

    const daysArray = Array.from({ length: daysInMonth }, (_, i) => ({
      month: id1,
      id2: id2,
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
    let newId = parseInt(id1) + delta;
    let newYear = id2;

    if (newId < 1) {
      newId = 12;
      newYear--;
    } else if (newId > 12) {
      newId = 1;
      newYear++;
    }

    const nuevaFecha = `/month/${newId}/${newYear}`;
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
            {dayNames[new Date().getDay()]}, {new Date().getDate()}{" "}
            {monthsNames[new Date().getMonth()]} {new Date().getFullYear()}
          </div>
          <div className="month-chanceMonth">
            <a>
              {monthsNames[id1 - 1]} {id2}
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
          <div className="days" id1="scrollable" onWheel={handleScroll}>
            {infoCalendar?.map(
              ({ dayNumber, dayOfWeek, month, type }, index) => (
                <DayContainer
                  key={index}
                  dayNumber={dayNumber}
                  month={month}
                  type={type}
                  year={id2}
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
