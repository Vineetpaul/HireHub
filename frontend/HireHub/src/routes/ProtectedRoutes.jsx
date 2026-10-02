import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoutes = ({ requiredRole }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/Login" replace />;
  }

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));

    if (payload.exp * 1000 < Date.now()) {
      localStorage.removeItem("token");
      return <Navigate to="/Login" replace />;
    }

    if (requiredRole && payload.role !== requiredRole) {
      return <Navigate to="/" replace />;
    }

    return <Outlet />;
  } catch {
    localStorage.removeItem("token");
    return <Navigate to="/Login" replace />;
  }
};

export default ProtectedRoutes;
