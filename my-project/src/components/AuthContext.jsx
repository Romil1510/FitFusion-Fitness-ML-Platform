// src/components/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);   // logged-in user
  const [coach, setCoach] = useState(null); // logged-in coach

  // Check if normal user is logged in
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/auth/me", { withCredentials: true })
      .then((res) => setUser(res.data.user))
      .catch(() => setUser(null));
  }, []);

  // Check if coach is logged in
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/coach/me", { withCredentials: true })
      .then((res) => setCoach(res.data.coach))
      .catch(() => setCoach(null));
  }, []);

  // USER login/logout
  const login = (userData) => setUser(userData);
  const logout = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/logout", {}, { withCredentials: true });
      setUser(null);
    } catch (error) {
      console.error("User logout error:", error);
    }
  };

  // COACH login/logout
  const coachLogin = (coachData) => setCoach(coachData);
  const coachLogout = async () => {
    try {
      await axios.post("http://localhost:5000/api/coach/logout", {}, { withCredentials: true });
      setCoach(null);
    } catch (error) {
      console.error("Coach logout error:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        // user values
        isLoggedIn: !!user,
        user,
        login,
        logout,

        // coach values
        isCoachLoggedIn: !!coach,
        coach,
        coachLogin,
        coachLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// One hook for both
export const useAuth = () => useContext(AuthContext);
