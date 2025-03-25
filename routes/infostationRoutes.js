import express from "express";
import {
  getInfoStations,
  getInfoStationById,
  createInfoStation,
  updateInfoStation,
  deleteInfoStation,
} from "../models/infostationModel.js";

const router = express.Router();

// Get all info stations
router.get("/", async (req, res) => {
  try {
    const infoStations = await getInfoStations();
    res.json(infoStations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get info station by ID
router.get("/:id", async (req, res) => {
  try {
    const infoStation = await getInfoStationById(req.params.id);
    if (!infoStation) return res.status(404).json({ message: "Info station not found" });
    res.json(infoStation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new info station
router.post("/", async (req, res) => {
  const { areaId, name, latitude, longitude } = req.body;
  try {
    const infoStation = await createInfoStation(areaId, name, latitude, longitude);
    res.status(201).json(infoStation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update an info station
router.put("/:id", async (req, res) => {
  const { name, latitude, longitude } = req.body;
  try {
    const infoStation = await updateInfoStation(req.params.id, name, latitude, longitude);
    res.json(infoStation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete an info station
router.delete("/:id", async (req, res) => {
  try {
    await deleteInfoStation(req.params.id);
    res.json({ message: "Info station deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
