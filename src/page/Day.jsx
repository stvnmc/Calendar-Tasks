import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SlArrowUp, SlArrowDown } from "react-icons/sl";
import { getInfoCalendar } from "../components/FunctionGetCalendar";
import { dayHours, dayNames } from "../components/infor/MonthsDays";

import CreateRoutine from "../components/CreateRoutine";
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
    rutine,
    getRoutine,
    OpenCreateRutine,
    setOpenCreateRutine,
    setStages,
    setOpenSFD,
    stages,
    routineDay,
    addRoutineDayTasks,
    getRoutineDayTasks,
  } = useRoutine();
  const { user } = useUser();

  useEffect(() => {
    getCalendar();
    rutine();
    getRoutine(id1, id2);
    getTask();
  }, [id1, id2]);

  useEffect(() => {
    rutine();
    getRoutine(id1, id2);
    getTask();
  }, [user]);

  useEffect(() => {
    addTaskIncomplete();
  }, [routineDay]);

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

    setRoutineTaskCompleted([]);
    setRoutineTaskIncomplete([]);
  };

  const openCreateRutine = () => {
    setStages("Workday");
    setOpenCreateRutine(false);
    setOpenSFD(false);
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
    const routineDayTasks = await getRoutineDayTasks(id1, id2, id3);

    if (routineDayTasks) {
      setRoutineTaskCompleted(routineDayTasks?.TaskCompleted);
      setRoutineTaskIncomplete(routineDayTasks?.TaskIncomplete);
    }
  };

  const addTaskCompleted = (hour, task) => {
    setRoutineTaskCompleted((prev) => {
      if (prev && !prev.some((item) => item.hour === hour)) {
        return [...prev, { hour, task }];
      } else {
        return prev;
      }
    });

    setRoutineTaskIncomplete((prev) =>
      prev?.filter((item) => item.hour !== hour)
    );
  };

  const deleteTaskCompleted = (hour) => {
    setRoutineTaskCompleted((prev) =>
      prev?.filter((item) => item.hour !== hour)
    );
  };

  const addTaskIncomplete = () => {
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

    if (routineTaskCompleted) {
      const porcentaje = (routineTaskCompleted?.length / count) * 100;
      return porcentaje;
    } else {
      const porcentaje = (0 / count) * 100;
      return porcentaje;
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
              return <div key={index}>{day.dayNumber}</div>;
            })}
          </div>
        </div>

        {loading ? (
          OpenCreateRutine ? (
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
                    routine={routineDay[index]}
                    addTask={addTaskCompleted}
                    deleteTask={deleteTaskCompleted}
                    routineTaskCompleted={routineTaskCompleted}
                  />
                ))}
              </div>
            </div>
          ) : (
            <CreateRoutine chanceDay={chanceDay} />
          )
        ) : (
          <Loading />
        )}
      </div>
    </div>
  );
};

export default Day;
