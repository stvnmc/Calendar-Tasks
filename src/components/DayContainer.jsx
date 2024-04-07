import { useState } from "react";

// icons
import { IoMdAdd } from "react-icons/io";
import { FaCheck } from "react-icons/fa";
import { FaList } from "react-icons/fa6";

import { Loading } from "./Loading";

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
}) => {
  const [createTask, setCreateTask] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const [loading, setLoading] = useState(true);

  const chanceState = async (type, i) => {
    setLoading(false);
    if (type === "add") {
      await addTaskDay(year, month, dayNumber, inputValue);
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
      className={`containers num${dayNumber} ${type}`}
      style={{ gridColumn: `${dayOfWeek + 1}` }}
    >
      <div className="icons">
        <div>{dayNumber}</div>
        {type === "current" && (
          <div>
            <button onClick={() => goToPageDay(dayNumber)}>
              <FaList />
            </button>
            <button onClick={() => setCreateTask(true)}>
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
              onChange={(event) => setInputValue(event.target.value)}
              onKeyPress={handleKeyPress}
              autoFocus
            />

            <button onClick={() => chanceState("add")}>
              <FaCheck />
            </button>
          </div>
        ) : (
          <div>
            {type === "current" ? (
              <div>
                {infoOfMonth?.map((item, i) => (
                  <div key={i}>
                    <h1>{item}</h1>
                    <button onClick={() => chanceState("delet", i)}>
                      delete
                    </button>
                  </div>
                ))}
              </div>
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
