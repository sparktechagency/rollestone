"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  ChevronLeftIcon,
  ChevronRight,
  Loader2Icon,
  RouteIcon,
  SearchIcon,
  UserPlusIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useCookies } from "react-cookie";
import { useQuery } from "@tanstack/react-query";
import { getRoutesApi } from "@/api/admin";
import { cn, idk } from "@/lib/utils";

export default function Routes() {
  const [cookies] = useCookies(["token"]);
  const { data, isPending } = useQuery({
    queryKey: ["routes"],
    queryFn: (): idk => {
      return getRoutesApi({ companyID: "1", token: cookies.token });
    },
  });
  if (isPending) {
    return (
      <div className={`flex justify-center items-center h-24 mx-auto`}>
        <Loader2Icon className={`animate-spin`} />
      </div>
    );
  }
  return (
    <>
      <Card className="bg-background rounded-md py-4!">
        <CardHeader className="flex flex-row justify-between items-center">
          <div className="">
            <CardTitle className="flex items-center gap-2 text-xl mb-2">
              <RouteIcon className="" /> All Drivers
            </CardTitle>
            <p className="text-sm">
              Manage bus routes, schedules, and performance
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className=" border rounded-md flex items-center px-2">
              <SearchIcon className="text-muted-foreground size-5" />
              <Input
                className="bg-transparent border-0! outline-0! ring-0! shadow-none!"
                placeholder="Search  routes"
              />
            </div>
            <Button className="bg-blue-600 hover:bg-blue-600/90" asChild>
              <Link href={"/admin/routes/add"}>
                <UserPlusIcon /> Add New Routes
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.data.map(
            (x: {
              id: number;
              name: string;
              status: string;
              duration_in_minutes: number;
              trips: Array<{
                id: number;
                departure_time: string;
                direction: string;
                trip_number: string;
              }>;
            }) => (
              <Card className="p-4 flex flex-col gap-4" key={x.id}>
                {/* Header with Route Name and Action Buttons */}
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold">{x.name}</h2>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className={cn(
                        x.status === "Active"
                          ? "bg-green-500 text-white hover:bg-green-600"
                          : "bg-secondary hover:bg-secondary/80"
                      )}
                    >
                      {x.status}
                    </Button>
                    <Button variant="outline" asChild>
                      <Link href={`/admin/routes/${x.id}`}>Edit</Link>
                    </Button>
                  </div>
                </div>
                {/* Duration */}
                <p className="text-gray-600">
                  Duration: {x.duration_in_minutes} min
                </p>

                {/* Departure Times & Trip Numbers Label */}
                <p className="font-semibold">Departure Times & Trip Numbers:</p>

                {/* Departure Time & Trip Number Badges */}
                <div className="flex flex-wrap gap-2">
                  {x.trips.map((y) => (
                    <Badge
                      key={y.id}
                      variant="outline"
                      className="px-3 py-1 rounded-full border border-gray-300 text-gray-700"
                    >
                      {y.departure_time} ({y.trip_number})
                    </Badge>
                  ))}
                </div>
              </Card>
            )
          )}
        </CardContent>
      </Card>
      <div className=" flex items-center justify-center mt-8 gap-2">
        <Button variant={"outline"}>
          <ChevronLeftIcon />
        </Button>
        <Button variant={"outline"}>1</Button>
        <Button variant={"outline"}>2</Button>
        <Button variant={"outline"}>3</Button>
        <Button variant={"outline"}>
          <ChevronRight />
        </Button>
      </div>
    </>
  );
}
