import express from 'express';
import registerSchema from '../validationSchema.js';  // Import Joi schema
import { registerUser, loginUser } from '../models/authModel.js'; // Import functions from the auth model

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
    const createdUser = await registerUser(name, email, password);
    console.log('In AuthRoutes and just created a user. name:', createdUser.name,'email: ', createdUser.email,'password: ', createdUser.password)
    
    // Store user information in session
    req.session.user = createdUser;
    const sessionUser = sessionStorage.user // Store user info in session
    console.log('session storage:', sessionUser);
    res.json({ message: "On AuthRoutes. User stored in sessions successfully", sessionUser }); // Redirect to the dashboard after successful login

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
    const { token, user } = await loginUser(email, password);
    console.log('In AuthRoutes', token, user.id, user.email, user.user_role_id)

    // Store user information in session
    req.session.token = token; // Store user info in session
    req.session.user = user; // Store user info in session

    //Redirect to dashboard 
    // res.redirect("/dashboard/*"); // Redirect to the dashboard after successful login
    
    //Sends back the token and user information in the response
    res.json({token, user });

  } catch (err) {
    res.status(400).json({ msg: err.message });  // Send the error message to the client
  }
});

// Session Route (Check if user is logged in)
router.get("/session", (req, res) => {
  if (req.session.user && req.session.token) {
    console.log('In authRoutes session:', req.session.user, req.session.token)
    res.json({ user: req.session.user, token: req.session.token });
  } else {
      res.json({ user: null });
  }
});

// Logout Route (Clear session)
router.post("/logout", (req, res) => {
  req.session.destroy();
  res.json({ message: "Logged out successfully" });
});



export default router;
