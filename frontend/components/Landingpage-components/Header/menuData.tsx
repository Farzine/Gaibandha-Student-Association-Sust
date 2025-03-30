import { Menu } from "@/types/menu";

const menuData: Menu[] = [
  {
    id: 1,
    title: "Home",
    path: "/",
    newTab: false,
  },
  {
    id: 2,
    title: "About",
    newTab: false,
    submenu: [
      {
        id: 21,
        title: "About GSA-SUST",
        path: "/about-gsa",
        newTab: false,
      },
      {
        id: 22,
        title: "About Gaibandha",
        path: "/about-gaibandha",
        newTab: false,
      },
    ]
  },
  {
    id: 3,
    title: "Members",
    path: "/members",
    newTab: false,
  },
  {
    id: 4,
    title: "Gallery",
    path: "/gallery",
    newTab: false,
  },
  {
    id: 5,
    title: "Events",
    path: "/events",
    newTab: false,
  },
  {
    id: 6,
    title: "Contact",
    path: "/contact",
    newTab: false,
  },
];
export default menuData;
