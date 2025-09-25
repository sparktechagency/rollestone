"use client";
import MapBase from "@/components/core/map";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClockIcon, Loader2Icon } from "lucide-react";
import React from "react";
import Timeline from "./timeline";
import { useQuery } from "@tanstack/react-query";
import { getDriverScheduleApi } from "@/api/driver";
import { useCookies } from "react-cookie";
import { useUser } from "@/context/user-context";
import { Marker } from "@vis.gl/react-google-maps";
import { idk } from "@/lib/utils";

export default function Page() {
  const [{ token }] = useCookies(["token"]);
  const { user } = useUser();
  const { data, isPending } = useQuery({
    queryKey: ["schedule"],
    queryFn: (): idk => {
      return getDriverScheduleApi({
        companyID: String(user?.company_id),
        token,
      });
    },
  });
  if (isPending) {
    return (
      <main className="h-full w-full flex justify-center items-center">
        <Loader2Icon className={`animate-spin`} />
      </main>
    );
  }

  return (
    <main className="p-16 h-full w-full grid grid-cols-10 gap-6">
      <section className="col-span-7 w-full h-full rounded-lg bg-background shadow flex flex-col overflow-hidden">
        <MapBase
          defaultCenter={{
            lat: parseFloat(data.data[0].location.latitude),
            lng: parseFloat(data.data[0].location.longitude),
          }}
          className="h-[90%] w-full"
        >
          <Marker
            position={{
              lat: parseFloat(data.data[0].location.latitude),
              lng: parseFloat(data.data[0].location.longitude),
            }}
          />
        </MapBase>
        <div className="flex-1 w-full flex items-center justify-between px-6">
          <h3>
            <span className="font-bold">Direction:</span> Outbound
          </h3>
          <div className="flex justify-center items-center gap-1">
            <Button className="rounded-full">Outbound</Button>
            <Button className="rounded-full" variant={"outline"}>
              Inbound
            </Button>
          </div>
        </div>
      </section>

      <Card className="col-span-3 w-full h-full">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <ClockIcon className="w-5 h-5" />
            Stop Schedule & Timing Points
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Timeline stops={data.data[0].trip.route.stops} />
        </CardContent>
      </Card>
    </main>
  );
}
