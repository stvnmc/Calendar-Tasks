import { useNavigate } from "react-router-dom";
import { useUser } from "../context/userContext";
import { useEffect } from "react";

const Home = () => {
  const month = new Date().getMonth();
  const navigate = useNavigate();
  const { isAuthenticated } = useUser();

  useEffect(() => {
    if (!isAuthenticated) navigate("/login");
  });

  return (
    <div>
      <button onClick={() => navigate(`/month/${month}`)}>Calendar</button>
    </div>
  );
};

export default Home;
