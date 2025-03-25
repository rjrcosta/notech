import pool from "../db.js";

// Get all info stations
export const getInfoStations = async () => {
  const { rows } = await pool.query("SELECT * FROM infostations");
  return rows;
};

// Get info station by ID
export const getInfoStationById = async (id) => {
  const { rows } = await pool.query("SELECT * FROM infostations WHERE id = $1", [id]);
  return rows[0];
};

// Create a new info station
export const createInfoStation = async (areaId, name, latitude, longitude) => {
  const { rows } = await pool.query(
    "INSERT INTO infostations (area_id, name, latitude, longitude) VALUES ($1, $2, $3, $4) RETURNING *",
    [areaId, name, latitude, longitude]
  );
  return rows[0];
};

// Update an info station
export const updateInfoStation = async (id, name, latitude, longitude) => {
  const { rows } = await pool.query(
    "UPDATE infostations SET name = $1, latitude = $2, longitude = $3 WHERE id = $4 RETURNING *",
    [name, latitude, longitude, id]
  );
  return rows[0];
};

// Delete an info station
export const deleteInfoStation = async (id) => {
  await pool.query("DELETE FROM infostations WHERE id = $1", [id]);
  return { message: "Info station deleted" };
};
