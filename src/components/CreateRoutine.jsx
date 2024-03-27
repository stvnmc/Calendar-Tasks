import React from "react";
import { useRoutine } from "../context/RoutineContext";

// import
import Routine from "./Routine";
import { dayHours, dayNames } from "./infor/MonthsDays";
import InputTextCR from "./InputTextCR";
import { Loading } from "./Loading";

const CreateRoutine = () => {
  //   context
  const {
    loading,
    routineDay,
    createRoutine,
    setWeekend,
    weekend,
    openSFD,
    setOpenSFD,
    RoutineWorkday,
    RoutineWeekend,
    addInfoRoutine,
    currentValueInputText,
    setCurrentValueInputText,
    OpenCreateRutine,
    setOpenCreateRutine,
    setStages,
    stages,
    addRoutine,
  } = useRoutine();

  const getInfoRoutine = () => {
    console.log();
  };

  const isDaySelected = (index) => {
    return weekend.includes(index);
  };

  const openCreateRutine = () => {
    setStages("Workday");
    setOpenCreateRutine(false);
    setOpenSFD(false);
  };

  const nextStage = () => {
    if (stages === "Weekend") {
      setOpenCreateRutine(true);
      addRoutine();
    } else {
      setStages("Weekend");
      setCurrentValueInputText("");
    }
  };

  const previousStage = () => {
    if (stages === "Workday") {
      setOpenSFD(false);
    } else {
      setStages("Workday");
      setCurrentValueInputText("");
    }
  };

  return (
    <>
      {loading ? (
        OpenCreateRutine ? (
          <div>
            <button onClick={openCreateRutine}>createRoutine new</button>
            <div className="hours">
              {dayHours().map((hourObj, index) => (
                <Routine
                  key={index}
                  hour={hourObj.hour}
                  period={hourObj.period}
                  style={hourObj.style}
                  routine={routineDay[index]}
                />
              ))}
            </div>
          </div>
        ) : (
          <>
            {openSFD ? (
              <div>
                <h2>agrega la información de tu rutina de los {stages}</h2>
                <div className="hours">
                  {dayHours().map((hourObj, index) => (
                    <InputTextCR
                      hourObj={hourObj}
                      key={index}
                      addInfoRoutine={addInfoRoutine}
                      setCurrentValueInputText={setCurrentValueInputText}
                      currentValueInputText={currentValueInputText}
                      RoutineWorkday={RoutineWorkday}
                      RoutineWeekend={RoutineWeekend}
                      stages={stages}
                    />
                  ))}
                </div>
                <button onClick={previousStage}>previous</button>
                <button onClick={nextStage}>next</button>
              </div>
            ) : (
              <div>
                <h2>Días de descanso:</h2>
                {dayNames.map((item, i) => (
                  <div key={i}>
                    <button
                      className={isDaySelected(i) ? "selected" : ""}
                      onClick={() => {
                        if (!weekend.includes(i)) {
                          setWeekend((prevFreeDays) => [...prevFreeDays, i]);
                        }
                      }}
                    >
                      {item}
                    </button>
                  </div>
                ))}
                <button onClick={createRoutine}>next</button>
              </div>
            )}
          </>
        )
      ) : (
        <Loading />
      )}
    </>
  );
};

export default CreateRoutine;
