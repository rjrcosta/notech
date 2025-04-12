// import { useContext } from "react";
// import { Navigate, Outlet } from "react-router-dom";
// import { AuthContext } from "../contexts/AuthProvider";

// const AuthRoute = ({ type }) => {
//   const { user, redirectTo } = useContext(AuthContext);

//   if (type === "protected") {
//     // Protected pages: user must be logged in
//     return user ? <Outlet /> : <Navigate to={redirectTo} replace />;
//   }

//   if (type === "public") {
//     // Public pages: user must be logged out
//     return user ? <Navigate to={redirectTo} replace /> : <Outlet />;
//   }

//   return <Outlet />;
// };

// export default AuthRoute;