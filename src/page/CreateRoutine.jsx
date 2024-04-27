import React, { useEffect } from "react";
import { useRoutine } from "../context/RoutineContext";

// import

import { dayHours, dayNames, Hours } from "../components/infor/MonthsDays";
import InputTextCR from "../components/InputTextCR";
import { useNavigate } from "react-router-dom";

import { TbPointFilled } from "react-icons/tb";

const CreateRoutine = () => {
  //   context
  const {
    createRoutine,
    setWeekend,
    weekend,
    openSFD,
    setOpenSFD,
    RoutineWorkday,
    RoutineWeekend,
    setRoutineWorkday,
    setRoutineWeekend,
    addInfoRoutine,
    currentValueInputText,
    setCurrentValueInputText,
    setStages,
    stages,
    addRoutine,
    currentDay,
  } = useRoutine();

  useEffect(() => {
    if (!currentDay.id1) {
      navigate(`/`);
    }

    setRoutineWorkday(Hours());
    setRoutineWeekend(Hours());
  }, []);

  const navigate = useNavigate();

  const isDaySelected = (index) => {
    return weekend.includes(index);
  };

  const nextStage = () => {
    if (stages === "weekend") {
      const res = addRoutine();

      if (res) {
        const nuevaFecha = `/m/${currentDay.id1}/d/${currentDay.id2}/y/${currentDay.id3}`;
        navigate(nuevaFecha);
      }
    } else {
      setStages("weekend");
      setCurrentValueInputText("");
    }
  };

  const previousStage = () => {
    if (stages === "workday") {
      setOpenSFD(false);
    }
    if (stages === "weekend") {
      setStages("workday");
      setCurrentValueInputText("");
    }
  };

  const addWeekedDay = (i) => {
    if (!weekend.includes(i)) {
      setWeekend((prevFreeDays) => [...prevFreeDays, i]);
    } else {
      setWeekend((prevFreeDays) => prevFreeDays.filter((day) => day !== i));
    }
  };

  return (
    <div className="cont-create">
      <div className="steps-to-follow">
        <h1>pasos a seguir</h1>
        <TbPointFilled />
        <TbPointFilled />
        <TbPointFilled />
      </div>
      {openSFD ? (
        <div className="add-info-routine">
          <h1>agrega la información de tu rutina de los {stages}</h1>
          <div className="hours">
            {dayHours().map((hourObj, index, completed) => (
              <InputTextCR
                hourObj={hourObj}
                key={index}
                addInfoRoutine={addInfoRoutine}
                setCurrentValueInputText={setCurrentValueInputText}
                currentValueInputText={currentValueInputText}
                RoutineWorkday={RoutineWorkday}
                RoutineWeekend={RoutineWeekend}
                stages={stages}
                completed={completed}
              />
            ))}
          </div>
          <div className="next-previous">
            <button onClick={previousStage}>previous</button>
            <button onClick={nextStage}>next</button>
          </div>
        </div>
      ) : (
        <div className="select-routine">
          <h1>Select rest days:</h1>
          <div className="days-off">
            {dayNames.map((dayName, index) => (
              <div
                key={index}
                className={
                  isDaySelected(index) ? "days-create selected" : "days-create"
                }
                onClick={() => addWeekedDay(index)}
              >
                <h1>{dayName}</h1>
                <ul className="lines">
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                </ul>
              </div>
            ))}
          </div>
          <button className="next" onClick={createRoutine}>
            next
          </button>
        </div>
      )}
    </div>
  );
};

export default CreateRoutine;
