import { Routes, Route, Navigate } from "react-router-dom";
import { SignIn } from "./pages/auth/sign-in";
import { SignUp } from "./pages/auth/sign-up";
import Dashboard from "./pages/dashboard";
import { AuthProvider } from "./context/authContext";
import PrivateRoute from "./ProtectedRoute";

function App() {
  console.log("I'm in App.js")
  return (
    <AuthProvider>
        <Routes>
          {/* public Routes */}
          <Route path="/auth/sign-in" element={<SignIn />} />
          <Route path="/auth/sign-up" element={<SignUp />} />
          
          {/* Protected Dashboard Route */}
          <Route element={<PrivateRoute allowedRoles={["admin", "client"]} />}>
            <Route path="/dashboard/*" element={<Dashboard />} />
          </Route>

          {/* Default Route */}
          <Route path="*" element={<Navigate to="/auth/sign-in" />} />
        </Routes>
    </AuthProvider>
  );
}

export default App;

