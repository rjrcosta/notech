import express from "express";
import User from "../models/userModel.js";
import pg from "pg";
import bcryptjs from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

const router = express.Router();

//Get All users route
router.get("/", async (req, res) => {
  try {
    const users = await getUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//Get User by Id
router.get("/:id", async (req, res) => {
  try {
    const user = await User.getUserById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//Create new User
router.post("/newuser", async (req, res) => {
  console.log("Incoming request body:", req.body); 

  const { name, email, password } = req.body;

  try {
    const createdUser = await User.createUser(name, email, password);
    return res.status(201).json(createdUser);

    // return res.status(201).json(createdUser);
  } catch (err) {
    console.error("Error:", err);
    
    // Ensure error response is only sent once
    if (!res.headersSent) {
      return res.status(500).json({ error: err.message });
    }
  }
});


//Update an existing user 
router.put("/:id", async (req, res) => {
  const { name, email, user_role_id } = req.body;
  try {
    const user = await User.updateUser(req.params.id, name, email, user_role_id);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


//Delete a User
router.delete("/:id", async (req, res) => {
  try {
    await User.deleteUser(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
