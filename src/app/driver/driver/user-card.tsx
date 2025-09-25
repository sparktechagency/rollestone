"use client";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { CalendarDaysIcon, LogOutIcon, RefreshCcwIcon } from "lucide-react";
import { useUser } from "@/context/user-context";
import { blankImg } from "@/lib/config";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
export default function UserCard() {
  const qcl = useQueryClient();
  const { user } = useUser();
  const navig = useRouter();
  return (
    <CardContent className="flex justify-between items-center">
      <div className="flex flex-row justify-start gap-2 h-full">
        <Avatar className="size-16">
          <AvatarImage src={user?.avatar ?? blankImg(64)} />
          <AvatarFallback>UI</AvatarFallback>
        </Avatar>
        <div className="flex flex-col h-full justify-center items-start ml-2">
          <h3 className="text-lg font-bold">{user?.name}</h3>
          <p className="text-sm">Current type</p>
        </div>
      </div>
      <div className="flex flex-col h-full justify-center items-center">
        <h3 className="text-lg font-bold">Today’s Schedule</h3>
        <p className="flex items-center gap-1 text-sm">
          <CalendarDaysIcon className="size-4" />
          <span>Saturday, June 28, 2025</span>
        </p>
      </div>
      <div className="flex flex-col h-full justify-between items-center">
        <div className="flex items-center justify-center gap-2">
          <Button
            className="flex items-center gap-2 cursor-pointer"
            variant={"outline"}
            onClick={() => {
              qcl.invalidateQueries({ queryKey: ["trips"] });
            }}
          >
            <RefreshCcwIcon />
            Refresh
          </Button>
          <Button
            className="flex items-center gap-2 justify-center cursor-pointer"
            variant={"outline"}
            onClick={() => {
              navig.push("/logout");
            }}
          >
            <LogOutIcon className="text-destructive" />
            Log Out
          </Button>
        </div>
        <p className="flex gap-6 items-center text-xs">
          <span>
            Last Updated:{" "}
            {`${new Date(user?.updated_at ?? "").toLocaleDateString("en-GB")}`}
          </span>
          <span>
            {new Date(user?.updated_at ?? "").toLocaleTimeString("en-GB", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </p>
      </div>
    </CardContent>
  );
}
