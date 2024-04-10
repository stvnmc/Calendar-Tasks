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
      {/* <button onClick={() => navigate(`/month/${month + 1}/${year}`)}>
        Calendar  
      </button> */}
      <div className="first">
        <Grid />
        <div className="first-texto">
          <h1>ordena tu vida y tu rutina </h1>
          <p>
            Dsadasdasdjasdahsodihaosdhiaodhoaishdoiahoidshdasdasdasdasdasdadada
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
