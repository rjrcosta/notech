import pool from "../db.js";
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables


// Get all fields
export const getFields = async () => {
  const { rows } = await pool.query("SELECT id, name, description, area, image_polygon_url FROM fields");
  return rows;
};

// Get field by ID
export const getFieldById = async (id) => {
  const { rows } = await pool.query("SELECT crop_id, name, area, description  FROM fields WHERE id = $1", [id]);
  return rows[0];
};

// Create a new field
export const createField = async (fullPayload) => {
  const {payload:{ name, crop_id, description, area, area_image }, userId, userTenant_id  } = fullPayload; // Extract userId and userTenant_id from the payload
  console.log("In fieldModel createField", name, crop_id, description, area, area_image, userId, userTenant_id); // Log the incoming request body
  
  const  result  = await pool.query(
    "INSERT INTO fields (name, crop_id, client_id, tenant_id, description, area, image_polygon_url) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
    [name, crop_id, userId, userTenant_id, description, area, area_image]
  );
  return result.rows[0];
  
};

// Update a field
export const updateField = async (id, name, area) => {
  const { result } = await pool.query(
    "UPDATE fields SET name = $1, area = $2 WHERE id = $3 RETURNING *",
    [name, area, id]
  );
  return result.rows[0];
};

// Delete a field
export const deleteField = async (id) => {
  await pool.query("DELETE FROM fields WHERE id = $1", [id]);
  return { message: "Field deleted" };
};
