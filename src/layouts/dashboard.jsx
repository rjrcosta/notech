// import { Routes, Route, Navigate } from "react-router-dom";
// import { Cog6ToothIcon } from "@heroicons/react/24/solid";
// import { IconButton } from "@material-tailwind/react";
// import {
//   Sidenav,
//   DashboardNavbar,
//   Configurator,
//   Footer,
// } from "@/widgets/layout";
// import routes from "@/routes";
// import { useMaterialTailwindController, setOpenConfigurator } from "@/context";
// import { useContext } from "react";
// import AuthContext from "@/context/AuthContext";

// export function Dashboard() {
//   const [controller, dispatch] = useMaterialTailwindController();
//   const { sidenavType } = controller;
//   const { userType, userId } = useContext(AuthContext);

//   // Redirect to login if userType is missing (prevents unauthorized access)
//   if (!userType) {
//     return <Navigate to="/login" replace />;
//   }

//   // Filter routes based on user type
//   const filteredRoutes = routes.filter(
//     ({ role }) => !role || role.includes(userType) // Allow routes with no role or matching role
//   );

//   return (
//     <div className="min-h-screen bg-blue-gray-50/50">
//       {/* Sidenav */}
//       <Sidenav
//         routes={routes} // Provide routes to sidenav
//         brandImg={
//           sidenavType === "dark" ? "/img/logo-ct.png" : "/img/logo-ct-dark.png"
//         }
//       />
//       <div className="p-4 xl:ml-80">
//         {/* Dashboard Navbar */}
//         <DashboardNavbar />
//         <Configurator />
//         {/* Floating Configurator Button */}
//         <IconButton
//           size="lg"
//           color="white"
//           className="fixed bottom-8 right-8 z-40 rounded-full shadow-blue-gray-900/10"
//           ripple={false}
//           onClick={() => setOpenConfigurator(dispatch, true)}
//         >
//           <Cog6ToothIcon className="h-5 w-5" />
//         </IconButton>
        
//         {/* Routes for Pages */}
//         <Routes>
//           {filteredRoutes.map(
//             ({ layout, pages }) =>
//               layout === "dashboard" &&
//               pages.map(({ path, element }) => (
//                 <Route exact path={path} element={element} key={path} />
//               ))
//           )}
//         </Routes>

//         {/* Footer */}
//         <div className="text-blue-gray-600">
//           <Footer />
//         </div>
//       </div>
//     </div>
//   );
// }

// Dashboard.displayName = "/src/layout/dashboard.jsx";

// export default Dashboard;

import { Routes, Route, Navigate } from "react-router-dom";
import { Cog6ToothIcon } from "@heroicons/react/24/solid";
import { IconButton } from "@material-tailwind/react";
import {
  Sidenav,
  DashboardNavbar,
  Configurator,
  Footer,
} from "@/widgets/layout";
import routes from "@/routes";
import { useMaterialTailwindController, setOpenConfigurator } from "@/context";
import { useContext } from "react";
import AuthContext from "@/context/AuthContext";

export function Dashboard() {
  const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavType } = controller;
  const { userType, userId } = useContext(AuthContext);

  // Redirect to login if userType is missing (prevents unauthorized access)
  if (!userType) {
    return <Navigate to="/login" replace />;
  }

  // Filter routes based on user type
  const filteredRoutes = routes.filter(
    ({ role }) => !role || role.includes(userType) // Allow routes with no role or matching role
  );

  return (
    <div className="min-h-screen bg-blue-gray-50/50">
      {/* Sidenav */}
      <Sidenav
        routes={routes} // Provide routes to sidenav
        brandImg={
          sidenavType === "dark" ? "/img/logo-ct.png" : "/img/logo-ct-dark.png"
        }
      />
      <div className="p-4 xl:ml-80">
        {/* Dashboard Navbar */}
        <DashboardNavbar />
        
        {/* Floating Configurator Button */}
        <IconButton
          size="lg"
          color="white"
          className="fixed bottom-8 right-8 z-40 rounded-full shadow-blue-gray-900/10"
          ripple={false}
          onClick={() => setOpenConfigurator(dispatch, true)}
        >
          <Cog6ToothIcon className="h-5 w-5" />
        </IconButton>
        
        {/* Routes for Pages */}
        <div className="flex-1 overflow-y-auto">
          <Routes>
            {filteredRoutes.map(({ layout, pages }) => {
              return (
                layout === "dashboard" &&
                pages.map(({ path, element }) => (
                  <Route key={path} path={path} element={element} />
                ))
              );
            })}
          </Routes>
        </div>

        {/* Footer */}
        <div className="text-blue-gray-600">
          <Footer />
        </div>
      </div>
    </div>
  );
}

Dashboard.displayName = "/src/layout/dashboard.jsx";

export default Dashboard;
