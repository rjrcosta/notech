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
  Label,
  Avatar,
  Chip,
  Tooltip,
  Progress,
  Tabs,
  TabsHeader,
  Tab,
  Button,
} from "@material-tailwind/react";
import {
  HomeIcon,
  ChatBubbleLeftEllipsisIcon,
  Cog6ToothIcon,
  PencilIcon,
} from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";
import { EllipsisVerticalIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { authorsTableData, projectsTableData } from "@/data";

import { useEffect, useState } from "react";


export function Crops() {
  const [crops, setCrops] = useState([]);

  useEffect(() => {
    async function fetchCrops() {
      try {
        const res = await fetch(`http://localhost:5000/crops/allcrops`, {
          method: 'GET',
          credentials: 'include', // Include cookies with the request
        }); // Adjust if needed
        const data = await res.json();
        setCrops(data);
      } catch (err) {
        console.error("Failed to fetch crops", err);
      }
    }

    // create new crop
    async function createCrop() {
      const newCrop = {
        img: "https://example.com/new-crop.jpg", // Replace with actual image URL
        name: "New Crop",
        description: "This is a new crop",
        type: "New Crop Type",
      };
      try {
        const res = await fetch('http://localhost:5000/crops/createcrop', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newCrop),
          credentials: 'include', // Include cookies with the request
        });
        const data = await res.json();
        console.log("New crop created:", data);
      } catch (err) {
        console.error("Failed to create crop", err);
      }
    }
    // create new crop
    createCrop();

    // fetch all crops
    fetchCrops();
  }, []);

  //Create new crop button
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(!open);

  console.log("Crops data:", crops); // Log the crops data to check if it's being fetched correctly

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">

      <Card>
        <CardHeader variant="gradient" color="white" className="mb-8 flex items-center justify-between p-6">
          <div>
            <Typography variant="h6" color="blue-gray" className="mb-2">
              Crops
            </Typography>
            <Typography
              variant="small"
              className="font-normal text-blue-gray-500"
            >
              Types of crops available in the system
            </Typography>
          </div>

          <Button onClick={handleOpen} variant="gradient">
            Add Crop
          </Button>
          <Dialog size="sm" open={open} handler={handleOpen} className="p-4">
            <DialogHeader className="relative m-0 block">
              <Typography variant="h4" color="blue-gray">
                Manage Item
              </Typography>
              <Typography className="mt-1 font-normal text-gray-600">
                Keep your records up-to-date and organized.
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
            <DialogBody className="space-y-4 pb-6">
              <div>
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="mb-2 text-left font-medium"
                >
                  Name
                </Typography>
                <Input
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
                />
              </div>
              <div>
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="mb-2 text-left font-medium"
                >
                  Category
                </Typography>
                <Select
                  className="!w-full !border-[1.5px] !border-blue-gray-200/90 !border-t-blue-gray-200/90 bg-white text-gray-800 ring-4 ring-transparent placeholder:text-gray-600 focus:!border-primary focus:!border-t-blue-gray-900 group-hover:!border-primary"
                  placeholder="1"
                  labelProps={{
                    className: "hidden",
                  }}
                >
                  <Option>Fruit</Option>
                  <Option>Plant</Option>
                </Select>
              </div>
              <div className="">

                {/* Image Upload */}
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="mb-2 text-left font-medium"
                >
                  Image
                </Typography>
                <Input
                type="file"
                name="image"
                accept="image/*"
                className="!border-[1.5px] !border-blue-gray-200/90 !border-t-blue-gray-200/90 bg-white text-gray-800 ring-4 ring-transparent placeholder:text-gray-600 focus:!border-primary focus:!border-t-blue-gray-900 group-hover:!border-primary"
                containerProps={{
                  className: "!min-w-full",
                }}
                labelProps={{
                  className: "hidden",
                }}
                />
                
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
                  rows={7}
                  placeholder="eg. This is a white shoes with a comfortable sole."
                  className="!w-full !border-[1.5px] !border-blue-gray-200/90 !border-t-blue-gray-200/90 bg-white text-gray-600 ring-4 ring-transparent focus:!border-primary focus:!border-t-blue-gray-900 group-hover:!border-primary"
                  labelProps={{
                    className: "hidden",
                  }}
                />
              </div>
            </DialogBody>
            <DialogFooter>
              <Button className="ml-auto" onClick={handleOpen}>
                Add Crop
              </Button>
            </DialogFooter>
          </Dialog>
        </CardHeader>
        <CardBody className="max-h-screen overflow-auto">
          <div className="px-4 pb-4">

            <div className="mt-6 grid grid-cols-1 gap-12 md:grid-cols-2 xl:grid-cols-4">
              {crops.map(
                ({ image_path, id, name, type }) => (
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
                        {type}
                      </Typography>
                    </CardBody>
                    <CardFooter className="mt-6 flex items-center justify-between py-0 px-1">
                      <Link to={`/dashboard/crops/${id}`}>
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

export default Crops;
