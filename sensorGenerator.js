import dotenv from "dotenv";
import pg from "pg";

dotenv.config();

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

const generateRandom = (min, max) => +(Math.random() * (max - min) + min).toFixed(2);

// Replace with your actual field_id
const FIELD_ID = 24;

const generateReadingsForField = async () => {
  try {
    // 1. Get all infostation IDs for the field
    const res = await db.query(
      `SELECT id, latitude, longitude FROM infostations WHERE field_id = $1`,
      [FIELD_ID]
    );

    const stations = res.rows;

    for (const station of stations) {
      const airTemperature = generateRandom(-5, 45);
      const airHumidity = generateRandom(20, 100);
      const soilTemperature = generateRandom(-5, 40);
      const soilMoisture = generateRandom(5, 50);
      const sizeAverage = generateRandom(1, 10);
      const batteryVoltage = generateRandom(3.3, 4.2);
      const signalStrength = generateRandom(-100, -30);

      await db.query(
        `INSERT INTO sensor_readings (
          station_id, air_temperature, air_humidity,
          soil_temperature, soil_moisture, size_average,
          latitude, longitude, battery_voltage, signal_strength, field_id
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10, $11)`,
        [
          station.id,
          airTemperature,
          airHumidity,
          soilTemperature,
          soilMoisture,
          sizeAverage,
          station.latitude, // use actual infostation coords
          station.longitude,
          batteryVoltage,
          signalStrength,
          FIELD_ID,
        ]
      );

      console.log(`Inserted reading for station ${station.id}`);
    }
  } catch (err) {
    console.error("Error inserting sensor readings:", err);
  }
};

(async () => {
  await db.connect();
  console.log("Connected to DB. Starting sensor reading generator...");

  // Run every minute
  setInterval(generateReadingsForField, 60_000);
})();
