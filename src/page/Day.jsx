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
  const [routineTaskCompleted, setRoutineTaskCompleted] = useState([]);
  const [routineTaskIncomplete, setRoutineTaskIncomplete] = useState([]);

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
    rutine();
    getTask();
  }, [id1, id2, user]);

  useEffect(() => {
    addTaskIncomplete();
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

    setRoutineTaskCompleted([]);
    setRoutineTaskIncomplete([]);
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
    addRoutineDayTasks(
      id1,
      id2,
      id3,
      porcentaje,
      routineTaskCompleted,
      routineTaskIncomplete,
      stages
    );

    setRoutineTaskCompleted([]);
    setRoutineTaskIncomplete([]);
  };

  // Routine

  const getTask = async () => {
    console.log("routineData");
    setLoading(false);

    try {
      const routineDayTasks = await getRoutineDayTasks(id1, id2, id3);
      console.log(routineDayTasks);
      if (routineDayTasks) {
        setRoutineTaskCompleted(routineDayTasks?.TaskCompleted);
        setRoutineTaskIncomplete(routineDayTasks?.TaskIncomplete);
        console.log(routineDayTasks.TaskIncomplete);
      } else {
        await getRoutine(id1, id2, id3);
      }
    } catch (error) {
      console.error("Error al obtener las tareas de rutina del día:", error);
    } finally {
      setLoading(true);
    }
  };

  const addTaskCompleted = (hour) => {
    let updatedRoutineDay = { ...routineDay };

    // Verificamos si la hora que queremos actualizar existe en el estado
    if (updatedRoutineDay.hasOwnProperty(hour)) {
      // Actualizamos la propiedad 'completed' del objeto de esa hora
      updatedRoutineDay[hour] = {
        ...updatedRoutineDay[hour],
        completed: true,
      };

      setRoutineDay(updatedRoutineDay);
    }
  };

  const deleteTaskCompleted = (hour) => {
    let updatedRoutineDay = { ...routineDay };

    // Verificamos si la hora que queremos actualizar existe en el estado
    if (updatedRoutineDay.hasOwnProperty(hour)) {
      // Actualizamos la propiedad 'completed' del objeto de esa hora
      updatedRoutineDay[hour] = {
        ...updatedRoutineDay[hour],
        completed: false,
      };

      setRoutineDay(updatedRoutineDay);
    }
  };

  const addTaskIncomplete = () => {
    if (!routineDay || typeof routineDay !== "object") return;

    for (const item of Object.values(routineDay)) {
      if (item.task) {
        setRoutineTaskIncomplete((prev) => [
          ...prev,
          { hour: item.hour, task: item.task },
        ]);
      }
    }
  };

  const getPercentageDay = () => {
    let count = 0;

    for (const hour in routineDay) {
      if (routineDay[hour].task) {
        count++;
      }
    }

    if (count !== 0) {
      const porcentaje = Math.round(
        (routineTaskCompleted.length / count) * 100
      );

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
              {routineDay &&
                dayHours().map((hourObj, index) => (
                  <Routine
                    key={index}
                    hour={hourObj.hour}
                    period={hourObj.period}
                    style={hourObj.style}
                    routine={
                      routineDay === 0
                        ? routineDay[24]
                        : routineDay[hourObj.hour]
                    }
                    addTask={addTaskCompleted}
                    deleteTask={deleteTaskCompleted}
                    routineTaskCompleted={routineTaskCompleted}
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
