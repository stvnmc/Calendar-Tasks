import { useNavigate } from "react-router-dom";
import { useUser } from "../context/userContext";
import { useEffect } from "react";

const Home = () => {
  const month = new Date().getMonth();
  const year = new Date().getFullYear();
  const navigate = useNavigate();
  const { isAuthenticated } = useUser();

  useEffect(() => {
    if (!isAuthenticated) navigate("/login");
  });

  return (
    <div>
      <button onClick={() => navigate(`/month/${month + 1}/${year}`)}>
        Calendar
      </button>
    </div>
  );
};

export default Home;
