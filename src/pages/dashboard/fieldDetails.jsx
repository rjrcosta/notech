import React from "react";
import {
  Card,
  CardHeader,
  CardFooter,
  CardBody,
  Typography,
  Dialog,
  DialogBody,
  DialogHeader,
  DialogFooter,
  IconButton,
  Switch,
  Select,
  Option,
  Button,
} from "@material-tailwind/react";
import {
  statisticsCardsData,
  statisticsChartsData,
  projectsTableData,
  ordersOverviewData,
} from "@/data";
import { CheckCircleIcon, ClockIcon } from "@heroicons/react/24/solid";
import { StatisticsCard } from "@/widgets/cards";
import { StatisticsChart } from "@/widgets/charts";
import { Link, useLocation } from "react-router-dom";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { TileLayer, MapContainer, FeatureGroup, GeoJSON, useMap } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import { useEffect, useState, useRef } from "react";
import {sensorTypeData} from "@/data/sensor-type-data.js";

export function FieldDetails() {
  const [sensors, setSensors] = useState([]); // State to store sensors data
  const location = useLocation();
  const fieldId = location.state?.fieldId; // Get the fieldId from the location state
  console.log("Field ID from location state:", fieldId); // Log the fieldId to check if it's being passed correctly

  const [field, setField] = useState([]);

  const [crops, setCrops] = useState([]); // State to store crops data
  // const drawnGeoJsonRef = useRef(null); // Ref to store the drawn GeoJSON
  const mapRef = useRef(); // Ref to store the map instance
  const [polygonGeoJSON, setPolygonGeoJSON] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    sensorCount: 0,
    crop_id: "",
    client_id: "",
    tenant_id: "",
    description: "",
    area: null,
  });

  // Handle the creation of a polygon
  const handlePolygonCreated = (e) => {
    const geojson = e.layer.toGeoJSON();
    setPolygonGeoJSON(geojson);
    setFormData((prev) => ({ ...prev, area: geojson })); // Update formData with the new polygon
    console.log("formData:", formData); // Log the created polygon
    console.log("Polygon created:", geojson); // Log the created polygon
  };
  // Handle input changes for the form fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  // Add this helper if using Select from Material Tailwind
  const handleSelectChange = (value) => {
    console.log("Selected crop_id:", value); // Log the selected crop_id
    setFormData((prev) => ({ ...prev, crop_id: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted!"); // Log to check if the function is called
    console.log("Form data:", formData); // Log the form data to check its structure
    if (!polygonGeoJSON) return alert("Please draw a polygon!");

    try {
      // Capture screenshot of map as base64 JPEG
      const canvas = await html2canvas(mapRef.current);
      const base64Image = canvas.toDataURL("image/jpeg"); // this is a base64 string

      const payload = {
        name: formData.name,

        crop_id: formData.crop_id,
        description: formData.description,
        area: JSON.stringify(polygonGeoJSON), // Convert GeoJSON to a string
        area_image: base64Image, // Placeholder for the image if needed
      };

      console.log("Payload to send:", payload); // Log the payload to check its structure

      // Send to backend using fetch
      const response = await fetch(`http://localhost:5000/fields/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ payload }),
      });

      // Read JSON once
      const data = await response.json();
      console.log("Data from api response in filds creation frontend:", data); // Log the response data

      if (!response.ok) throw new Error("Server error");

      console.log("Field saved successfully!");
    } catch (err) {
      console.error(err);
      alert("Error saving field");
    }
  };

  useEffect(() => {
    async function fetchField() {
      try {
        const res = await fetch(`http://localhost:5000/fields/${fieldId}`, {
          method: 'GET',
          credentials: 'include', // Include cookies with the request
        }); // Adjust if needed
        const field = await res.json();
        setField(field);
        const formatted = field.map(field => ({
          id: field.id,
          name: field.name,
          area: field.area,
          description: field.description,
          crop_id: field.crop_id,
        }));
        setField(formatted);
      } catch (err) {
        console.error("Failed to fetch fields", err);
      }
    }

    async function fetchCrops() {
      try {
        const res = await fetch(`http://localhost:5000/crops/allcrops`, {
          method: 'GET',
          credentials: 'include', // Include cookies with the request
        }); // Adjust if needed
        const crops = await res.json();
        console.log("Crops data:", crops); // Log the crops data to check if it's being fetched correctly

        const formatted = crops.map(crop => ({
          id: crop.id, // This is the crop_id you will save
          name: crop.name // This is the name you will display
        }));
        setCrops(formatted);
        console.log("Formatted crops:", formatted); // Log the formatted crops to check if it's being formatted correctly

      } catch (err) {
        console.error("Failed to fetch crops", err);
      }
    }

    fetchCrops();
    fetchField();
  }, []); // Add map to dependencies

  //define the geojson variable to be used in the FitBounds component
  const geojson = field?.area
  console.log("GeoJSON data:", geojson); // Log the GeoJSON data to check if it's being fetched correctly

  const FitBounds = ({ geojson }) => {
    const map = useMap();

    useEffect(() => {
      if (!geojson) return;
      const layer = L.geoJSON(geojson);
      map.fitBounds(layer.getBounds());
    }, [geojson, map]);

    return null;
  };

  //Create new field button
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(!open);

  console.log("Fields data:", formData); // Log the fields data to check if it's being fetched correctly
  console.log("Crops data1:", crops); // Log the crops data to check if it's being fetched correctly
  console.log("All Fields:", field); // Log the fields data to check if it's being fetched correctly

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">

      <Card>
        <CardHeader variant="gradient" color="white" className="mb-8 flex items-center justify-between p-6">
          <div>
            <Typography variant="h6" color="blue-gray" className="mb-2">
              Field Detail
            </Typography>
            <Typography
              variant="small"
              className="font-normal text-blue-gray-500"
            >
              Detail information about this field
            </Typography>
          </div>

          <Button onClick={handleOpen} variant="gradient">
            Add Sensor Stations
          </Button>
          <Dialog size="sm" open={open} handler={handleOpen} className="p-4 overflow-auto max-h-screen">
            <form onSubmit={handleSubmit}>
              <DialogHeader className="relative m-0 block">
                <Typography variant="h4" color="blue-gray">
                  Add Sensor Stations
                </Typography>
                <Typography className="mt-1 font-normal text-gray-600">
                  Select the number and type of info Stations.
                </Typography>
                <IconButton
                  size="sm"
                  variant="text"
                  className="!absolute right-3.5 top-3.5"
                  onClick={handleOpen}
                >
                  <XMarkIcon className="h-4 w-4 stroke-2" />
                </IconButton>
              </DialogHeader>
              <DialogBody className="space-y-4 pb-6 overflow-auto">

                <div>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="mb-2 text-left font-medium"
                  >
                    Quantity
                  </Typography>
                  <Select
                    name="sensorCount"
                    id="sensorCount"
                    value={formData.sensorCount}
                    onChange={handleSelectChange}
                    className="!border-[1.5px] !border-blue-gray-200/90 !border-t-blue-gray-200/90 bg-white text-gray-600 ring-4 ring-transparent focus:!border-primary focus:!border-t-blue-gray-900 group-hover:!border-primary">
                    {[...Array(10)].map((_, sensorCount) => (
                      <Option key={sensorCount + 1} value={sensorCount + 1}>
                        {sensorCount + 1}
                      </Option>
                    ))}
                  </Select>
                </div>

                <div>
                  <Typography variant="h6" color="blue-gray" className="mb-3">
                    Sensor options
                  </Typography>
                  <div className="flex flex-col gap-12">
                    {sensorTypeData.map(({ title, options }) => (
                      <div key={title}>
                        <Typography className="mb-4 block text-xs font-semibold uppercase text-blue-gray-500">
                          {title}
                        </Typography>
                        <div className="flex flex-col gap-6">
                          {options.map(({ checked, label }) => (
                            <Switch
                              key={label}
                              id={label}
                              label={label}
                              defaultChecked={checked}
                              labelProps={{
                                className: "text-sm font-normal text-blue-gray-500",
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* <div ref={mapRef} id="map-container">
                  <MapContainer center={[41.355001, -8.627920]} zoom={13} scrollWheelZoom={false}>
                    <FeatureGroup>
                      <EditControl
                        position='topright'
                        onCreated={handlePolygonCreated}
                        draw={{
                          rectangle: false,
                          polyline: false,
                          polygon: true,
                          circle: false,
                          marker: false,
                          circlemarker: false,
                        }}
                      
                      />
                    </FeatureGroup>

                    <TileLayer
                      attribution='&copy; <a href="https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}{r}.{ext}">StadiaMaps</a> contributors'
                      url="https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}{r}.jpg"
                      crossOrigin="anonymous"
                    />
                  </MapContainer>
                </div> */}


              </DialogBody>
              <DialogFooter>
                <Button type="submit" className="ml-auto" onClick={handleOpen}>
                  Add field
                </Button>
              </DialogFooter>
            </form>
          </Dialog>

        </CardHeader>

        <CardBody>
          <div className="mb-6 grid grid-cols-1 gap-y-12 gap-x-6 md:grid-cols-2 xl:grid-cols-2">
            <MapContainer center={[41.355001, -8.627920]} zoom={13} scrollWheelZoom={true}>
              <FeatureGroup>
                <EditControl
                  position='topright'
                  onCreated={handlePolygonCreated}
                  draw={{
                    rectangle: false,
                    polyline: false,
                    polygon: true,
                    circle: false,
                    marker: false,
                    circlemarker: false,
                  }}
                />
              </FeatureGroup>

              <TileLayer
                attribution='&copy; <a href="https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}{r}.{ext}">StadiaMaps</a> contributors'
                url="https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}{r}.jpg"
                crossOrigin="anonymous"
              />
              {field?.area && (
                <>
                  <GeoJSON data={field.area} style={{ color: "blue", weight: 2 }} />
                  {/* Auto-fit bounds */}
                  <FitBounds geojson={field.area} />
                </>
              )}
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

          <div className="mb-6 grid grid-cols-1 gap-y-12 gap-x-6 md:grid-cols-2 xl:grid-cols-3">
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

          <div className="px-4 pb-4">
            <div className="mt-6 grid grid-cols-1 gap-12 md:grid-cols-2 xl:grid-cols-4">
              {sensors.map(
                ({ id, image_path, area, name, description }) => (
                  <Card key={name} color="transparent" shadow={false}>
                    <CardHeader
                      floated={false}
                      color="gray"
                      className="mx-0 mt-0 mb-4 h-64 xl:h-40"
                    >
                      <img
                        src={image_path}
                        alt={name}
                        className="h-full w-full object-cover"
                      />
                    </CardHeader>
                    <CardBody className="py-0 px-1">
                      <Typography
                        variant="small"
                        className="font-normal text-blue-gray-500"
                      >
                        {name}
                      </Typography>
                      <Typography
                        variant="h5"
                        color="blue-gray"
                        className="mt-1 mb-2"
                      >
                        {name}
                      </Typography>
                      <Typography
                        variant="small"
                        className="font-normal text-blue-gray-500"
                      >
                        {description}
                      </Typography>
                    </CardBody>
                    <CardFooter className="mt-6 flex items-center justify-between py-0 px-1">
                      <Link to={`/dashboard/fields/${id}`}>
                        <Button variant="outlined" size="sm">
                          Details
                        </Button>
                      </Link>
                      {/* <div> */}
                      {/* {members.map(({ img, name }, key) => (
                                      <Tooltip key={name} content={name}>
                                        <Avatar
                                          src={img}
                                          alt={name}
                                          size="xs"
                                          variant="circular"
                                          className={`cursor-pointer border-2 border-white ${
                                            key === 0 ? "" : "-ml-2.5"
                                          }`}
                                        />
                                      </Tooltip>
                                    ))} */}
                      {/* </div> */}
                    </CardFooter>
                  </Card>
                )
              )}
            </div>
          </div>

        </CardBody>
      </Card>
    </div>
  );
}

export default FieldDetails
