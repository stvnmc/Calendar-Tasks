import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getInfoCalendar } from "../components/FunctionGetCalendar";
import { dayHours, dayNames } from "../components/infor/MonthsDays";

import { useRoutine } from "../context/RoutineContext";
import { useUser } from "../context/userContext";
import { Loading } from "../components/Loading/Loading";
import Routine from "../components/Routine";

// icons
import { SlArrowUp, SlArrowDown } from "react-icons/sl";
import { useMonthData } from "../context/MonthDataContext";
import { ImTab } from "react-icons/im";

const Day = () => {
  const { id1, id2, id3 } = useParams();
  const navigate = useNavigate();
  const [infoCalendar, setinfoCalendar] = useState([]);
  const [percentag, setPercentag] = useState(0);
  const [dayExists, setDayExists] = useState(true);

  // context
  const {
    loading,
    setLoading,
    rutine,
    setRoutineDay,
    getRoutine,
    setStages,
    setOpenSFD,
    stages,
    routineDay,
    addRoutineDayTasks,
    getRoutineDayTasks,
    setCurrentDay,
  } = useRoutine();
  const { user } = useUser();

  const { infoOfMonth, getInfoTaskDay, addTaskDay, deleteTaskDay } =
    useMonthData();

  useEffect(() => {
    getCalendar();
    getTask();
    getInfoTaskDay(id3, id1);
  }, [id1, id2, user]);

  useEffect(() => {
    console.log(infoOfMonth);
  }, [infoOfMonth]);

  useEffect(() => {
    getPercentageDay();
  }, [routineDay]);

  const getCalendar = async () => {
    const calendarInfo = await getInfoCalendar(id1, id3);
    setinfoCalendar(calendarInfo);
  };

  const chanceDay = (e) => {
    setLoading(false);
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

  const openCreateRutine = () => {
    setStages("workday");
    setOpenSFD(false);
    setCurrentDay({ id1, id2, id3 });
    const nuevaFecha = `/create-routine`;
    navigate(nuevaFecha);
  };

  const finallyDay = async () => {
    chanceDay(1);
    addRoutineDayTasks(id1, id2, id3, percentag);
  };

  // Routine

  const getTask = async () => {
    if (!user || typeof user !== "string") {
      return;
    }
    try {
      setLoading(false);

      //  si no existe rutine crea una para el cliente
      const res = await rutine();

      if (!res) {
        setCurrentDay({ id1, id2, id3 });
        const nuevaFecha = `/create-routine`;
        navigate(nuevaFecha);
        return;
      }

      //  verifica si el dia esta registrado
      const routineDayTasks = await getRoutineDayTasks(id1, id2, id3);

      if (routineDayTasks) {
        setDayExists(false);
        return;
      }

      //  agrega la rutina guardada
      const resTask = await getRoutine(id1, id2, id3);
      setRoutineDay(resTask);
      setDayExists(true);
    } catch (error) {
      console.error("Error al obtener las tareas de rutina del día:", error);
    } finally {
      setLoading(true);
    }
  };

  const setNewRoutineDay = (hour, completed) => {
    let updatedRoutineDay = { ...routineDay };
    updatedRoutineDay[hour] = {
      ...updatedRoutineDay[hour],
      completed: completed,
    };
    setRoutineDay(updatedRoutineDay);
  };

  const getPercentageDay = () => {
    let countTask = 0;
    let countTaskComplet = 0;

    for (const hour in routineDay) {
      if (routineDay[hour].task !== "") {
        countTask++;
        if (routineDay[hour].completed === true) {
          countTaskComplet++;
        }
      }
    }

    if (countTask !== 0) {
      const porcentaje = Math.round((countTaskComplet / countTask) * 100);

      setPercentag(porcentaje);
    } else {
      setPercentag(0);
    }
  };

  return (
    <div className="day-routine">
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
          <div className="days-of-week-mini">
            {dayNames.map((dayName, index) => (
              <div key={index}>{dayName.substring(0, 1)}</div>
            ))}
          </div>
          <div className="days-mini">
            {infoCalendar.map((day, index) => {
              return (
                <div
                  key={index}
                  className={
                    day.type === "current" && day.dayNumber === parseInt(id2)
                      ? "today"
                      : ""
                  }
                >
                  {day.dayNumber}
                </div>
              );
            })}
          </div>
          <div>
            <h1>task</h1>
            {infoCalendar}
          </div>
        </div>

        {loading ? (
          <div>
            <button onClick={openCreateRutine}>createRoutine new</button>
            {dayExists && <button onClick={finallyDay}>finallyDay</button>}
            <h1>{percentag}%</h1>
            <h1>{stages}</h1>
            <div className="hours">
              {dayHours().map((hourObj, index) => (
                <Routine
                  key={index}
                  hour={hourObj.hour}
                  period={hourObj.period}
                  style={hourObj.style}
                  routine={
                    routineDay === 0 ? routineDay[24] : routineDay[hourObj.hour]
                  }
                  setNewRoutineDay={setNewRoutineDay}
                  dayExists={dayExists}
                />
              ))}
            </div>
          </div>
        ) : (
          <Loading />
        )}
      </div>
    </div>
  );
};

export default Day;
