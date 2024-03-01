import { useNavigate } from "react-router-dom";
import { IoMdAdd } from "react-icons/io";
import { FaCheck } from "react-icons/fa";
import { useState } from "react";

const DayContainer = ({ dayNumber, dayOfWeek, month, type, year }) => {
  const [createTask, setCreateTask] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [infoTask, setInfoTask] = useState([]);

  const navigate = useNavigate();

  const goToPageDay = () => {
    const nuevaFecha = `/m/${month}/d/${dayNumber}/y/${year}`;
    navigate(nuevaFecha);
  };

  const addTask = () => {
    setCreateTask(true);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      console.log("Se presionó Enter");
      console.log(inputValue);
      setInfoTask((prev) => [...prev, inputValue]);
      setInputValue("");
      setCreateTask(false);
    }
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  return (
    <div
      // onClick={goToPageDay}
      id={dayNumber}
      className={`containers num${dayNumber} ${type}`}
      style={{ gridColumn: `${dayOfWeek + 1}` }}
    >
      <div className="icons">
        <div>{dayNumber}</div>
        <button onClick={addTask}>
          <IoMdAdd />
        </button>
      </div>
      {createTask ? (
        <div className="create-task">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            autoFocus
          />
          <button onClick={handleKeyPress}>
            <FaCheck />
          </button>
        </div>
      ) : (
        <div>
          <div>
            {infoTask.map((item, index) => (
              <h1 key={index}>{item}</h1>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DayContainer;
