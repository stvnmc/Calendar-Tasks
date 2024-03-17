import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { SlArrowUp, SlArrowDown } from "react-icons/sl";
import { dayNames, monthsNames } from "../components/infor/MonthsDays";

import DayContainer from "../components/DayContainer";

import { useMonthData } from "../context/MonthDataContext";
import { Loading } from "../components/Loading";
import { useUser } from "../context/userContext";
import { getInfoCalendar } from "../components/FunctionGetCalendar";

const Month = () => {
  const { id1, id2 } = useParams();

  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [infoCalendar, setinfoCalendar] = useState([]);

  const { getInfoTaskDay } = useMonthData();
  const { user } = useUser();

  useEffect(() => {
    getCalendar();
    getInfoTaskDay(id2, id1);
  }, [user, id1]);

  const getCalendar = async () => {
    const calendarInfo = await getInfoCalendar(id1, id2);
    setinfoCalendar(calendarInfo);
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
            {infoCalendar?.map(({ dayNumber, dayOfWeek, type }, index) => (
              <DayContainer
                key={index}
                dayNumber={dayNumber}
                month={id1}
                type={type}
                year={id2}
                dayOfWeek={dayOfWeek}
              />
            ))}
          </div>
        </>
      ) : (
        <Loading />
      )}
    </div>
  );
};

export default Month;
