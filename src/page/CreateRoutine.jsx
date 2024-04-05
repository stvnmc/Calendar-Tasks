import React, { useEffect } from "react";
import { useRoutine } from "../context/RoutineContext";

// import

import { dayHours, dayNames, Hours } from "../components/infor/MonthsDays";
import InputTextCR from "../components/InputTextCR";
import { useNavigate } from "react-router-dom";

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
    setOpenCreateRutine,
    setStages,
    stages,
    addRoutine,
    currentDay,
  } = useRoutine();

  useEffect(() => {
    if (!currentDay.id1) {
      navigate(`/`);
    }
  }, []);

  const navigate = useNavigate();

  const isDaySelected = (index) => {
    return weekend.includes(index);
  };

  const nextStage = () => {
    if (stages === "weekend") {
      setOpenCreateRutine(true);

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
    if (stages === "weekend") {
      setOpenSFD(false);
    } else {
      setStages("workday");
      setCurrentValueInputText("");
    }
  };

  const addWeekedDay = (i) => {
    console.log(RoutineWeekend);
    console.log(RoutineWorkday);
    setRoutineWorkday(Hours());
    setRoutineWeekend(Hours());
    if (!weekend.includes(i)) {
      setWeekend((prevFreeDays) => [...prevFreeDays, i]);
    } else {
      setWeekend((prevFreeDays) => prevFreeDays.filter((day) => day !== i));
    }
  };

  return (
    <>
      {openSFD ? (
        <div>
          <h2>agrega la información de tu rutina de los {stages}</h2>
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
          <button onClick={previousStage}>previous</button>
          <button onClick={nextStage}>next</button>
        </div>
      ) : (
        <div>
          <h2>Días de descanso:</h2>
          {dayNames.map((dayName, index) => (
            <div key={index}>
              <button
                className={isDaySelected(index) ? "selected" : ""}
                onClick={() => addWeekedDay(index)}
              >
                {dayName}
              </button>
            </div>
          ))}
          <button onClick={createRoutine}>next</button>
        </div>
      )}
    </>
  );
};

export default CreateRoutine;
