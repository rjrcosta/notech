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
  Input,
  Select,
  Textarea,
  Option,
  Button,
} from "@material-tailwind/react";
import { Link } from "react-router-dom";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { TileLayer, MapContainer, FeatureGroup } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import html2canvas from "html2canvas"; // ✅
import { useEffect, useState, useRef } from "react";


export function Fields() {

  const [fields, setFields] = useState([]);
  const [crops, setCrops] = useState([]); // State to store crops data
  const drawnGeoJsonRef = useRef(null); // Ref to store the drawn GeoJSON
  const mapRef = useRef(); // Ref to store the map instance
  const [polygonGeoJSON, setPolygonGeoJSON] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
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
        body: JSON.stringify({payload}),
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
    async function fetchFields() {
      try {
        const res = await fetch(`http://localhost:5000/fields/allfields`, {
          method: 'GET',
          credentials: 'include', // Include cookies with the request
        }); // Adjust if needed
        const fields = await res.json();
        setFields(fields);
        const formatted = fields.map(field => ({
          id: field.id,
          name: field.name,
          image_path: field.image_polygon_url,
          area: field.area,
          description: field.description,
          crop_id: field.crop_id,
          type: field.type,
        }));
        setFields(formatted);
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
    fetchFields();
  }, []);

  //Create new field button
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(!open);

  console.log("Fields data:", formData); // Log the fields data to check if it's being fetched correctly
  console.log("Crops data1:", crops); // Log the crops data to check if it's being fetched correctly
  console.log("All Fields:", fields); // Log the fields data to check if it's being fetched correctly

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">

      <Card>
        <CardHeader variant="gradient" color="white" className="mb-8 flex items-center justify-between p-6">
          <div>
            <Typography variant="h6" color="blue-gray" className="mb-2">
              Fields
            </Typography>
            <Typography
              variant="small"
              className="font-normal text-blue-gray-500"
            >
              Types of fields available in the system
            </Typography>
          </div>

          <Button onClick={handleOpen} variant="gradient">
            Add Field
          </Button>
          <Dialog size="sm" open={open} handler={handleOpen} className="p-4 overflow-auto max-h-screen">
            <form onSubmit={handleSubmit}>
              <DialogHeader className="relative m-0 block">
                <Typography variant="h4" color="blue-gray">
                  Create New Field
                </Typography>
                <Typography className="mt-1 font-normal text-gray-600">
                  Add information as accurate as possible to create a new field.
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
                    Name
                  </Typography>
                  <Input
                    required
                    color="gray"
                    size="lg"
                    placeholder="eg. White Shoes"
                    name="name"
                    className="placeholder:opacity-100 focus:!border-t-gray-900"
                    containerProps={{
                      className: "!min-w-full",
                    }}
                    labelProps={{
                      className: "hidden",
                    }}
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="mb-2 text-left font-medium"
                  >
                    Crop
                  </Typography>
                  <Select
                    className="!w-full !border-[1.5px] !border-blue-gray-200/90 !border-t-blue-gray-200/90 bg-white text-gray-800 ring-4 ring-transparent placeholder:text-gray-600 focus:!border-primary focus:!border-t-blue-gray-900 group-hover:!border-primary"
                    placeholder="1"
                    menuProps={{ className: "z-[9999]" }}
                    required
                    name="crop_id"
                    labelProps={{
                      className: "hidden",
                    }}
                    value={formData.crop_id}
                    onChange={handleSelectChange}
                  >
                   
                    <Option value="">-- Choose a crop --</Option>
                    {crops.map(crop => (
                      <Option key={crop.id} value={crop.id}>
                        {crop.name}
                      </Option>
                    ))}
                  </Select>
                </div>

                <div ref={mapRef} id="map-container">
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
                      // value={formData.area}
                      // onChange={(e) => setFormData(e.target.value)}
                      />
                    </FeatureGroup>

                    <TileLayer
                      attribution='&copy; <a href="https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}{r}.{ext}">StadiaMaps</a> contributors'
                      url="https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}{r}.jpg"
                      crossOrigin="anonymous"
                    />
                  </MapContainer>
                </div>

                <div>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="mb-2 text-left font-medium"
                  >
                    Description (Optional)
                  </Typography>
                  <Textarea
                    name="description"
                    rows={7}
                    placeholder="eg. This is a white shoes with a comfortable sole."
                    className="!w-full !border-[1.5px] !border-blue-gray-200/90 !border-t-blue-gray-200/90 bg-white text-gray-600 ring-4 ring-transparent focus:!border-primary focus:!border-t-blue-gray-900 group-hover:!border-primary"
                    labelProps={{
                      className: "hidden",
                    }}
                    value={formData.description}
                    onChange={handleInputChange}
                  />
                </div>
              </DialogBody>
              <DialogFooter>
                <Button type="submit" className="ml-auto" onClick={handleOpen}>
                  Add field
                </Button>
              </DialogFooter>
            </form>
          </Dialog>

        </CardHeader>
        <CardBody className="max-h-screen overflow-auto">
          <div className="px-4 pb-4">

            <div className="mt-6 grid grid-cols-1 gap-12 md:grid-cols-2 xl:grid-cols-4">
              {fields.map(
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

export default Fields;
