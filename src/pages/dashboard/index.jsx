// import { Routes, Route, Navigate } from "react-router-dom";
// import { useContext } from "react";
// import AuthContext from "../../context/authContext";
// import User from "./user";
// import Admin from "./admin";
// import Profile from "./profile";
// import Tables from "./tables";
// import Notifications from "./notifications";

// const Dashboard = () => {
//   const { userId, userType } = useContext(AuthContext);

//   console.log("Dashboard Loaded - UserType:", userType, "UserID:", userId);

//   return (
//     <Routes>
//       {/* Admin Dashboard */}
//       {userType === "admin" && <Route path="admin" element={<Admin />} />}

//       {/* User Dashboard (with dynamic ID) */}
//       {userType === "client" && <Route path={`${userId}/user`} element={<User />} />}

//       {/* Other Pages */}
//       <Route path="profile" element={<Profile />} />
//       <Route path="tables" element={<Tables />} />
//       <Route path="notifications" element={<Notifications />} />

//       {/* Redirect if the user accesses an invalid route */}
//       <Route
//         path="*"
//         element={
//           <Navigate
//             to={userType === "admin" ? "/dashboard/admin" : `/dashboard/${userId}/user`}
//             replace
//           />
//         }
//       />
//     </Routes>
//   );
// };

// export default Dashboard;

import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../../context/authContext";
import User from "./user";
import Admin from "./admin";
import Profile from "./profile";
import Tables from "./tables";
import Notifications from "./notifications";

const Dashboard = () => {
  const { userId, userType } = useContext(AuthContext);

  console.log("Dashboard Loaded - UserType:", userType, "UserID:", userId);

  // Check if userType and userId are set correctly
  if (!userType || !userId) {
    // Handle redirect if userType or userId is not available
    return <Navigate to="/auth/sign-in" replace />;
  }

  return (
    <div>      
      <Routes>
        {/* Admin Dashboard */}
        {userType === "admin" && (
          <Route path="admin" element={<Admin />} />
        )}

        {/* User Dashboard with dynamic user ID */}
        {userType === "user" && (
          <Route path={`${userId}/user`} element={<User />} />
        )}

        {/* Common Routes */}
        <Route path="profile" element={<Profile />} />
        <Route path="tables" element={<Tables />} />
        <Route path="notifications" element={<Notifications />} />

        {/* Redirect to correct default dashboard page if invalid route */}
        <Route
          path="*"
          element={
            <Navigate
              to={
                userType === "admin"
                  ? "/dashboard/admin"
                  : `/dashboard/${userId}/user`
              }
              replace
            />
          }
        />
      </Routes>

      {/* Optional: use Outlet to handle nested routes */}
      <Outlet />
    </div>
  );
};

export default Dashboard;

