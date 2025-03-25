import pool from "../db.js";

// Get all crops
export const getCrops = async () => {
  const { rows } = await pool.query("SELECT * FROM crops");
  return rows;
};

// Get crop by ID
export const getCropById = async (id) => {
  const { rows } = await pool.query("SELECT * FROM crops WHERE id = $1", [id]);
  return rows[0];
};

// Create a new crop
export const createCrop = async (clientId, name, type) => {
  const { rows } = await pool.query(
    "INSERT INTO crops (client_id, name, type) VALUES ($1, $2, $3) RETURNING *",
    [clientId, name, type]
  );
  return rows[0];
};

// Update a crop
export const updateCrop = async (id, name, type) => {
  const { rows } = await pool.query(
    "UPDATE crops SET name = $1, type = $2 WHERE id = $3 RETURNING *",
    [name, type, id]
  );
  return rows[0];
};

// Delete a crop
export const deleteCrop = async (id) => {
  await pool.query("DELETE FROM crops WHERE id = $1", [id]);
  return { message: "Crop deleted" };
};
