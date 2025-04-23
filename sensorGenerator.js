import dotenv from "dotenv";
import pg from "pg"; //Postgres client

dotenv.config(); // Load environment variables

const db = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
  });
  

const generateRandom = (min, max) => +(Math.random() * (max - min) + min).toFixed(2);

const generateSensorReading = async () => {
  try {
    

    const stationId = Math.floor(Math.random() * 10) + 1; // Assuming 10 stations with IDs 1–10
    
    const airTemperature = generateRandom(-5, 45);
    const airHumidity = generateRandom(20, 100);
    const soilTemperature = generateRandom(-5, 40);
    const soilMoisture = generateRandom(5, 50);
    const sizeAverage = generateRandom(1, 10);
    const latitude = generateRandom(41.2, 41.3);   // Adjust bounds to your real polygon
    const longitude = generateRandom(-8.7, -8.6);
    const batteryVoltage = generateRandom(3.3, 4.2);
    const signalStrength = generateRandom(-100, -30);

    const query = `
      INSERT INTO sensor_readings (
        station_id, air_temperature, air_humidity,
        soil_temperature, soil_moisture, size_average,
        latitude, longitude, battery_voltage, signal_strength
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
    `;

    await db.query(query, [
      stationId,
      airTemperature,
      airHumidity,
      soilTemperature,
      soilMoisture,
      sizeAverage,
      latitude,
      longitude,
      batteryVoltage,
      signalStrength,
    ]);

    console.log(`Inserted reading for station ${stationId}`);
  } catch (err) {
    console.error('Error inserting data:', err);
  }
};

(async () => {
  await db.connect();
  console.log('Connected to DB. Starting sensor reading generator...');

  // Every minute (60000 ms)
  setInterval(generateSensorReading, 60_000);
})();