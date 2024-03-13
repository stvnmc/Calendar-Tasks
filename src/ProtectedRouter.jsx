import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "./context/userContext";

const ProtectedRoute = () => {
  const { isAuthenticated } = useUser();

  if (!isAuthenticated) return <Navigate to={"/login"} replace />;

  return <Outlet />;
};

export default ProtectedRoute;
