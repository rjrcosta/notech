import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pg from "pg"; //Postgres client
import pool from '../db.js';
import User from "../models/userModel.js";  // Adjust the path based on your project structure


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

    

    return new User(result.rows[0].name, result.rows[0].email, result.rows[0].password);
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
    
    const user = result.rows[0];

    // Compare the password with the hashed password in the database
    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    // Generate a token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    console.log('In AuthModel', token, user.id, user.email, user.user_role_id)
    
    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        user_role_id: user.user_role_id
      }
    };
  } catch (err) {
    throw new Error(err.message);
  }
};
