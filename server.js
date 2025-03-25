import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import userRoutes from "./routes/userRoutes.js";
import cropRoutes from "./routes/cropRoutes.js";
import fieldRoutes from "./routes/fieldRoutes.js";  // Add this
import infostationRoutes from "./routes/infostationRoutes.js";  // Add this
import authRoutes from "./routes/authRoutes.js"; // Import auth routes

dotenv.config(); // Load environment variables

const app = express();
app.use(cors());
app.use(express.json());

// Mount the routes
app.use("/users", userRoutes);
app.use("/crops", cropRoutes);
app.use("/fields", fieldRoutes);
app.use("/infostations", infostationRoutes);
app.use("/auth", authRoutes);


app.use(express.static('build')); // Serve static files from the build directory

const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Get token from Authorization header
    if (!token) return res.sendStatus(401); // No token, unauthorized

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403); // Invalid token, forbidden
        req.user = user; // Attach user info to request
        next(); // Proceed to the next middleware or route handler
    });
};


app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const PORT = process.env.PORT || 5000; 

// Fix __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static frontend files
app.use(express.static(path.join(__dirname, "client/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/build", "index.html"));
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
