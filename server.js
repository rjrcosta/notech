import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import session from "express-session"; // Import express-session
import userRoutes from "./routes/userRoutes.js";
import cropRoutes from "./routes/cropRoutes.js";  
import fieldRoutes from "./routes/fieldRoutes.js";  
import infostationRoutes from "./routes/infostationRoutes.js";  
import authRoutes from "./routes/authRoutes.js"; // Import auth routes

dotenv.config(); // Load environment variables

const app = express();
app.use(cors({
  origin: 'http://localhost:5173', // Allow requests from this origin
  credentials: true // Allow credentials to be included
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'default_secret', // Use a secret from .env or a default
  resave: false,
  saveUninitialized: true,
  cookie: { 
    secure: false, // Set to true if using HTTPS
    httpOnly: true, // Prevent client-side access to the cookie
    maxAge: 1000 * 60 * 60 * 24, // 1 day
  }
}));

// Mount the API routes
app.use("/users", userRoutes);
app.use("/crops", cropRoutes);
app.use("/fields", fieldRoutes);
app.use("/infostations", infostationRoutes);
app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000; 
const Server_URL = process.env.DB_HOST;
app.listen(PORT, () => console.log(`Server running on port ${PORT} and with url ${Server_URL}`));
