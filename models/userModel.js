import pool from "../db.js";

// Get all users
export const getUsers = async () => {
  const { rows } = await pool.query("SELECT * FROM users");
  return rows;
};

// Get user by ID
export const getUserById = async (id) => {
  const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
  return rows[0];
};

// Create a new user
export const createUser = async (name, email, password, userType) => {
  const { rows } = await pool.query(
    "INSERT INTO users (name, email, password, user_type) VALUES ($1, $2, $3, $4) RETURNING *",
    [name, email, password, userType]
  );
  return rows[0];
};

// Update a user
export const updateUser = async (id, name, email, userType) => {
  const { rows } = await pool.query(
    "UPDATE users SET name = $1, email = $2, user_type = $3 WHERE id = $4 RETURNING *",
    [name, email, userType, id]
  );
  return rows[0];
};

// Delete a user
export const deleteUser = async (id) => {
  await pool.query("DELETE FROM users WHERE id = $1", [id]);
  return { message: "User deleted" };
};
