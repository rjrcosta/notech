import pool from "../db.js";

// Get all fields
export const getFields = async () => {
  const { rows } = await pool.query("SELECT * FROM fields");
  return rows;
};

// Get field by ID
export const getFieldById = async (id) => {
  const { rows } = await pool.query("SELECT * FROM fields WHERE id = $1", [id]);
  return rows[0];
};

// Create a new field
export const createField = async (cropId, name, area) => {
  const { rows } = await pool.query(
    "INSERT INTO fields (crop_id, name, area) VALUES ($1, $2, $3) RETURNING *",
    [cropId, name, area]
  );
  return rows[0];
};

// Update a field
export const updateField = async (id, name, area) => {
  const { rows } = await pool.query(
    "UPDATE fields SET name = $1, area = $2 WHERE id = $3 RETURNING *",
    [name, area, id]
  );
  return rows[0];
};

// Delete a field
export const deleteField = async (id) => {
  await pool.query("DELETE FROM fields WHERE id = $1", [id]);
  return { message: "Field deleted" };
};
