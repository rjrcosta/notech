import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  // Store authentication state in memory only
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in using an API call to the backend
    const checkAuth = async () => {
      try {
        const response = await fetch("http://localhost:5000/auth/session", {
          method: "GET",
          credentials: "include", // Send cookies with request
        });

        if (response.ok) {
          const data = await response.json();
          console.log("Receiving data from auth/Session:");
          console.log(data);
          console.log("Token:", data.token);
          console.log("User:", data.user);
          setToken(data.token);
          setUser(data.user);

        } else {
          setToken(null);
          setUser(null);
          // navigate("/auth/sign-in");
        }
      } catch (error) {
        console.error("Error checking session:", error);
        setToken(null);
        setUser(null);
        // navigate("/auth/sign-in");
      }
    };

    checkAuth();
  }, [navigate]);

  const login = (token, user) => {
    setToken(token);
    setUser(user);
  };
  
  const logout = async () => {
    try {
      await fetch("http://localhost:5000/auth/logout", {
        method: "POST",
        credentials: "include", // Important for session-based auth
      });

      // Clear state
      setToken(null);
      setUser(null);

      // Redirect to login
      navigate("/auth/sign-in");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  console.log("AuthContext Loaded!");
  console.log("Token:", token);
  console.log("User:", user);

  return (
    <AuthContext.Provider value={{token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
export {AuthContext}