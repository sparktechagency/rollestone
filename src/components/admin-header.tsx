"use client";
import { BellIcon, Calendar, ChevronDown, ClockIcon } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { useCurrentTime } from "./sub-ui/get-time";
import Link from "next/link";

function getCurrentFormattedDate(): string {
  const now = new Date();

  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  };

  const formattedDate = now.toLocaleDateString("en-US", options);

  // Remove comma after day number
  return formattedDate.replace(/(\d{1,2}),/, "$1");
}

export default function AdminHeader() {
  const time = useCurrentTime();
  return (
    <header className=" bg-background flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6 h-full justify-between text-lg">
        <div className="h-full flex flex-col justify-center items-start gap-2">
          <p className="font-semibold text-xl">Live Dashboard</p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="size-4" /> {getCurrentFormattedDate()}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <ClockIcon className="size-4" /> {time}
            </div>
          </div>
        </div>
        <div className="flex gap-2 items-center">
          <Button variant={"outline"} asChild>
            <Link href={"/admin/notification"}>
              <BellIcon /> Notification
            </Link>
          </Button>
          <div className="p-2 rounded-md border flex flex-row text-sm! gap-4 items-center">
            <Avatar className="size-10">
              <AvatarImage src={"https://avatar.iran.liara.run/public"} />
              <AvatarFallback>UI</AvatarFallback>
            </Avatar>
            <div className="">
              <h4 className="font-bold">RX Rolleston</h4>
              <span>Administrator</span>
            </div>
            <ChevronDown className="size-5" />
          </div>
        </div>
      </div>
    </header>
  );
}
