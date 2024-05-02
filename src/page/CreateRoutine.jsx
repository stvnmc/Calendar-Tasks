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
      navigate(`/Calendar-Tasks`);
    }

    setRoutineWorkday(Hours());
    setRoutineWeekend(Hours());
  }, []);

  const navigate = useNavigate();

  const isDaySelected = (index) => {
    return weekend.includes(index);
  };

  const retroceder = () => {
    window.history.back();
  };

  const nextStage = () => {
    if (stages === "weekend") {
      const res = addRoutine();

      if (res) {
        const nuevaFecha = `/Calendar-Tasks/m/${currentDay.id1}/d/${currentDay.id2}/y/${currentDay.id3}`;
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
        <div className="steps-info">
          {openSFD ? (
            stages === "weekend" ? (
              <>
                <div>
                  <img
                    src={
                      "https://assets-global.website-files.com/64c73d04a946980a4476537e/64d9c64fb20aa28a2850f036_chaotic-good.png"
                    }
                  />
                </div>
                <h1>Rest days are very important</h1>
              </>
            ) : (
              <>
                <div>
                  <img
                    src={
                      "https://assets-global.website-files.com/64c73d04a946980a4476537e/64cd4b0849333dd65b9525a6_coffee.png"
                    }
                  />
                </div>
                <h1>The most productive days of the week</h1>
              </>
            )
          ) : (
            <>
              <div>
                <img
                  src={
                    "https://assets-global.website-files.com/64c73d04a946980a4476537e/64cd4b9bf0da0e3228caa6d0_growth.png"
                  }
                />
              </div>
              <h1>Having an established routine is important</h1>
            </>
          )}
        </div>

        <div className="steps">
          <TbPointFilled className={openSFD ? "" : "here"} />
          <TbPointFilled
            className={openSFD ? (stages === "weekend" ? "" : "here") : ""}
          />
          <TbPointFilled
            className={openSFD ? (stages === "weekend" ? "here" : "") : ""}
          />
        </div>
      </div>
      {openSFD ? (
        <div className="add-info-routine">
          <h1>Add information about your {stages} routine :</h1>
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
          <div className="next-previous">
            <button onClick={retroceder}>Back</button>
            <button className="next" onClick={createRoutine}>
              next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateRoutine;
