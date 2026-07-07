import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { getCurrentUser, logoutUser } from "../api/userApi";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleAuthExpired = () => {
      setUser(null);
      setLoading(false);
    };

    window.addEventListener("auth:expired", handleAuthExpired);

    return () => {
      window.removeEventListener("auth:expired", handleAuthExpired);
    };
  }, []);

  const fetchUser = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getCurrentUser();
      setUser(res.data.data);
    } catch (error) {
      console.error("fetchUser error:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = async () => {
    try {
      await logoutUser();
      setUser(null);
    } catch (error) {
      if (error.response?.status === 401) {
        setUser(null);
        return;
      }

      throw error;
    }
  };

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, fetchUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
