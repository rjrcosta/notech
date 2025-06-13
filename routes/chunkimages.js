import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

 // Required for ES modules to work with __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
// Ensure uploads/photos folder exists
const uploadPath = path.join(__dirname, "uploads", "photos");
fs.mkdirSync(uploadPath, { recursive: true });

const imageChunks = new Map(); // imageId -> { chunks, received, totalChunks, ... }

router.post("/upload-chunk", (req, res) => {
  const imageId = req.headers["x-image-id"];
  const chunkIndex = parseInt(req.headers["x-chunk-index"]);
  const totalChunks = parseInt(req.headers["x-total-chunks"]);
  const timestamp = parseInt(req.headers["x-timestamp"] || Date.now());

  if (!imageId || isNaN(chunkIndex) || isNaN(totalChunks)) {
    return res.status(400).json({ error: "Missing headers" });
  }

  const chunks = imageChunks.get(imageId) || {
    chunks: new Array(totalChunks),
    received: new Set(),
    totalChunks,
    timestamp,
    sensors: null,
  };

  // Collect binary data from the request
  const chunksArray = [];
  req.on("data", chunk => chunksArray.push(chunk));
  req.on("end", () => {
    const buffer = Buffer.concat(chunksArray);
    chunks.chunks[chunkIndex] = buffer;
    chunks.received.add(chunkIndex);

    // Save sensor headers if provided
    if (req.headers["x-air-temp"]) {
      chunks.sensors = {
        airTemp: parseFloat(req.headers["x-air-temp"]),
        airHum: parseFloat(req.headers["x-air-hum"]),
        soilTemp: parseFloat(req.headers["x-soil-temp"]),
        soilMoist: parseInt(req.headers["x-soil-moist"]),
      };
    }

    imageChunks.set(imageId, chunks);

    if (chunks.received.size === totalChunks) {
      const finalBuffer = Buffer.concat(chunks.chunks);
      const filename = `${imageId}-${timestamp}.jpg`;
      const filepath = path.join(uploadPath, filename);

      fs.writeFileSync(filepath, finalBuffer);

      if (chunks.sensors) {
        const sensorPath = path.join(uploadPath, `${filename}.json`);
        fs.writeFileSync(sensorPath, JSON.stringify(chunks.sensors, null, 2));
      }

      console.log("✅ Imagem salva:", filename, 'at: ', new Date());
      console.log('temp:', chunks.sensors?.airTemp);
      console.log('hum:', chunks.sensors?.airHum);
      console.log('soil_temp: ', chunks.sensors?.soilTemp);
      console.log('Soil_hum: ', chunks.sensors?.soilMoist);
      imageChunks.delete(imageId);
      return res.json({ message: "Imagem salva com sucesso", filename });
    } else {
      return res.json({ message: `Chunk ${chunkIndex} recebido` });
    }
  });
});

export default router;
