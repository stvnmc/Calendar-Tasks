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

import DayContainer from "../components/DayContainer";

const Day = () => {
  const { id1, id2, id3 } = useParams();
  const navigate = useNavigate();
  const [infoCalendar, setinfoCalendar] = useState([]);
  const [percentag, setPercentag] = useState(0);
  const [dayExists, setDayExists] = useState(true);
  const [dayTask, setDayTask] = useState(null);

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
    getTaskRoutine();
    getInfoTaskDay(id3, id1);
  }, [id1, id2, user]);

  useEffect(() => {
    getTasksDay();
  }, [infoOfMonth]);

  useEffect(() => {
    getPercentageDay();
  }, [routineDay]);

  // navigate

  const goBack = () => {
    setLoading(false);
    const nuevaFecha = `/month/${id1}/${id3}`;
    navigate(nuevaFecha);
  };

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

  const getTaskRoutine = async () => {
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

  // tasks
  const getTasksDay = async () => {
    if (infoOfMonth.length === 0) return;
    if (infoOfMonth[id2]) {
      setDayTask(infoOfMonth[id2]);
    } else {
      setDayTask(null);
    }
  };

  return (
    <>
      {loading ? (
        <>
          <div className="cont-main-day">
            <div className="cont-day-left">
              <div className="cont-day-top-left">
                <div className="title-left">
                  <h1>{id3}</h1>
                  <button onClick={goBack}>
                    <h2>back</h2>
                  </button>
                </div>
                <div className="small-calendar">
                  <div className="cont-days-mini">
                    <div className="days-of-week-mini">
                      {dayNames.map((dayName, index) => (
                        <h1 key={index}>{dayName.substring(0, 1)}</h1>
                      ))}
                    </div>
                    <div className="days-mini">
                      {infoCalendar.map((day, index) => {
                        return (
                          <button
                            className={
                              day.type === "current" &&
                              day.dayNumber === parseInt(id2)
                                ? "day-mini-calendar today "
                                : "day-mini-calendar"
                            }
                          >
                            <h2 key={index}>{day.dayNumber}</h2>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div className="top-day-icons">
                    <button onClick={() => chanceDay(-1)}>
                      <SlArrowUp />
                    </button>
                    <button onClick={() => chanceDay(1)}>
                      <SlArrowDown />
                    </button>
                  </div>
                </div>
              </div>

              <div className="task-day">
                <h1>Day Task</h1>
                <div className="content-task">
                  <DayContainer
                    dayNumber={id2}
                    month={id1}
                    year={id3}
                    type={"current"}
                    dayOfWeek={null}
                    infoOfMonth={dayTask}
                    addTaskDay={addTaskDay}
                    deleteTaskDay={deleteTaskDay}
                  />
                  {/* goToPageDay={goToPageDay} */}
                </div>
              </div>
            </div>
            <div className="content-routine">
              <div className="title-routine">
                <div>
                  <button onClick={openCreateRutine}>
                    <h2>createRoutine new</h2>
                  </button>
                  {dayExists && (
                    <button onClick={finallyDay}>
                      <h2>finallyDay</h2>
                    </button>
                  )}
                </div>
                <div className="title-top">
                  <h1>{percentag}%</h1>
                  <h1>{stages}</h1>
                </div>
              </div>
              <div className="hours">
                {dayHours().map((hourObj, index) => (
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
                    setNewRoutineDay={setNewRoutineDay}
                    dayExists={dayExists}
                  />
                ))}
              </div>
            </div>
          </div>
        </>
      ) : (
        <Loading />
      )}
    </>
  );
};

export default Day;
