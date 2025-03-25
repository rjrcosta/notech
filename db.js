import pkg from "pg";  // Import pg module
import dotenv from "dotenv";  // Import dotenv

dotenv.config();  // Load environment variables

const { Pool } = pkg;  // Destructure Pool from pg

// Ensure required env variables are set
const requiredEnv = ["DB_USER", "DB_HOST", "DB_NAME", "DB_PASSWORD", "DB_PORT"];
const missingEnv = requiredEnv.filter((key) => !process.env[key]);

if (missingEnv.length) {
  console.error(`❌ Missing environment variables: ${missingEnv.join(", ")}`);
  process.exit(1);  // Exit process if variables are missing
}

// Create a PostgreSQL connection pool
const pool = new Pool({  
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  max: 10,  // Maximum number of clients in the pool
  idleTimeoutMillis: 30000,  // Close idle clients after 30 seconds
  connectionTimeoutMillis: 5000,  // Return an error after 5 seconds if connection fails
});

// Test database connection
(async () => {
  try {
    const client = await pool.connect();
    console.log("✅ Connected to the PostgreSQL database!");
    client.release();  // Release the connection back to the pool
  } catch (err) {
    console.error("❌ Error connecting to the database:", err.stack);
    process.exit(1);  // Exit process if connection fails
  }
})();

export default pool;  // Export the pool for use in other files

