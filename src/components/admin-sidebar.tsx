"use client";

import * as React from "react";
import Image from "next/image";

import {
  IconDashboard,
  IconBus,
  IconRoute,
  IconUsers,
  IconChartLine,
  IconBuilding,
  IconMessage2,
  IconSettings,
} from "@tabler/icons-react";

import { NavMain } from "@/components/nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
} from "@/components/ui/sidebar";

// Prefix for URLs
const prefix = "/admin";

// Navigation Items (Updated)
const navMainItems = [
  {
    title: "Live Dashboard",
    url: "/dashboard",
    icon: IconDashboard,
  },
  {
    title: "Drivers",
    url: "/drivers",
    icon: IconBus,
  },
  {
    title: "Routes",
    url: "/routes",
    icon: IconRoute,
  },
  {
    title: "Passenger Management",
    url: "/passengers",
    icon: IconUsers,
  },
  {
    title: "Reporting",
    url: "/reporting",
    icon: IconChartLine,
  },
  {
    title: "Companies",
    url: "/companies",
    icon: IconBuilding,
  },
  {
    title: "Messaging & Notifications",
    url: "/messaging",
    icon: IconMessage2,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: IconSettings,
  },
];

// Sidebar Data with Prefixed URLs
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: navMainItems.map((item) => ({
    ...item,
    url: `${prefix}${item.url}`,
  })),
};

// AdminSidebar Component
export function AdminSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar className="py-[24px]" collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <Image
            src={"/logo.png"}
            height={300}
            width={900}
            alt="logo"
            className="w-full h-[64px] object-contain"
          />
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
    </Sidebar>
  );
}
