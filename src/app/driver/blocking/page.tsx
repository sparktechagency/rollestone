"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { BusIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useState } from "react";
import { TripBlockingCard } from "./trip-input";
import AvailableTrips from "./available-trips";

export default function Page() {
  const [fleet, setFleet] = useState<string>("");
  const [fleetConfirmed, setFleetConfirmed] = useState<boolean>(false);

  return (
    <main className="p-16 h-screen w-full grid grid-cols-2 gap-6">
      {/* Left column */}
      <div className="h-full w-full flex flex-col gap-6">
        {/* Fleet Number card → auto height */}
        <Card className="bg-background rounded-md shadow flex flex-col">
          <CardHeader className="w-full">
            <CardTitle className="flex items-center gap-2 font-bold">
              <BusIcon /> Fleet Number
            </CardTitle>
          </CardHeader>
          <CardContent className="w-full">
            <div className="text-blue-600 border rounded-md border-blue-400 bg-blue-100 p-6">
              <Label htmlFor="fleet" className="w-full text-xl font-bold">
                Current Vehicle
              </Label>
              <Input
                name="fleet"
                disabled={fleetConfirmed}
                value={fleet}
                onChange={(e) => {
                  setFleet(e.target.value);
                }}
                id="fleet"
                placeholder="0000"
                className="bg-transparent border-0 px-0 text-4xl! mt-6 font-semibold !outline-0 !ring-0 !shadow-none"
                type="number"
              />
            </div>
          </CardContent>
          <CardFooter className="w-full">
            <Button
              className="w-full"
              variant={fleetConfirmed ? "outline" : "default"}
              onClick={() => {
                setFleetConfirmed(!fleetConfirmed);
              }}
            >
              {fleetConfirmed
                ? "Re-Enter Fleet number"
                : "Confirm Fleet Number"}
            </Button>
          </CardFooter>
        </Card>

        {/* Route Selection card → fills remaining height */}
        <Card className="flex-1 flex flex-col">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Route Selection</CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            {!fleetConfirmed ? (
              <p className="text-center text-sm font-semibold text-muted-foreground w-full py-6 bg-secondary">
                Please Confirm your Fleet number to get routes
              </p>
            ) : (
              <AvailableTrips fleet={fleet} />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Right column → takes full height */}
      <div className="h-full">
        <TripBlockingCard />
      </div>
    </main>
  );
}
