import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SlArrowUp, SlArrowDown } from "react-icons/sl";
import { getInfoCalendar } from "../components/FunctionGetCalendar";
import { dayNames } from "../components/infor/MonthsDays";

import CreateRoutine from "../components/CreateRoutine";
import { useRoutine } from "../context/RoutineContext";
import { useUser } from "../context/userContext";

const Day = () => {
  const { id1, id2, id3 } = useParams();
  const navigate = useNavigate();
  const [infoCalendar, setinfoCalendar] = useState([]);

  // context
  const { rutine, getRoutine } = useRoutine();
  const { user } = useUser();

  useEffect(() => {
    getCalendar();
    rutine();
    getRoutine(id1, id2);
  }, [id1, id2]);

  useEffect(() => {
    rutine();
    getRoutine(id1, id2);
  }, [user]);

  const getCalendar = async () => {
    const calendarInfo = await getInfoCalendar(id1, id3);
    setinfoCalendar(calendarInfo);
  };

  const chanceDay = (e) => {
    let daysInMonth = new Date(id3, parseInt(id1), 0).getDate();

    let newDay = parseInt(e) + parseInt(id2);

    let newMonth = id1;
    let newYear = id3;

    if (newDay < 1) {
      let newDaysInMonth = new Date(id3, parseInt(id1) - 1, 0).getDate();
      newDay = newDaysInMonth;

      newMonth--;
    } else if (newDay > daysInMonth) {
      newDay = 1;
      newMonth++;
    }

    if (newMonth < 1) {
      newMonth = 12;
      newYear--;
    } else if (newMonth > 12) {
      newMonth = 1;
      newYear++;
    }

    const nuevaFecha = `/m/${newMonth}/d/${newDay}/y/${newYear}`;
    navigate(nuevaFecha);
  };

  return (
    <div>
      <div>
        <div>
          <a onClick={() => chanceDay(-1)}>
            <SlArrowUp />
          </a>
          <a onClick={() => chanceDay(1)}>
            <SlArrowDown />
          </a>
        </div>
        <h1>{id3}</h1>
      </div>
      <div className="cont-main-day">
        <div className="small-calendar">
          <div className="days-of-week">
            {dayNames.map((dayName, index) => (
              <div key={index}>{dayName.substring(0, 1)}</div>
            ))}
          </div>
          <div className="days">
            {infoCalendar.map((day, index) => {
              return <div key={index}>{day.dayNumber}</div>;
            })}
          </div>
        </div>
        <CreateRoutine />
      </div>
    </div>
  );
};

export default Day;
