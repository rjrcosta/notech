import React, { useState } from "react";
import * as exifr from 'exifr';
import {
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Button,
    IconButton,
    Select,
    Option,
    Typography,
} from "@material-tailwind/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

export default function UploadPhotoDialog({ fieldId }) {
    const [open, setOpen] = useState(false);
    const [selectedPrompt, setSelectedPrompt] = useState("");
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [locationDenied, setLocationDenied] = useState(false); // Track if geolocation was denied

    const handleDialogToggle = () => {
        setOpen(!open);
        if (!open) {
            setSelectedFiles([]);
            setSelectedPrompt("");
        }
    };

    const handlePhotoSelection = async (event) => {
        const files = Array.from(event.target.files);

        const getDeviceLocation = () => {
            return new Promise((resolve, reject) => {
                if (!navigator.geolocation) return reject("Geolocation not supported");
                navigator.geolocation.getCurrentPosition(
                    (pos) => resolve({
                        latitude: pos.coords.latitude,
                        longitude: pos.coords.longitude,
                    }),
                    (err) => reject(err)
                );
            });
        };

        const newImages = await Promise.all(
            files.map(async (file) => {
                let latitude = null;
                let longitude = null;

                try {
                    const gps = await exifr.gps(file);
                    if (gps && gps.latitude && gps.longitude) {
                        // Check if the latitude and longitude are within a valid range
                        if (
                            gps.latitude >= -90 && gps.latitude <= 90 &&
                            gps.longitude >= -180 && gps.longitude <= 180
                        ) {
                            latitude = gps.latitude;
                            longitude = gps.longitude;
                        } else {
                            console.warn(`Invalid EXIF data for ${file.name}, using fallback.`);
                            const fallback = await getDeviceLocation();
                            latitude = fallback.latitude;
                            longitude = fallback.longitude;
                        }
                    } else {
                        const fallback = await getDeviceLocation();
                        latitude = fallback.latitude;
                        longitude = fallback.longitude;
                    }
                } catch (err) {
                    console.warn("Failed to extract EXIF, using fallback:", err);
                    try {
                        const fallback = await getDeviceLocation();
                        latitude = fallback.latitude;
                        longitude = fallback.longitude;
                    } catch (geoErr) {
                        console.warn("Geolocation denied or unavailable", geoErr);
                        setLocationDenied(true); // Set locationDenied state to true if geolocation fails
                    }
                }

                return {
                    file,
                    preview: URL.createObjectURL(file),
                    latitude,
                    longitude,
                };
            })
        );

        setSelectedFiles((prev) => [...prev, ...newImages]);
    };

    const handleProcess = () => {
        if (!selectedPrompt || selectedFiles.length === 0) {
            alert("Please select a prompt and at least one image.");
            return;
        }

        const formData = new FormData();
        selectedFiles.forEach((fileData, index) => {
            formData.append("images", fileData.file);  // Append the actual file, not the metadata object
            formData.append(`data[${index}][latitude]`, fileData.latitude || "");  // Use latitude from EXIF or fallback
            formData.append(`data[${index}][longitude]`, fileData.longitude || ""); // Use longitude from EXIF or fallback
            formData.append(`data[${index}][field_id]`, fieldId);
            formData.append(`data[${index}][prompt]`, selectedPrompt);
        });

        // Send the data to the backend
        fetch("http://localhost:5000/photos/upload", {
            method: "POST",
            body: formData,
        })
            .then((response) => response.json())
            .then((result) => {
                console.log("Uploaded:", result);
                alert("Photos uploaded successfully!");
                handleDialogToggle(); // Close dialog after success
            })
            .catch((err) => {
                console.error(err);
                alert("Upload failed");
            });
    };

    return (
        <>
            <input
                type="file"
                multiple
                accept="image/*"
                id="photo-upload"
                className="hidden"
                onChange={handlePhotoSelection}
            />

            <Button onClick={handleDialogToggle} variant="outlined" className="mx-2">
                Upload Photos
            </Button>

            <Dialog size="sm" open={open} handler={handleDialogToggle}>
                <form onSubmit={(e) => e.preventDefault()}>
                    <DialogHeader className="relative">
                        <Typography variant="h4" color="blue-gray">
                            Add Prompt and Photos
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
                            Prompt
                        </Typography>
                        <Select
                            value={selectedPrompt}
                            onChange={(val) => setSelectedPrompt(val)}
                            label="Select a prompt"
                        >
                            <Option value="Kiwi">Kiwi</Option>
                            <Option value="Flower">Flower</Option>
                            <Option value="Fruitlet">Fruitlet</Option>
                            <Option value="Flower Buds">Flower Buds</Option>
                        </Select>

                        <Typography variant="h6" color="blue-gray" className="mt-4 mb-2">
                            Add Images
                        </Typography>
                        <Button onClick={() => document.getElementById("photo-upload").click()} className="mx-2">
                            Choose Images
                        </Button>

                        {selectedFiles.length > 0 && (
                            <ul className="mt-2 list-disc list-inside text-sm text-green-800">
                                {selectedFiles.map((fileData, index) => (
                                    <li key={index}>
                                        {fileData.file.name}
                                        {fileData.latitude && fileData.longitude ? (
                                            <span className="ml-2 text-xs text-blue-600">Location: {fileData.latitude.toFixed(5)}, {fileData.longitude.toFixed(5)}</span>
                                        ) : (
                                            <span className="ml-2 text-xs text-red-600">Location Unavailable</span>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        )}

                        {locationDenied && (
                            <Typography variant="small" color="red" className="mt-2">
                                Geolocation permission was denied, so some images may lack location data.
                            </Typography>
                        )}
                    </DialogBody>

                    <DialogFooter>
                        <Button onClick={handleProcess} className="mx-2">
                            Process
                        </Button>
                    </DialogFooter>
                </form>
            </Dialog>
        </>
    );
}
