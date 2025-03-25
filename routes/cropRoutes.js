import express from "express";
import {
  getCrops,
  getCropById,
  createCrop,
  updateCrop,
  deleteCrop,
} from "../models/cropModel.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const crops = await getCrops();
    res.json(crops);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const crop = await getCropById(req.params.id);
    if (!crop) return res.status(404).json({ message: "Crop not found" });
    res.json(crop);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  const { clientId, name, type } = req.body;
  try {
    const crop = await createCrop(clientId, name, type);
    res.status(201).json(crop);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", async (req, res) => {
  const { name, type } = req.body;
  try {
    const crop = await updateCrop(req.params.id, name, type);
    res.json(crop);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await deleteCrop(req.params.id);
    res.json({ message: "Crop deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
