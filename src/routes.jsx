import {
  HomeIcon,
  UserCircleIcon,
  TableCellsIcon,
  InformationCircleIcon,
  ServerStackIcon,
  RectangleStackIcon,
} from "@heroicons/react/24/solid";
import { Admin, User, Profile, Tables, Notifications } from "@/pages/dashboard"; // Corrected import

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
        name: "admin",
        path: "/admin",
        element: <Admin />,
        role: ["admin"]
      },
      {
        icon: <HomeIcon {...icon} />,
        name: "user",
        path: "/user",
        element: <User />,
        role: ["user"]
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "profile",
        path: "/profile",
        element: <Profile />,
        role: ["admin, user"]
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "tables",
        path: "/tables",
        element: <Tables />,
        role: ["admin", "user"]
      },
      {
        icon: <InformationCircleIcon {...icon} />,
        name: "notifications",
        path: "/notifications",
        element: <Notifications />,
        role: ["admin", "user"]
      },
    ],
  }
];

export default routes;
