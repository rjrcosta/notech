import express from 'express';
import registerSchema from '../validationSchema.js';  // Import Joi schema
import { registerUser, loginUser } from '../models/authModel.js'; // Import functions from the auth model
import jwt from 'jsonwebtoken';


const router = express.Router();


//Create new User
router.post("/register", async (req, res) => {
  console.log("In Register authRoute data received from register from form:", req.body); 
  
  // Validate the request body using Joi schema
  const { error } = registerSchema.validate(req.body, { abortEarly: false });

  if (error) {
    // Return validation errors if any
    return res.status(400).json({ errors: error.details.map((err) => err.message) });
  }

  const { name, email, password  } = req.body;

  try {
    const { token } = await registerUser(name, email, password);
    console.log('In AuthRoutes and just created a user. token:', token )
    
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
  const { email, password } = req.body;
  console.log('Im in login route', email, password)
  
  try {
    const { token } = await loginUser(email, password);
    console.log('In AuthRoutes',token)

    // Store the token in the session
    req.session.token = token; // Store the token in the session
    console.log('Token stored in session:', req.session.token);

    const decoded = jwt.verify(req.session.token, process.env.JWT_SECRET); // Decode the token to get user information
    console.log('Decoded token in session route:', decoded); // Log the decoded token information
    res.status(200).json({ user: decoded }); // Send the decoded user information in the response

  } catch (err) {
    res.status(400).json({ msg: err.message });  // Send the error message to the client
  }
});

// Session Route (Check if user is logged in)
router.get("/session", (req, res) => {
  if (!req.session.token) {
    console.log('No token found in session');
    return res.status(401).json({ message: "Unauthorized enter" });
  }

  try {
    const decoded = jwt.verify(req.session.token, process.env.JWT_SECRET);
    console.log('Decoded token in session route:', decoded);
    res.status(200).json({ user: decoded });
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

export default router;
