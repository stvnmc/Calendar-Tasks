import { useNavigate } from "react-router-dom";
import { useUser } from "../context/userContext";
import { useEffect } from "react";
import Grid from "../components/styleOfPage/Grid";
import Table from "../components/styleOfPage/Table";

import { FaGithub, FaInstagram } from "react-icons/fa";
import NavigationBar from "../components/NavigationBar";

const Home = () => {
  const month = new Date().getMonth();
  const year = new Date().getFullYear();
  const navigate = useNavigate();
  const { isAuthenticated } = useUser();

  useEffect(() => {
    if (!isAuthenticated) navigate("/login");
  });

  return (
    <>
      <NavigationBar />
      <div className="home">
        <div className="first">
          <Grid />
          <div className="first-texto">
            <h1>Ordena tu vida y tu rutina con CalendarRoutine.</h1>

            <button onClick={() => navigate(`/month/${month + 1}/${year}`)}>
              Comenzar
            </button>
          </div>
        </div>
        <div className="second">
          <Table />
        </div>
        <div className="third">
          <div className="cont-text">
            <p>
              Bievenido a CalendarRoutine, la herramienta ideal para organizar
              tu vida diaria. Puedes añadir eventos fácilmente y establecer
              rutinas para cada día.
            </p>
          </div>
        </div>
        <footer>
          <div className="contact">
            <h4>Contacto</h4>
            <div>
              <h2>Nombre:</h2>
              <h2>Steven Marchena Caballero</h2>
            </div>
            <div>
              <h2>Correo electrónico:</h2>
              <h2>stvnmc123@gmail.com</h2>
            </div>
          </div>
          <div className="footer-rigth">
            <div className="cont-links">
              <FaGithub />
              <FaInstagram />
            </div>
            <p>&copy; 2024</p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Home;
