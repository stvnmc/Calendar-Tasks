import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SlArrowUp, SlArrowDown } from "react-icons/sl";

const Day = () => {
  const { id1, id2, id3 } = useParams();
  const navigate = useNavigate();

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
  };

  return (
    <div>
      <div>
        <a onClick={() => chanceDay(-1)}>
          <SlArrowUp />
        </a>
        <a onClick={() => chanceDay(1)}>
          <SlArrowDown />
        </a>
      </div>
      <div>
        <h1>
          {id1},{id2},{id3}
        </h1>
      </div>
    </div>
  );
};

export default Day;
