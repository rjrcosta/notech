import React from "react";
import { Navigate, useLocation, Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "@/context";

const PrivateRoute = () => {
  const {  token, user } = useContext(AuthContext);
  const userId = user?.id;
  const userRoleId = user?.user_role_id;

  // if(token) {
  //   const isLoggedIn = true;
  //   if (isLoggedIn && (location.pathname === "/auth/sign-in" || location.pathname === "/auth/sign-up")) {
  //     if (userRoleId === 1 || userRoleId === 2) {
  //       return <Route path="/dashboard/*" element={<Dashboard />} />;
  //     } else {
  //       return <Navigate to="/dashboard/${userId}/user" replace />;
  //     }
  //   }
  // }else {
  //   const isLoggedOut = true;
  //   return <Navigate to="/auth/sign-in" replace />;

  // }

  const location = useLocation();

  console.log("🔹 PrivateRoute Loaded!");
  console.log("🔹 Token:", token);
  console.log("🔹 User:", user);

  // ✅ Allow protected content to be rendered
  return <Outlet />;
};

export default PrivateRoute;