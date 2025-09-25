"use client";
import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  EyeIcon,
  LayoutDashboardIcon,
  Loader2Icon,
  MapPinIcon,
  MessageSquareIcon,
  SearchIcon,
  SlidersVerticalIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { getLiveDashboardDataApi } from "@/api/admin";
import { useCookies } from "react-cookie";
import { idk } from "@/lib/utils";
export default function DataTable() {
  const [cookies] = useCookies(["token"]);
  const [filter, setFilter] = useState<
    "all" | "ongoing" | "completed" | "blocked" | "cancelled"
  >("all");
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["route_list", filter],
    queryFn: (): idk => {
      return getLiveDashboardDataApi({
        filter: "all",
        companyID: "1",
        token: cookies.token,
      });
    },
  });

  return (
    <Card className="bg-background rounded-md py-4! mt-6">
      <CardHeader className="flex flex-row justify-between items-center">
        <div className="">
          <CardTitle className="flex items-center gap-2 text-xl mb-2">
            <LayoutDashboardIcon className="text-blue-600" /> Live Trip
            Dashboard - Morning Rush Hour (6:15 AM)
          </CardTitle>
          <p className="text-sm">Real-time tracking of all active bus routes</p>
        </div>
        <div className="flex items-center gap-2">
          <div className=" border rounded-md flex items-center px-2">
            <SearchIcon className="text-muted-foreground size-5" />
            <Input
              className="bg-transparent border-0! outline-0! ring-0! shadow-none!"
              placeholder="Search  routes"
            />
          </div>
          <Select
            onValueChange={(
              e: "all" | "ongoing" | "completed" | "blocked" | "cancelled"
            ) => {
              setFilter(e);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue
                placeholder={
                  <p className="flex items-center gap-2">
                    <SlidersVerticalIcon />
                    All stauses
                  </p>
                }
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="ongoing">Ongoing</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="blocked">Blocked</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {!isError ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Route</TableHead>
                <TableHead>Trips</TableHead>
                <TableHead>Direction</TableHead>
                <TableHead>Departure</TableHead>
                <TableHead>Next Stop</TableHead>
                <TableHead>Passengers</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!isPending ? (
                data.data.map(
                  (x: {
                    journey_id: number;
                    route_name: string;
                    route_prefix: string;
                    trip_number: string;
                    direction: string;
                    departure_time: string;
                    driver_name: string;
                    passengers: number;
                    progress: number;
                    status: string;
                  }) => (
                    <TableRow key={x.journey_id}>
                      <TableCell>
                        <Badge>{x.route_prefix}</Badge>
                      </TableCell>
                      <TableCell>{x.trip_number}</TableCell>
                      <TableCell>{x.direction}</TableCell>
                      <TableCell>{x.departure_time}</TableCell>
                      <TableCell className="flex items-center gap-2">
                        <MapPinIcon className="size-5" />
                        {x.route_name}
                      </TableCell>
                      <TableCell className="">
                        <span className="text-lg font-bold">
                          {x.passengers ?? "N/A"}
                        </span>{" "}
                        {/* <span>(62%)</span> */}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <p className="flex items-center justify-between">
                            <span>Progress</span>
                            <span>{x.progress}%</span>
                          </p>
                          <Progress max={100} value={x.progress ?? 0} />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={"secondary"}>{x.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant={"ghost"}>
                          <EyeIcon />
                        </Button>
                        <Button variant={"ghost"}>
                          <MessageSquareIcon />
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                )
              ) : (
                <TableRow
                  className={`flex justify-center items-center h-24 mx-auto`}
                >
                  <TableCell>
                    <Loader2Icon className={`animate-spin`} />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        ) : (
          <div className={`flex justify-center items-center h-24 mx-auto`}>
            {error.message}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
