import React, { useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { FaCheck, FaTasks } from "react-icons/fa";
import { MdBookmarkRemove } from "react-icons/md";
import { Loading } from "./Loading/Loading";
import LoadingDays from "./Loading/LoadingDays";
import { useEffect } from "react";

const DayContainer = ({
  dayNumber,
  dayOfWeek,
  month,
  type,
  year,
  infoOfMonth,
  addTaskDay,
  goToPageDay,
  deleteTaskDay,
  handleMonthChange,
  loadingMonth,
}) => {
  const [createTask, setCreateTask] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(true);

  const chanceCreateTask = () => {
    setCreateTask(!createTask);
  };

  const chanceState = async (type, i) => {
    setLoading(false);
    if (typeof type !== "undefined" && type === "add") {
      if (inputValue) {
        await addTaskDay(year, month, dayNumber, inputValue);
      }
      setInputValue("");
      setCreateTask(false);
    } else {
      await deleteTaskDay(year, month, dayNumber, i);
    }

    setLoading(true);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      chanceState("add");
    }
  };

  return (
    <div
      id={dayNumber}
      className={`containers num${dayNumber} ${type} ${
        loadingMonth ? "" : "loading"
      } ${dayOfWeek === null ? "day-task-rotuine" : ""}`}
      style={{ gridColumn: `${dayOfWeek ? dayOfWeek + 1 : 1}` }}
      onClick={() => {
        if (type === "former") {
          handleMonthChange(-1);
        } else if (type === "next") {
          handleMonthChange(1);
        }
      }}
    >
      {loadingMonth ? (
        <>
          <div className="icons">
            <div className="title-task">
              {dayOfWeek === null ? <h1>Day Task</h1> : <h1>{dayNumber}</h1>}
            </div>
            {type === "current" && (
              <div className="icons-add-rutine">
                {dayOfWeek === null ? null : (
                  <button onClick={() => goToPageDay(dayNumber)}>
                    <FaTasks />
                  </button>
                )}
                <button
                  className={createTask ? "hover" : "none"}
                  onClick={() => chanceCreateTask()}
                >
                  <IoMdAdd />
                </button>
              </div>
            )}
          </div>
          {loading ? (
            createTask ? (
              <div className="create-task">
                <input
                  type="text"
                  value={inputValue}
                  placeholder="Task"
                  onChange={(event) => setInputValue(event.target.value)}
                  onKeyPress={handleKeyPress}
                  autoFocus
                />
                <button className="add" onClick={() => chanceState("add")}>
                  <FaCheck />
                </button>
              </div>
            ) : (
              <div className="tasks">
                {type === "current" ? (
                  <>
                    {infoOfMonth?.map((item, i) => (
                      <div key={i} className="cont-tasks">
                        <h2>{item}</h2>
                        <button
                          className="delete"
                          onClick={() => chanceState("delete", i)}
                        >
                          <MdBookmarkRemove />
                        </button>
                      </div>
                    ))}
                  </>
                ) : (
                  <div></div>
                )}
              </div>
            )
          ) : (
            <Loading />
          )}
        </>
      ) : (
        <div className="cont-loading"></div>
      )}
    </div>
  );
};

export default DayContainer;
