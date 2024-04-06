import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SlArrowUp, SlArrowDown } from "react-icons/sl";
import { getInfoCalendar } from "../components/FunctionGetCalendar";
import { dayHours, dayNames } from "../components/infor/MonthsDays";

import { useRoutine } from "../context/RoutineContext";
import { useUser } from "../context/userContext";
import { Loading } from "../components/Loading";
import Routine from "../components/Routine";

const Day = () => {
  const { id1, id2, id3 } = useParams();
  const navigate = useNavigate();
  const [infoCalendar, setinfoCalendar] = useState([]);

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

  useEffect(() => {
    getCalendar();
    getTask();
  }, [id1, id2, user]);

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
    console.log(id1, id2, id3);
    setCurrentDay({ id1, id2, id3 });
    const nuevaFecha = `/create-routine`;
    navigate(nuevaFecha);
  };

  const finallyDay = async () => {
    chanceDay(1);
    const porcentaje = getPercentageDay();
    addRoutineDayTasks(id1, id2, id3, porcentaje);
  };

  // Routine

  const getTask = async () => {
    if (!user || typeof user !== "string") {
      return;
    }
    try {
      setLoading(false);

      const res = await rutine();

      if (!res) {
        setCurrentDay({ id1, id2, id3 });
        const nuevaFecha = `/create-routine`;
        navigate(nuevaFecha);
        return;
      }

      const routineDayTasks = await getRoutineDayTasks(id1, id2, id3);

      if (routineDayTasks) return;

      const resTask = await getRoutine(id1, id2, id3);
      setRoutineDay(resTask);
    } catch (error) {
      console.error("Error al obtener las tareas de rutina del día:", error);
    } finally {
      setLoading(true);
    }
  };

  const addTaskCompleted = (hour) => {
    // Actualizamos la tarea en la hora correcta
    let updatedRoutineDay = { ...routineDay };

    updatedRoutineDay[hour] = {
      ...updatedRoutineDay[hour],
      completed: true,
    };
    console.log(updatedRoutineDay);
    setRoutineDay(updatedRoutineDay);
  };

  const deleteTaskCompleted = (hour) => {
    //  Eliminarmos el completado en la tarea en la hora correcta
    let updatedRoutineDay = { ...routineDay };

    updatedRoutineDay[hour] = {
      ...updatedRoutineDay[hour],
      completed: false,
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

      return porcentaje;
    } else {
      return 0;
    }
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
        </div>

        {loading ? (
          <div>
            <button onClick={openCreateRutine}>createRoutine new</button>
            <button onClick={finallyDay}>finallyDay</button>
            <h1>{getPercentageDay()}%</h1>
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
                  addTask={addTaskCompleted}
                  deleteTask={deleteTaskCompleted}
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
