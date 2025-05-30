import express from "express";
import {
  getInfoStations,
  getInfoStationById,
  getInfostationsByFieldId,
  getLastReadingInfostationsByFieldId,
  createInfoStation,
  updateInfoStation,
  deleteInfoStation,
  getInfostationDataByField,
  wifiInfoStations,
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

//Get Info station by fieldId
router.get("/:fieldId", async (req, res) => {
  try {
    const infostationsByFieldId = await getInfostationsByFieldId(req.params.fieldId)
    if (!infostationsByFieldId) return res.status(404).json({ message: "Info station by FieldID not found" });
    res.json(infostationsByFieldId);
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
router.post("/create", async (req, res) => {
  try {
    console.log('create infostation route',req.body)
    const infoStations = await createInfoStation(req.body);
    res.status(201).json(infoStations);
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

//Get InforStations Data
router.get("/data/:fieldId", async (req, res)=>{
  try{
    console.log('got to data routes', req.params)
    const infostationData = await getInfostationDataByField(req.params.fieldId)
    res.json(infostationData)
  }catch (err){
    res.status(500).json({ error: err.message });
  }
})

//Get latest reading on infostation by Id
router.get("/data/lastreading/:fieldId", async (req, res) => {
  try {
    console.log('last data ', req.params.fieldId)
    const lastReadinInfostationsByFieldId = await getLastReadingInfostationsByFieldId(req.params.fieldId)
    console.log('got the last data from model', lastReadinInfostationsByFieldId)
    if (!lastReadinInfostationsByFieldId) return res.status(404).json({ message: "Last reading Info station by FieldID not found" });
    res.json(lastReadinInfostationsByFieldId);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }

});


// Get wifi info stations
router.post("/stations-wifi", async (req, res) => {
  try {
    const networks = await wifiInfoStations();
    res.json(networks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
