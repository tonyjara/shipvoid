import type { IconType } from "react-icons";
import { FiHome, FiMail, FiSettings } from "react-icons/fi";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { FaCcStripe, FaUsers } from "react-icons/fa";
import { BsDpad, BsSpeedometer2, BsTicketPerforated } from "react-icons/bs";
import { BiSolidCoupon, BiSupport } from "react-icons/bi";
import { User } from "@prisma/client";
import { AiOutlineCloudDownload } from "react-icons/ai";

export interface LinkItemProps {
  name: string;
  icon: IconType;
  dest: string; //destination
  target?: string; //used with external links
  children?: {
    name: string;
    icon: IconType;
    dest: string; //destination
    target?: string; //used with external links
  }[];
}

const AdminLinks: (isAdmin: boolean) => Array<LinkItemProps> = (isAdmin) => {
  return isAdmin
    ? [
        {
          name: "Admin",
          icon: MdOutlineAdminPanelSettings,
          dest: "/admin",
          children: [
            {
              name: "Users",
              icon: FaUsers,
              dest: "/admin/users",
            },
            {
              name: "Releases",
              icon: AiOutlineCloudDownload,
              dest: "/admin/releases",
            },
            {
              name: "Stripe Products",
              icon: FaCcStripe,
              dest: "/admin/stripe-products",
            },

            {
              name: "Stripe Prices",
              icon: FaCcStripe,
              dest: "/admin/stripe-prices",
            },
            {
              name: "Mailing List",
              icon: FiMail,
              dest: "/admin/mailing-list",
            },
            {
              name: "Utils",
              icon: BsDpad,
              dest: "/admin/utils",
            },
          ],
        },

        {
          name: "Support",
          icon: BiSupport,
          dest: "/admin/support",
          children: [
            {
              name: "Tickets",
              icon: BsTicketPerforated,
              dest: "/admin/support",
            },
          ],
        },
      ]
    : [];
};

export const SidebarLinks: (user: User) => Array<LinkItemProps> = (
  user: User,
) => {
  return [
    ...AdminLinks(user.role === "admin"),
    { name: "Home", icon: FiHome, dest: "/home" },
    { name: "Settings", icon: FiSettings, dest: "/home/settings" },
  ];
};
