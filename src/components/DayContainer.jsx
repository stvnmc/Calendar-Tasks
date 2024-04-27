import { useState } from "react";

// icons
import { IoMdAdd } from "react-icons/io";
import { FaCheck } from "react-icons/fa";

import { FaTasks } from "react-icons/fa";
import { MdBookmarkRemove } from "react-icons/md";
import { Loading } from "./Loading/Loading";

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
        dayOfWeek === null ? "day-task-rotuine" : ""
      }`}
      style={{ gridColumn: `${dayOfWeek ? dayOfWeek + 1 : 1}` }}
      onClick={() => {
        if (type === "former") {
          handleMonthChange(-1);
        } else if (type === "next") {
          handleMonthChange(1);
        }
      }}
    >
      <div className="icons">
        <div className="title-task">
          <h1>{dayNumber}</h1>
          {dayOfWeek === null ? <h1>Day Task</h1> : null}
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
                      onClick={() => chanceState("delet", i)}
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
    </div>
  );
};

export default DayContainer;
