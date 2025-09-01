// src/context/CoachAuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const CoachAuthContext = createContext();

export const CoachAuthProvider = ({ children }) => {
  const [coach, setCoach] = useState(null);

  // auto check if coach logged in
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/coach/me", { withCredentials: true })
      .then((res) => setCoach(res.data.coach))
      .catch(() => setCoach(null));
  }, []);

  const login = (coachData) => {
    setCoach(coachData);
  };

  const logout = async () => {
    try {
      await axios.post("http://localhost:5000/api/coach/logout", {}, { withCredentials: true });
      setCoach(null);
    } catch (err) {
      console.error("Logout error", err);
    }
  };

  return (
    <CoachAuthContext.Provider value={{ isLoggedIn: !!coach, coach, login, logout }}>
      {children}
    </CoachAuthContext.Provider>
  );
};

export const useCoachAuth = () => useContext(CoachAuthContext);
