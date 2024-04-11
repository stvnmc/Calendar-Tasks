import { useNavigate } from "react-router-dom";
import { useUser } from "../context/userContext";
import { useEffect } from "react";
import Grid from "../components/styleOfPage/Grid";

const Home = () => {
  const month = new Date().getMonth();
  const year = new Date().getFullYear();
  const navigate = useNavigate();
  const { isAuthenticated } = useUser();

  useEffect(() => {
    if (!isAuthenticated) navigate("/login");
  });

  return (
    <div className="home">
      <div className="first">
        <Grid />
        <div className="first-texto">
          <h1>ordena tu vida y tu rutina con calendarRoutine </h1>
          <p>
            Bievenido a CalendarRoutine, la herramienta ideal para organizar tu
            vida diaria. Puedes añadir eventos fácilmente y establecer rutinas
            para cada día.
          </p>
          {/* <button onClick={() => navigate(`/month/${month + 1}/${year}`)}>
            <h1>Calendar</h1>
          </button> */}
        </div>
      </div>
      <div className="second">
        <button>Routine</button>

        <button>Calendar</button>
      </div>
    </div>
  );
};

export default Home;
