import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  FeatureGroup,
  GeoJSON,
  CircleMarker,
  useMap,
  Popup,
} from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  IconButton,
  Select,
  Option,
  Switch,
} from "@material-tailwind/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { StatisticsCard } from "@/widgets/cards";

import UploadPhotoDialog from "@/widgets/components/UploadPhotoDialog";
import CameraCapture from "@/widgets/components/CameraCapture"
import HeatmapSwitcher from "@/widgets/components/HeatmapSwitcher";
import HeatmapLayer from "@/widgets/components/heatmap";
import { StatisticsChart } from "@/widgets/charts";
import {
  statisticsCardsData,
  statisticsChartsData,
  projectsTableData,
  ordersOverviewData,
} from "@/data";
import { CheckCircleIcon, ClockIcon } from "@heroicons/react/24/solid";
import { normalizeMultipleHeatmapData } from "@/widgets/components/normalizeHeatmapData";
import { sensorTypeData } from "@/data/sensor-type-data.js";

import Camera from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';

import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";

export function FieldDetails() {
  const location = useLocation();
  const fieldId = location.state?.fieldId;
  const fieldArea = location.state?.fieldArea;

  // State
  // const [sensorData, setSensorData] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openCamera, setCameraDialog] = useState(false);
  const [openDialogUpload, setopenDialogUpload] = useState(false);
  const [infostations, setInfostations] = useState([]);
  const [lastSensorData, setLastSensorData] = useState([]);

  //Photos
  const [photoFile, setPhotoFile] = useState(null);
  const [photoLatLng, setPhotoLatLng] = useState(null);
  const [photoModalOpen, setPhotoModalOpen] = useState(false);

  const [sensorFormData, setSensorFormData] = useState({
    quantity: "",
    fieldId,
    polygon: fieldArea,
  });

  const [activeHeatmap, setActiveHeatmap] = useState("temperature");

  const [temperatureData, setTemperatureData] = useState([]);
  const [humidityData, setHumidityData] = useState([]);
  const [soilHumidity, setSoilHumidity] = useState([]);
  const [soilTemperature, setSoilTemperature] = useState([]);
  const [averageFruitSize, setAverageFruitSize] = useState([]);
  const [signalStrengthData, setSignalStrengthData] = useState([]);

  // Handlers
  const handleDialogToggle = () => setOpenDialog(!openDialog);
  const handleCameraDialog = () => setCameraDialog(!openCamera);

  const handleSelectChange = (value) => {
    setSensorFormData((prev) => ({ ...prev, quantity: parseInt(value) }));
  };

  const handlePolygonCreated = (e) => {
    const geojson = e.layer.toGeoJSON();
    setSensorFormData((prev) => ({ ...prev, polygon: geojson }));
  };

  const handleSubmitInfoStations = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        fieldId: sensorFormData.fieldId,
        fieldArea: sensorFormData.polygon,
        quantity: sensorFormData.quantity,
      };
      const response = await fetch(`http://localhost:5000/infostations/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ payload }),
      });

      if (!response.ok) throw new Error("Server error");

      await response.json();
      console.log("Info stations added!");
      handleDialogToggle();
    } catch (err) {
      console.error(err);
      alert("Error saving info stations");
    }
  };

  // Fetching Data
  useEffect(() => {
    const fetchStations = async () => {
      const res = await fetch(`http://localhost:5000/infostations/${fieldId}`);
      const data = await res.json();
      setInfostations(data);
    };

    // const fetchSensorData = async () => {
    //   const res = await fetch(`http://localhost:5000/infostations/data/${fieldId}`);
    //   const data = await res.json();
    //   setSensorData(data);
    // };

    fetchStations();
    // fetchSensorData();
  }, [fieldId]);

  useEffect(() => {
    const fetchLastSensorData = async () => {
      const res = await fetch(`http://localhost:5000/infostations/data/lastreading/${fieldId}`);
      const data = await res.json();
      setLastSensorData(data);

      setTemperatureData(data.map((s) => [s.latitude, s.longitude, s.air_temperature]));
      setHumidityData(data.map((s) => [s.latitude, s.longitude, s.air_humidity]));
      setSoilHumidity(data.map((s) => [s.latitude, s.longitude, s.soil_moisture]));
      setSoilTemperature(data.map((s) => [s.latitude, s.longitude, s.soil_temperature]));
      setAverageFruitSize(data.map((s) => [s.latitude, s.longitude, s.size_average]));
      setSignalStrengthData(data.map((s) => [s.latitude, s.longitude, s.signal_strength]));
    };

    fetchLastSensorData();
    const interval = setInterval(fetchLastSensorData, 60000);
    return () => clearInterval(interval);
  }, [fieldId]);

  // Normalize Heatmap Data
  const normalized = normalizeMultipleHeatmapData({
    temperatureData,
    humidityData,
    soilHumidity,
    soilTemperature,
    averageFruitSize,
    signalStrengthData,
  });

  console.log('normalized', normalized)

  const normalizedTemperatureData = normalized.temperatureData;
  const normalizedHumidityData = normalized.humidityData;
  const normalizedSoilMoistureData = normalized.soilMoistureData;
  const normalizedSoilTemperatureData = normalized.soilTemperatureData;
  const normalizedSizeAverageData = normalized.sizeAverageData;
  const normalizedSignalStrengthData = normalized.signalStrengthData;

  console.log('normalize temperature', normalized.temperatureData)

  // Helpers
  const FitBounds = ({ geojson }) => {
    const map = useMap();
    useEffect(() => {
      if (!geojson) return;
      const layer = L.geoJSON(geojson);
      map.fitBounds(layer.getBounds());
    }, [geojson, map]);
    return null;
  };

  const heatmapTypes = [
    { key: "temperature", label: "Temperature" },
    { key: "humidity", label: "Humidity" },
    { key: "soilMoisture", label: "Soil Moisture" },
    { key: "soilTemperature", label: "Soil Temperature" },
    { key: "sizeAverage", label: "Size Average" },
    { key: "signalStrength", label: "Signal Strength" },
    { key: "photosData", label: "Photos Data" }
  ];

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader variant="gradient" color="white" className="mb-8 flex items-center justify-between p-6">
          <div>
            <Typography variant="h6" color="blue-gray">
              Field Detail
            </Typography>
            <Typography variant="small" className="font-normal text-blue-gray-500">
              Detail information about this field
            </Typography>
          </div>
          <div >
            {/* Upload Photos Button and Modal */}
            <UploadPhotoDialog fieldId={fieldId} />

            <Button variant="outlined" className="mx-2" onClick={handleCameraDialog}>
              Take Photos
            </Button>
            <Dialog size="sm" open={openCamera} handler={handleCameraDialog}>
              <CameraCapture fieldId={fieldId} />
            </Dialog>
            <Button onClick={handleDialogToggle} variant="gradient" className="mx-2">
              Add Sensor Stations
            </Button>
          </div>
        </CardHeader>

        <CardBody>
          <div className="mb-6 grid grid-cols-1 gap-y-12 gap-x-6 md:grid-cols-1 xl:grid-cols-2">
            <MapContainer center={[41.355001, -8.627920]} zoom={13} scrollWheelZoom className="md:h-[500px]">
              <TileLayer
                attribution='&copy; StadiaMaps contributors'
                url="https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}{r}.jpg"
              />

              {fieldArea && (
                <>
                  <GeoJSON data={fieldArea} style={{ color: "blue", weight: 2 }} />
                  <FitBounds geojson={fieldArea} />
                </>
              )}

              <FeatureGroup>
                <EditControl
                  position="topright"
                  onCreated={handlePolygonCreated}
                  draw={{
                    rectangle: false,
                    polyline: false,
                    polygon: false,
                    circle: false,
                    marker: false,
                    circlemarker: false,
                  }}
                />
              </FeatureGroup>

              <HeatmapSwitcher
                heatmapTypes={heatmapTypes}
                activeHeatmap={activeHeatmap}
                setActiveHeatmap={setActiveHeatmap}
              />

              {infostations.map((station) => {
                const sensor = lastSensorData.find((s) => s.station_id === station.id);
                return (
                  <CircleMarker
                    key={station.id}
                    center={[station.latitude, station.longitude]}
                    radius={5}
                    color="#2563eb"
                    fillOpacity={0.9}
                  >
                    <Popup>
                      <strong>{station.name}</strong><br />
                      {sensor ? (
                        <>
                          Temp: {sensor.air_temperature}°C<br />
                          Humidity: {sensor.air_humidity}%<br />
                          Soil Temp: {sensor.soil_temperature}°C<br />
                          Soil Moisture: {sensor.soil_moisture}%<br />
                          Size Average: {sensor.size_average}<br />
                          Battery: {sensor.battery_voltage}V<br />
                          Signal: {sensor.signal_strength} dBm<br />
                          Lat: {station.latitude}<br />
                          Lng: {station.longitude}
                        </>
                      ) : (
                        <p>No sensor data available.</p>
                      )}
                    </Popup>
                  </CircleMarker>
                );
              })}

              {activeHeatmap === "temperature" && <HeatmapLayer points={normalizedTemperatureData} />}
              {activeHeatmap === "humidity" && <HeatmapLayer points={normalizedHumidityData} />}
              {activeHeatmap === "soilMoisture" && <HeatmapLayer points={normalizedSoilMoistureData} />}
              {activeHeatmap === "soilTemperature" && <HeatmapLayer points={normalizedSoilTemperatureData} />}
              {activeHeatmap === "sizeAverage" && <HeatmapLayer points={normalizedSizeAverageData} />}
              {activeHeatmap === "signalStrength" && <HeatmapLayer points={normalizedSignalStrengthData} />}
              {activeHeatmap === "photosData" && <HeatmapLayer points={normalizedSignalStrengthData} />}
            </MapContainer>

            <div className=" grid gap-y-10 gap-x-6 md:grid-cols-1 xl:grid-cols-2">
              {statisticsCardsData.map(({ icon, title, footer, ...rest }) => (
                <StatisticsCard
                  key={title}
                  {...rest}
                  title={title}
                  icon={React.createElement(icon, {
                    className: "w-6 h-6 text-white",
                  })}
                  footer={
                    <Typography className="font-normal text-blue-gray-600">
                      <strong className={footer.color}>{footer.value}</strong>
                      &nbsp;{footer.label}
                    </Typography>
                  }
                />
              ))}
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Add Sensor Dialog */}
      <Dialog size="sm" open={openDialog} handler={handleDialogToggle}>
        <form onSubmit={handleSubmitInfoStations}>
          <DialogHeader className="relative">
            <Typography variant="h4" color="blue-gray">
              Add Sensor Stations
            </Typography>
            <IconButton
              size="sm"
              variant="text"
              className="!absolute right-3.5 top-3.5"
              onClick={handleDialogToggle}
            >
              <XMarkIcon className="h-4 w-4 stroke-2" />
            </IconButton>
          </DialogHeader>

          <DialogBody className="space-y-4 pb-6">
            <Typography variant="small" color="blue-gray" className="text-left font-medium">
              Quantity
            </Typography>
            <Select value={sensorFormData.quantity} onChange={handleSelectChange}>
              {[...Array(10)].map((_, index) => (
                <Option key={index + 1} value={(index + 1).toString()}>
                  {index + 1}
                </Option>
              ))}
            </Select>

            <Typography variant="h6" color="blue-gray" className="mt-4 mb-2">
              Sensor options
            </Typography>
            {sensorTypeData.map(({ title, options }) => (
              <div key={title}>
                <Typography className="mb-4 text-xs font-semibold uppercase text-blue-gray-500">
                  {title}
                </Typography>
                {options.map(({ label, checked }) => (
                  <Switch key={label} id={label} label={label} defaultChecked={checked} />
                ))}
              </div>
            ))}
          </DialogBody>

          <DialogFooter>
            <Button type="submit" variant="gradient">
              Add InfoStations
            </Button>
          </DialogFooter>
        </form>
      </Dialog>
      {statisticsChartsData.map((props) => (
        <StatisticsChart
          key={props.title}
          {...props}
          footer={
            <Typography
              variant="small"
              className="flex items-center font-normal text-blue-gray-600"
            >
              <ClockIcon strokeWidth={2} className="h-4 w-4 text-blue-gray-400" />
              &nbsp;{props.footer}
            </Typography>
          }
        />
      ))}


    </div>
  );
}
