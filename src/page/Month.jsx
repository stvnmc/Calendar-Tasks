import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { SlArrowUp, SlArrowDown } from "react-icons/sl";
import { IoReturnUpBack } from "react-icons/io5";
import { dayNames, monthsNames } from "../components/infor/MonthsDays";

import DayContainer from "../components/DayContainer";

import { useMonthData } from "../context/MonthDataContext";
import { Loading } from "../components/Loading";
import { useUser } from "../context/userContext";
import { getInfoCalendar } from "../components/FunctionGetCalendar";
import DigitalClock from "../components/DigitalClock";

const Month = () => {
  const { id1, id2 } = useParams();

  const navigate = useNavigate();
  const [infoCalendar, setinfoCalendar] = useState([]);

  const {
    loading,
    setLoading,
    infoOfMonth,
    getInfoTaskDay,
    addTaskDay,
    deleteTaskDay,
  } = useMonthData();

  const { user, logout } = useUser();

  useEffect(() => {
    getCalendar();
    getInfoTasksClandarar();
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

  const goToPageDay = (day) => {
    const nuevaFecha = `/m/${id1}/d/${day}/y/${id2}`;
    navigate(nuevaFecha);
  };
  const goPageGome = () => {
    const nuevaFecha = `/`;
    navigate(nuevaFecha);
  };

  const getInfoTasksClandarar = async () => {
    setLoading(false);
    await getInfoTaskDay(id2, id1);
    setLoading(true);
  };

  return (
    <div className="container">
      {loading ? (
        <>
          <div>
            <div className="top-bar-calendario">
              <h2>
                {dayNames[new Date().getDay()]}, {new Date().getDate()}{" "}
                {monthsNames[new Date().getMonth()]} {new Date().getFullYear()}
              </h2>
              <DigitalClock />
              <div className="user-control">
                <h2>{user}</h2>
                <button onClick={logout}>Logout</button>
              </div>
            </div>
            <div className="month-chanceMonth">
              <div className="date">
                <h2>
                  {monthsNames[id1 - 1]} {id2}
                </h2>
                <div className="icons-calendar">
                  <button>
                    <SlArrowDown onClick={() => handleMonthChange(1)} />
                  </button>
                  <button>
                    <SlArrowUp onClick={() => handleMonthChange(-1)} />
                  </button>
                </div>
              </div>
              <button className="IoReturnUpBack" onClick={goPageGome}>
                <IoReturnUpBack />
              </button>
            </div>
          </div>
          <div className="calendar">
            <div className="days-of-week">
              {dayNames.map((dayName, index) => (
                <h2 key={index}>{dayName}</h2>
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
                  infoOfMonth={infoOfMonth[dayNumber]}
                  addTaskDay={addTaskDay}
                  deleteTaskDay={deleteTaskDay}
                  goToPageDay={goToPageDay}
                />
              ))}
            </div>
          </div>
        </>
      ) : (
        <Loading />
      )}
    </div>
  );
};

export default Month;
