import { Routes, Route, Navigate } from "react-router-dom";
import { Cog6ToothIcon } from "@heroicons/react/24/solid";
import { IconButton } from "@material-tailwind/react";
import {
  Sidenav,
  DashboardNavbar,
  Configurator,
  Footer,
} from "@/widgets/layout";
import { useMaterialTailwindController, setOpenConfigurator } from "@/context";
import routes from "@/routes";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context";

export function Dashboard() {
  const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavType } = controller;
  const { redirectTo, user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const userRoleId = user?.payload?.role; // Get user role from user object

  useEffect(() => {
    // Wait until session is checked before showing dashboard
    if (user !== undefined) {
      setLoading(false);
    }
  }, [user]);

  console.log(`Dashboard loaded with user role id: ${userRoleId}`);

  // Redirect to login if user is missing (after session check)
  if (!user) {
    console.log("User is missing. Redirecting to login...");
    return <Navigate to={redirectTo} replace />;
  }

   // Filter routes based on user role
   const filteredRoutes = routes.filter(({ role }) => {
    if (!role) return true; // If no role defined, show the route to everyone
    return role.some(r => r === userRoleId); // Only show route if user's role matches
  });

  return (
    <div className="min-h-screen bg-blue-gray-50/50">
      {/* Sidenav */}
      <Sidenav
        routes={filteredRoutes} // Provide filtered routes to sidenav
        brandImg={
          sidenavType === "dark" ? "/img/logo-ct.png" : "/img/logo-ct-dark.png"
        }
      />
      <div className="p-4 xl:ml-80">
        {/* Dashboard Navbar */}
        <DashboardNavbar />
        <Configurator />
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
        <Routes>
          {filteredRoutes.map(({ layout, pages }) =>
            layout === "dashboard"
              ? pages.map(({ path, element }) => (
                  <Route exact path={path} element={element} key={path} role={userRoleId}  />
                ))
              : null
          )}
        </Routes>

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
