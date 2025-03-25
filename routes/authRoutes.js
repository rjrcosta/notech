import express from 'express';
import { registerUser, loginUser } from '../models/authModel.js'; // Import functions from the auth model

const router = express.Router();

// Registration route
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  
  try {
    const newUser = await registerUser(name, email, password);
    res.status(201).json(newUser);  // Return the newly created user
  } catch (err) {
    res.status(400).json({ msg: err.message });  // Send the error message to the client
  }
});

// Sign-in route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const { token, user } = await loginUser(email, password);
    res.json({
      token,
      user
    });
  } catch (err) {
    res.status(400).json({ msg: err.message });  // Send the error message to the client
  }
});

export default router;
