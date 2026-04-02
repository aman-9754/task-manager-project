import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // while checking auth
  if (loading) return <p>Loading...</p>;

  // if not logged in
  if (!user) return <Navigate to="/login" />;

  return children;
};

export default ProtectedRoute;
