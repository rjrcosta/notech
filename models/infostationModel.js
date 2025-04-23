import pool from "../db.js";
import wifi from "node-wifi";
import dotenv from "dotenv";
import * as turf from "@turf/turf";
import clustersKmeans from '@turf/clusters-kmeans';


dotenv.config(); // Load environment variables

// Get all info stations
export const getInfoStations = async () => {
  const { rows } = await pool.query("SELECT * FROM infostations");
  return rows;
};

//Get infostations by fieldId
export const getInfostationsByFieldId = async (fieldId) => {
  const { rows } = await pool.query("SELECT * FROM infostations WHERE field_id = $1", [fieldId]);
  return rows 
};

// Get info station by ID
export const getInfoStationById = async (id) => {
  const { rows } = await pool.query("SELECT * FROM infostations WHERE id = $1", [id]);
  return rows[0];
};

// Create a new info station
export const createInfoStation = async (formReqBody) => {
  // 1) Prepare Variables
  const polygon = formReqBody.payload.fieldArea;
  const quantity = formReqBody.payload.quantity;
  const fieldId = formReqBody.payload.fieldId;
  console.log('polygon',polygon)
  console.log('quantity', quantity)
  console.log('fieldid', fieldId)

  // 2) Generate a bunch of random points over the bbox
  const bbox = turf.bbox(polygon);
  console.log('bbox', bbox)
  // adjust the sample size to get good coverage — e.g. 500 points
  const sampleSize = Math.max(5000, quantity * 500);
  console.log('samplesize', sampleSize)
  const randomFc = turf.randomPoint(sampleSize, { bbox });
  // console.log('randomFc', randomFc)
  console.log("Polygon preview:", JSON.stringify(polygon, null, 2));
  

  // 3) Keep only the ones inside
  const polygonFeature = polygon.type === "FeatureCollection" ? polygon.features[0] : polygon;
  const inside = randomFc.features.filter(pt =>
    turf.booleanPointInPolygon(pt, polygonFeature)
  );
  console.log('inside:', inside)

  // 4) Cluster them into `quantity` groups
  const clustered = clustersKmeans(
    turf.featureCollection(inside),
    { numberOfClusters: quantity }
  );
  console.log('clustered', clustered)
  
  // 5) For each cluster, compute its centroid
  const centroids = [];
  for (let i = 0; i < quantity; i++) {
    const members = clustered.features.filter(f => f.properties.cluster === i);
    if (members.length === 0) continue;
    const center = turf.centroid(turf.featureCollection(members));
    centroids.push(center);
  }
  console.log('centroids', centroids)

  // 6) Insert each centroid as an infostation
  const inserted = [];
  for (let i = 0; i < centroids.length; i++) {
    const [lng, lat] = centroids[i].geometry.coordinates;
    const name = `Station ${i + 1}`;
    const { rows } = await pool.query(
      `INSERT INTO infostations
         (field_id, name, latitude, longitude)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [fieldId, name, lat, lng]
    );
    inserted.push(rows[0]);
  }
  console.log('inserted', inserted)
  return inserted;
};



// Update an info station
export const updateInfoStation = async (id, name, latitude, longitude) => {
  const { rows } = await pool.query(
    "UPDATE infostations SET name = $1, latitude = $2, longitude = $3 WHERE id = $4 RETURNING *",
    [name, latitude, longitude, id]
  );
  return rows[0];
};

// Delete an info station
export const deleteInfoStation = async (id) => {
  await pool.query("DELETE FROM infostations WHERE id = $1", [id]);
  return { message: "Info station deleted" };
};


// Get wifi info stations
// This function scans for available WiFi networks and returns the list of networks found.
export const wifiInfoStations = async () => {
  // Init wifi module
  wifi.init({
    iface: null, // use default interface
  });

  try {
    const networks = await wifi.getCurrentConnections(); // ✅ Await the scan result directly
    console.log(networks); // Optional: log the result

    // List the current wifi connections
    // Scan networks
    wifi.scan((error, networks) => {
      if (error) {
        console.log(error);
      } else {
        console.log(networks);
        /*
            networks = [
                {
                  ssid: '...',
                  bssid: '...',
                  mac: '...', // equals to bssid (for retrocompatibility)
                  channel: <number>,
                  frequency: <number>, // in MHz
                  signal_level: <number>, // in dB
                  quality: <number>, // same as signal level but in %
                  security: 'WPA WPA2' // format depending on locale for open networks in Windows
                  security_flags: '...' // encryption protocols (format currently depending of the OS)
                  mode: '...' // network mode like Infra (format currently depending of the OS)
                },
                ...
            ];
            */
      }
    });
    return networks; // Return the list of networks found

  } catch (error) {
    console.error("WiFi scan failed:", error);
    throw error; // Let the calling function handle the error
  }
};


// // Connect to a network
// wifi.connect({ ssid: 'ssid', password: 'password' }, () => {
//   console.log('Connected'); 
//   // on windows, the callback is called even if the connection failed due to netsh limitations
//   // if your software may work on windows, you should use `wifi.getCurrentConnections` to check if the connection succeeded
// });

// // Disconnect from a network
// // not available on all os for now
// wifi.disconnect(error => {
//   if (error) {
//     console.log(error);
//   } else {
//     console.log('Disconnected');
//   }
// });

// // Delete a saved network
// // not available on all os for now
// wifi.deleteConnection({ ssid: 'ssid' }, error => {
//   if (error) {
//     console.log(error);
//   } else {
//     console.log('Deleted');
//   }
// });

// // List the current wifi connections
// wifi.getCurrentConnections((error, currentConnections) => {
//   if (error) {
//     console.log(error);
//   } else {
//     console.log(currentConnections);
//     /*
//     // you may have several connections
//     [
//         {
//             iface: '...', // network interface used for the connection, not available on macOS
//             ssid: '...',
//             bssid: '...',
//             mac: '...', // equals to bssid (for retrocompatibility)
//             channel: <number>,
//             frequency: <number>, // in MHz
//             signal_level: <number>, // in dB
//             quality: <number>, // same as signal level but in %
//             security: '...' //
//             security_flags: '...' // encryption protocols (format currently depending of the OS)
//             mode: '...' // network mode like Infra (format currently depending of the OS)
//         }
//     ]
//     */
//   }
// });

// // All functions also return promise if there is no callback given
// wifi
//   .scan()
//   .then(networks => {
//     // networks
//   })
//   .catch(error => {
//     // error
//   });
