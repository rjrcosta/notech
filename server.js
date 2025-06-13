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
import cookieParser from 'cookie-parser';
import uploadRoutes from "./routes/uploadModel.js";
import sensorupload from "./routes/sensorUploadModel.js"
import chunkimages from "./routes/chunkimages.js"

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config(); // Load environment variables

const app = express();
app.use(cors({
  origin: 'http://localhost:5173', // Allow requests from this origin
  credentials: true // Allow credentials to be included
}));

//Before json and urlencoded because we are using it to receive binary data
app.use("/photos", chunkimages);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser()); // Use cookie-parser middleware

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

// Serve images statically if needed
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/photos", uploadRoutes, sensorupload, chunkimages);

app.use('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build/index.html'));
});

app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000; 
const Server_URL = process.env.DB_HOST;
app.listen(PORT,'0.0.0.0', () => console.log(`Server running on port ${PORT} and with url ${Server_URL}`));
