import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Only import once

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  // Store authentication state in memory only
  const [user, setUser] = useState(null);
  const [redirectTo, setRedirectTo] = useState(null); // State to manage redirection
  

  
    const checkAuth = async () => {
      try {
        const response = await fetch("http://localhost:5000/auth/session", {
          method: "GET",
          credentials: "include", // Send cookies with request
        });

        if (response.ok) {
          const data = await response.json();
          console.log("Receiving data from auth/Session:", data);
          setUser(data.user);   // Set user data from response
          setRedirectTo(data.redirectTo); // Set redirect path based on user role
          console.log("Redirect path set in AuthContext:", data.redirectTo);
          console.log('User set in AuthContext-useEffect:', data.user);
          navigate(data.redirectTo); // Redirect to the appropriate page based on user role

        } else {
          setUser(null);  // Clear user data if session check fails
          setRedirectTo(null); // Clear redirect path
          navigate("/auth/sign-in");  // Uncomment to navigate if session is not valid
        }
      } catch (error) {
        console.error("Error checking session:", error);
        setUser(null);  // Clear user data if error occurs
        setRedirectTo(null); // Clear redirect path

        // Optionally navigate to login page or show an error message
        navigate("/auth/sign-in");  // Uncomment to navigate if error occurs
      }
    };


  useEffect(() => {
      // Check if user is logged in using an API call to the backend
    checkAuth();
  }, []);

  

  // Function to set token and user data in state after login
  const login = (userData) => {
    setUser(userData.user);    // Save user in state
  };

  // Function to log out the user
  const logout = async () => {
    try {
      await fetch("http://localhost:5000/auth/logout", {
        method: "POST",
        credentials: "include", // Important for session-based auth
      });

      // Clear state
      setUser(null);

      // Redirect to login
      navigate("/auth/sign-in");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  console.log("AuthContext Loaded!");
  console.log("User:", user);

  return (
    <AuthContext.Provider value={{ user,redirectTo, checkAuth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
export { AuthContext };
