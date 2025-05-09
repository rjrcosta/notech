import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { landingAi } from "../models/LandinAIModel.js";

// Required for ES modules to work with __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Ensure uploads/photos folder exists
const uploadPath = path.join(__dirname, "uploads", "photos");
fs.mkdirSync(uploadPath, { recursive: true });

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const uniqueName = `${timestamp}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 2048 * 2048, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const allowedExtensions = [".jpg", ".jpeg", ".png", ".heic", ".heif"];
    const allowedMimeTypes = [
      "image/jpeg",
      "image/png",
      "image/heic",
      "image/heif",
      "application/octet-stream", // needed for HEIC
    ];

    if (
      allowedExtensions.includes(ext) &&
      allowedMimeTypes.includes(file.mimetype)
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only JPEG, PNG, and HEIC/HEIF files are allowed"), false);
    }
  },
});

router.post("/upload", upload.array("images"), (req, res) => {
  const metadata = [];

  // If req.body.data is a JSON string (from FormData), parse it first
  let data = req.body.data;
  if (typeof data === "string") {
    try {
      data = JSON.parse(data);
    } catch (error) {
      return res.status(400).json({ error: "Invalid data format" });
    }
  }

  req.files.forEach((file, index) => {
    const item = data[index];

    if (!item) return;

    metadata.push({
      path: file.path,
      latitude: item.latitude,
      longitude: item.longitude,
      field_id: item.field_id,
      prompt: item.prompt,
    });
  });
  console.log('metadata', metadata)

  //get data from images with Landing AI API
  const processedData = landingAi(metadata)

  console.log('processed data', processedData)


  res.status(200).json({ message: "Photos saved", metadata });
});

export default router;
