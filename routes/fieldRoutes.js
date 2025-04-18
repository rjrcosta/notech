import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import {
  getFields,
  getFieldById,
  createField,
  updateField,
  deleteField,
} from "../models/fieldModel.js";

dotenv.config(); // Load environment variables
const router = express.Router();

// Get all fields
router.get("/allfields", async (req, res) => {
  try {
    console.log("In fieldRoutes getFields route. Request URL:"); // Log the request URL
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
router.post("/create", async (req, res) => {
  console.log("In fieldRoutes createField route");
  console.log("Incoming request body:", req.body); // Log the incoming request body
  try {
    const decoded = jwt.verify(req.session.token, process.env.JWT_SECRET);
    const userTenant_id = decoded.payload.tenant_id; // Extract the user role from the decoded token
    const userId = decoded.payload.id; // Extract the user ID from the decoded token
    console.log('Decoded token in session route:', userId, userTenant_id); // Log the decoded token information

    const fullPayload = {
      ...req.body,
      userId,
      userTenant_id,
    };
    console.log("Full payload to be sent to createField:", fullPayload); // Log the full payload

    const newfield = await createField(fullPayload);
    res.status(201).json(newfield);
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
