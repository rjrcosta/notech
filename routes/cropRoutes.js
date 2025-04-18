import express from "express";
import {
  getCrops,
  getCropById,
  createCrop,
  updateCrop,
  deleteCrop,
} from "../models/cropModel.js";

const router = express.Router();

// Get all crops
router.get("/allcrops", async (req, res) => {
  try {
    const crops = await getCrops();
    console.log("Crops fetched:", crops); // Log the fetched crops
    res.json(crops);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get crop by ID
router.get("/:id", async (req, res) => {
  try {
    const crop = await getCropById(req.params.id);
    if (!crop) return res.status(404).json({ message: "Crop not found" });
    res.json(crop);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create new crop
router.post("/", async (req, res) => {
  const { clientId, name, type } = req.body;
  try {
    const crop = await createCrop(clientId, name, type);
    res.status(201).json(crop);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update an existing crop
router.put("/:id", async (req, res) => {
  const { name, type } = req.body;
  try {
    const crop = await updateCrop(req.params.id, name, type);
    res.json(crop);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a crop
router.delete("/:id", async (req, res) => {
  try {
    await deleteCrop(req.params.id);
    res.json({ message: "Crop deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
