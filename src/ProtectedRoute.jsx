import React from "react";
import { Navigate, useLocation, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const token = localStorage.getItem("token");
  const userType = localStorage.getItem("user_type");
  const userId = localStorage.getItem("user_id");
  const isLoggedIn = !!token;
  const location = useLocation();

  console.log("🔹 PrivateRoute Loaded!");
  console.log("🔹 Token:", token);
  console.log("🔹 UserType:", userType);
  console.log("🔹 UserID:", userId);
  console.log("🔹 Current Path:", location.pathname);

  if (!isLoggedIn) {
    return <Navigate to="/auth/sign-in" replace />;
  }

  if (isLoggedIn && (location.pathname === "/auth/sign-in" || location.pathname === "/auth/sign-up")) {
    if (userType === "admin") {
      return <Navigate to="/dashboard/admin" replace />;
    } else {
      return <Navigate to={`/dashboard/${userId}/user`} replace />;
    }
  }

  // ✅ Allow protected content to be rendered
  return <Outlet />;
};

export default ProtectedRoute;

