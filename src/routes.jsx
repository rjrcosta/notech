import {
  HomeIcon,
  UserCircleIcon,
  TableCellsIcon,
  InformationCircleIcon,
  ServerStackIcon,
  RectangleStackIcon,
} from "@heroicons/react/24/solid";
import { Admin, User, Profile, UsersTables, AdminTables, Notifications, InfoStation, Fields, FieldDetails, Crops  } from "@/pages/dashboard"; // Corrected import


console.log('Im in routes')

const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  {
    layout: "dashboard",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "Dashboard",
        path: "/admin",
        element: <Admin />,
        role: ["super_admin", "admin"],
      },
      {
        icon: <HomeIcon {...icon} />,
        name: "Dashboard",
        path: "/user",
        element: <User />,
        role: ["owner", "manager", "analyst"]
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "profile",
        path: "/profile",
        element: <Profile />,
        role: []
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "Tables",
        path: "/admintables",
        element: <AdminTables />,
        role: ["super_admin", "admin"]
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "Tables",
        path: "/usertables",
        element: <UsersTables />,
        role: ["owner", "manager", "analyst"]
      },
      {
        icon: <HomeIcon {...icon} />,
        name: "Crops",
        path: "/crops",
        element: <Crops />,
        role: ["owner", "manager", "analyst", "super_admin", "admin"]
      },
      {
        icon: <HomeIcon {...icon} />,
        name: "Fields",
        path: "/fields",
        element: <Fields />,
        role: ["owner", "manager", "analyst", "super_admin", "admin"]
      },
      {
        icon: <HomeIcon {...icon} />,
        name: "Fields Details",
        path: "/fields/fieldDetails",
        element: <FieldDetails />,
        role: []
      },
      {
        icon: <HomeIcon {...icon} />,
        name: "Info Stations",
        path: "/infostations",
        element: <InfoStation />,
        role: []
      },
      {
        icon: <InformationCircleIcon {...icon} />,
        name: "notifications",
        path: "/notifications",
        element: <Notifications />,
        role: []
      },
    ],
  }
];

export default routes;
