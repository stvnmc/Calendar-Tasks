import React from "react";
import { dayHours, dayNames } from "./infor/MonthsDays";
import { useRoutine } from "../context/RoutineContext";
import Routine from "./Routine";

const CreateRoutine = () => {
  //   context
  const { createRoutine, setFreeDays, freeDays, openSFD } = useRoutine();

  const isDaySelected = (index) => {
    return freeDays.includes(index);
  };

  {
    /* <Routine
    key={index}
    hour={hourObj.hour}
    period={hourObj.period}
    style={hourObj.style}
  /> */
  }
  return (
    <>
      {openSFD ? (
        <div className="hours">
          {dayHours().map((hourObj, index) => {
            return (
              <div
                key={index}
                className={`hour ${hourObj.period}`}
                style={hourObj.style}
              >
                {hourObj.hour}
                <input />
              </div>
            );
          })}
        </div>
      ) : (
        <div>
          <h2>Dias de descanso :</h2>
          {dayNames.map((item, i) => {
            return (
              <div key={i}>
                <button
                  className={isDaySelected(i) ? "selected" : ""}
                  onClick={() => {
                    if (!freeDays.includes(i)) {
                      setFreeDays((prevFreeDays) => [...prevFreeDays, i]);
                    }
                  }}
                >
                  {item}
                </button>
              </div>
            );
          })}

          <button onClick={createRoutine}>next</button>
        </div>
      )}
    </>
  );
};

export default CreateRoutine;
