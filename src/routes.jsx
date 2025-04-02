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
        role: [1]
      },
      {
        icon: <HomeIcon {...icon} />,
        name: "user",
        path: "/user",
        element: <User />,
        role: [3]
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "profile",
        path: "/profile",
        element: <Profile />,
        role: [1,2,3,4,5]
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "tables",
        path: "/tables",
        element: <Tables />,
        role: [1,2,3,4,5]
      },
      {
        icon: <InformationCircleIcon {...icon} />,
        name: "notifications",
        path: "/notifications",
        element: <Notifications />,
        role: [1,2,3,4,5]
      },
    ],
  }
];

export default routes;
