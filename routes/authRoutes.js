import express from 'express';
import registerSchema from '../validationSchema.js';  // Import Joi schema
import { registerUser, loginUser } from '../models/authModel.js'; // Import functions from the auth model
import jwt from 'jsonwebtoken';
import pkg from 'react-router-dom';
import { authorizeRoles } from '../src/MiddleWare/authMiddleware.js';
const { redirectTo } = pkg;

const router = express.Router();


// Middleware to check if user is logged in and has the right role and is redirected correctly
const adminRoles = ["super_admin", "admin"];
const userRoles = ["owner", "manager", "analyst"];

function getRedirectPath(role, currentPath) {
  if (role) {
    if (adminRoles.includes(role)) {
      if (currentPath === "/dashboard/user") { // Check if the user is trying to access the user dashboard
        return "/dashboard/admin"; // Redirect to admin dashboard if user is an admin   
      }
      return "/dashboard/admin";
    }

    if (userRoles.includes(role)) {
      if (currentPath === "/dashboard/admin") { // Check if the user is trying to access the admin
        return "/dashboard/user"; // Redirect to user dashboard if user is a user 
      }
      return "/dashboard/user";
    }
  }
  else {
    return "/auth/sign-in"; // Redirect to sign-in page if no role is found
  }
}


//Create new User
router.post("/register", async (req, res) => {
  console.log("In Register authRoute data received from register from form:", req.body);

  // Validate the request body using Joi schema
  const { error } = registerSchema.validate(req.body, { abortEarly: false });

  if (error) {
    // Return validation errors if any
    return res.status(400).json({ errors: error.details.map((err) => err.message) });
  }

  const { name, email, password } = req.body;

  try {
    const { token } = await registerUser(name, email, password);
    console.log('In AuthRoutes and just created a user. token:', token)

    // Store user information in session
    req.session.token = token; // Store the token in the session
    req.session.save((err) => {
      if (err) {
        console.error("Session save error:", err);
        return res.status(500).json({ error: "Failed to save session" });
      }

      // Now it’s safe to respond
      res.json({ message: "User stored in sessions successfully" });
    });

  } catch (err) {
    console.error("Error:", err);

    // Ensure error response is only sent once
    if (!res.headersSent) {
      return res.status(500).json({ error: err.message });
    }
  }
});


// Sign-in route
router.post("/login", async (req, res) => {

  const currentPath = req.query.currentPath; // frontend sends this

  const { email, password } = req.body;
  // const adminRoles = ["super_admin", "admin"];
  // const userRoles = ["owner", "manager", "analyst"];
  console.log('Im in login route', email, password)

  try {
    const { token } = await loginUser(email, password);
    console.log('In AuthRoutes', token)

    // Store the token in the session
    req.session.token = token; // Store the token in the session
    console.log('Token stored in session:', req.session.token);

    const decoded = jwt.verify(req.session.token, process.env.JWT_SECRET); // Decode the token to get user information
    const userRole = decoded.payload.role; // Extract the user role from the decoded token
    console.log('Decoded token in session route:', decoded); // Log the decoded token information

    console.log('User role:', userRole); // Log the user role
    // Determine the redirect path based on the user role
    const redirectTo = getRedirectPath(userRole, currentPath);

    res.status(200).json({
      user: decoded,
      redirectTo,
    });

  } catch (err) {
    res.status(400).json({ msg: err.message });  // Send the error message to the client
  }
});



// Session Route (Check if user is logged in)
router.get("/session", (req, res) => {

  const currentPath = req.query.currentPath; // frontend sends this

  if (!req.session.token) {
    console.log('No token found in session');
    return res.status(401).json({ message: "Unauthorized enter" });
  }

  try {
    const decoded = jwt.verify(req.session.token, process.env.JWT_SECRET);
    const userRole = decoded.payload.role; // Extract the user role from the decoded token
    console.log('Decoded token in session route:', decoded, userRole); // Log the decoded token information

    // Determine the redirect path based on the user role
    const redirectTo = getRedirectPath(userRole, currentPath);
    console.log('Redirect path:', redirectTo); // Log the redirect path

    res.status(200).json({ user: decoded, redirectTo });

  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
});


// Logout route
router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ message: "Logout failed" });
    res.clearCookie("connect.sid");
    res.status(200).json({ message: "Logged out successfully" });
  });
});


// Example protected routes
// These routes require authentication and authorization
router.get("/admin", authorizeRoles(["admin", "super_admin"]), (req, res) => {
  res.json({ message: "Welcome to the admin dashboard", user: req.user });
});

router.get("/user", authorizeRoles(["owner", "manager", "analyst"]), (req, res) => {
  res.json({ message: "Welcome to the user dashboard", user: req.user });
});


export default router;
