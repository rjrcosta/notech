import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [userType, setUserType] = useState(localStorage.getItem("user_type") || null);
  const [userId, setUserId] = useState(localStorage.getItem("user_id") || null);
  const navigate = useNavigate();

  console.log("I'm in the authContext");

  // Effect to clean up localStorage and state on logout
  useEffect(() => {
    if (!token) {
      // Remove items from localStorage only when token is null
      localStorage.removeItem("token");
      localStorage.removeItem("user_type");
      localStorage.removeItem("user_id");
    }
  }, [token]); // Effect triggers only when token changes

  const login = (token, userType, userId) => {
    setToken(token);
    setUserType(userType);
    setUserId(userId);
    localStorage.setItem("token", token);
    localStorage.setItem("user_type", userType);
    localStorage.setItem("user_id", userId);

    // Redirect based on user type
    if (userType === "admin") {
      navigate("/dashboard/admin");
    } else {
      navigate(`/dashboard/${userId}/user`);
    }
  };

  const logout = () => {
    setToken(null);  // This will trigger useEffect to clean up localStorage
    setUserType(null);
    setUserId(null);

    localStorage.removeItem("token");
    localStorage.removeItem("user_type");
    localStorage.removeItem("user_id");

    navigate("/auth/sign-in");  // Redirect to sign-in
  };

  return (
    <AuthContext.Provider value={{ token, userType, userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };
