import { useNavigate } from "react-router-dom";
import { useUser } from "../context/userContext";
import { useEffect, useState } from "react";
import Grid from "../components/styleOfPage/Grid";
import Table from "../components/styleOfPage/Table";

import { FaGithub, FaInstagram } from "react-icons/fa";
import DigitalClock from "../components/DigitalClock";

const Home = () => {
  const month = new Date().getMonth();
  const year = new Date().getFullYear();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useUser();

  useEffect(() => {
    if (!isAuthenticated) navigate("/login");
  });

  const [style, setStyle] = useState(0);

  useEffect(() => {
    const timeout1 = setTimeout(() => {
      if (style === 0) {
        setStyle(32);
      } else if (style === 32) {
        setStyle(66);
      } else {
        setStyle(0);
      }
    }, 6000);

    return () => {
      clearTimeout(timeout1);
    };
  }, [style]);

  return (
    <>
      <div className="home">
        <div className="page-top">
          <div className="logo">
            <h1>CalenRoutine</h1>
          </div>
          <DigitalClock />
          <div className="logout">
            <h2>{user}</h2>
            <button>Contact</button>
          </div>
        </div>
        <div className="first">
          <Grid />
          <div className="first-texto">
            <h1>Organize your life and your routine with CalenRoutine</h1>

            <button onClick={() => navigate(`/month/${month + 1}/${year}`)}>
              Begin
            </button>

            <div className="cont-img">
              <img
                src={
                  "https://assets-global.website-files.com/64c73d04a946980a4476537e/64cd4c2274b417b090395329_plants.png"
                }
              />
            </div>
          </div>
        </div>
        <div className="second">
          <Table />
        </div>
        <div className="third">
          <div>
            <img
              src={
                "https://assets-global.website-files.com/64c73d04a946980a4476537e/64d190c182efd7fa3c5ac033_pondering.png"
              }
            />
          </div>
          <div className="cont-text">
            <div style={{ transform: `translate(-${style}%)` }}>
              <p>
                Welcome to Calendar Routine, the ideal tool to organize your
                daily life. You can easily add events and set routines for each
                day.
              </p>
              <p>
                Organize your time efficiently with Calendar Routine. Record
                your daily activities and establish routines to optimize your
                day.
              </p>
              <p>
                Welcome to CalendarRoutine! The perfect tool for plan your daily
                activities.
              </p>
            </div>
          </div>
        </div>
        <footer>
          <div className="cont-img">
            <img
              src={
                "https://assets-global.website-files.com/64c73d04a946980a4476537e/64d18f22bd4dfae30b7ea399_astro.png"
              }
            />
          </div>
          <div className="content">
            <div className="contact">
              <h4>Contact</h4>
              <div>
                <h2>Name:</h2>
                <h2>Steven Marchena Caballero</h2>
              </div>
              <div>
                <h2>Email:</h2>
                <h2>stvnmc123@gmail.com</h2>
              </div>
            </div>
            <div className="inspired">
              <h1>
                Images:
                <a href={"https://www.transhumans.xyz/images/plants"}>
                  transhumans.com
                </a>
              </h1>
            </div>
            <div className="footer-rigth">
              <div className="cont-links">
                <a href="https://www.instagram.com/cuatrommc/?hl=es">
                  <FaGithub />
                </a>
                <a href="https://github.com/stvnmc">
                  <FaInstagram />
                </a>
              </div>
              <p>&copy; 2024</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Home;
