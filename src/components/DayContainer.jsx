import { useNavigate } from "react-router-dom";

const DayContainer = ({ dayNumber, dayOfWeek, month, type, year }) => {
  const navigate = useNavigate();
  const goToPageDay = () => {
    const nuevaFecha = `/m/${month}/d/${dayNumber}/y/${year}`;
    navigate(nuevaFecha);
  };

  return (
    <div
      onClick={goToPageDay}
      id={dayNumber}
      className={`containers num${dayNumber} ${type}`}
      style={{ gridColumn: `${dayOfWeek + 1}` }}
    >
      {dayNumber}
      <div></div>
    </div>
  );
};

export default DayContainer;
