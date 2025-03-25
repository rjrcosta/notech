import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from './db.js'; // Ensure the correct path to db.js

// Function to register a new user
export const registerUser = async (name, email, password) => {
  const user_type = 'user';  // Default user type
  try {
    // Check if user already exists
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (result.rows.length > 0) {
      throw new Error('User already exists');
    }

    // Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the database
    const newUser = await pool.query(
      "INSERT INTO users (name, email, password, user_type) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, email, hashedPassword, user_type]
    );

    return newUser.rows[0];  // Return the newly created user
  } catch (err) {
    throw new Error(err.message);
  }
};

// Function to login a user
export const loginUser = async (email, password) => {
  try {
    // Check if user exists
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (result.rows.length === 0) {
      throw new Error('User does not exist');
    }

    const user = result.rows[0];

    // Compare the password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    // Generate a token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        user_type: user.user_type
      }
    };
  } catch (err) {
    throw new Error(err.message);
  }
};
