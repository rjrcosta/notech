import express from "express";
import {
  getFields,
  getFieldById,
  createField,
  updateField,
  deleteField,
} from "../models/fieldModel.js";

const router = express.Router();

// Get all fields
router.get("/", async (req, res) => {
  try {
    const fields = await getFields();
    res.json(fields);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get field by ID
router.get("/:id", async (req, res) => {
  try {
    const field = await getFieldById(req.params.id);
    if (!field) return res.status(404).json({ message: "Field not found" });
    res.json(field);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new field
router.post("/", async (req, res) => {
  const { cropId, name, area } = req.body;
  try {
    const field = await createField(cropId, name, area);
    res.status(201).json(field);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a field
router.put("/:id", async (req, res) => {
  const { name, area } = req.body;
  try {
    const field = await updateField(req.params.id, name, area);
    res.json(field);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a field
router.delete("/:id", async (req, res) => {
  try {
    await deleteField(req.params.id);
    res.json({ message: "Field deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
