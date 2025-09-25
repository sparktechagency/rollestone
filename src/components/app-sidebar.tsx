"use client";

import * as React from "react";
import {
  IconLocation,
  IconMapPin,
  IconMessage2,
  IconSettings,
  IconTicket,
  IconUser,
} from "@tabler/icons-react";

import { NavMain } from "@/components/nav-main";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
} from "@/components/ui/sidebar";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { MicOff, Volume2Icon, WifiIcon } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import AnimToggle from "./sub-ui/animated-toggle";
import ZelloTalkie from "./core/zello-talkie";
const prefix = "/driver";

const navMainItems = [
  {
    title: "Driver",
    url: "/driver",
    icon: IconUser,
  },
  {
    title: "Tickets",
    url: "/tickets",
    icon: IconTicket,
  },
  {
    title: "Blocking",
    url: "/blocking",
    icon: IconLocation,
  },
  {
    title: "Locating",
    url: "/locating",
    icon: IconMapPin,
  },
  {
    title: "Messaging",
    url: "/messaging",
    icon: IconMessage2,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: IconSettings,
  },
];

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

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
        {/* <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
        {/* <Card className="mt-auto py-4 mx-2">
          <CardHeader className="flex items-center justify-between px-4">
            <CardTitle>Zello</CardTitle>
            <div className="gap-2 flex items-center">
              <WifiIcon className="size-5 text-green-600" />
              <Badge variant={"success"}>Connected</Badge>
            </div>
          </CardHeader>
          <CardContent className="px-4">
            <p>
              <span>Channel:</span>{" "}
              <span className="font-semibold">Metro Bus Operations</span>
            </p>
          </CardContent>
          <CardFooter className="grid grid-cols-2 gap-4 px-4!">
            <Button variant={"outline"}>
              <Volume2Icon /> Audio
            </Button>
            <Button variant={"outline"}>
              <MicOff /> PTT
            </Button>
          </CardFooter>
        </Card> */}
        <ZelloTalkie />
      </SidebarContent>
      <SidebarFooter className="mt-4">
        <AnimToggle />
      </SidebarFooter>
    </Sidebar>
  );
}
