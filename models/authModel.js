import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pg from "pg"; //Postgres client
import pool from '../db.js';
import User from "../models/userModel.js";  // Adjust the path based on your project structure
import dotenv from 'dotenv';


dotenv.config(); // Load environment variables

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

 // Function to Register a new user
  export const registerUser = async (name, email, password) => {

    const  hashedPassword = await bcryptjs.hash(password, 12);

    console.log('Im in createUser function inside Usermodel ', hashedPassword)
  
    const result = await db.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
      [name, email, hashedPassword]
    );

    const newUser = result.rows[0]; // Get the newly created user from the result
    console.log('In routhmodel newUser',newUser);

    const payload = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.user_role_name,
    };
    console.log('In AuthModel payload:', payload)

    // Generate a token with user information
    // Note: Make sure to include the user information you need in the token payload
    const token = jwt.sign({ payload }, process.env.JWT_SECRET, { expiresIn: '1h' }); // Adjust the expiration time as needed

    
    console.log('In AuthModel', token)

    return {token: token}; // Return the token
  }

// Function to login a user
export const loginUser = async (email, password) => {
  try {
    console.log('Im in authmodel loginUser', email, password);

    // Check if user exists
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (result.rows.length === 0) {
      throw new Error('User does not exist');
    }
    
    const user = result.rows[0]; // Get the user from the result

    // Compare the password with the hashed password in the database
    const isMatch = await bcryptjs.compare(password, user.password); // Use bcryptjs to compare passwords
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    //
    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.user_role_name,
    };

    // Generate a token with user information
    // Note: Make sure to include the user information you need in the token payload
    const token = jwt.sign({ payload }, process.env.JWT_SECRET, { expiresIn: '1h' }); // Adjust the expiration time as needed
    
    console.log('In AuthModel', token)
    
    return {// Return the token
      token: token, // Include the token in the response
    };
  } catch (err) {
    throw new Error(err.message);
  }
};