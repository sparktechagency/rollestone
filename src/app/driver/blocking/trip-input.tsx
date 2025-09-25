"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useMutation } from "@tanstack/react-query";
import { findTripApi } from "@/api/driver";
import { useUser } from "@/context/user-context";
import { toast } from "sonner";
import { idk } from "@/lib/utils";
import { useCookies } from "react-cookie";
import TripBlocker from "./trip-blocker";

export function TripBlockingCard() {
  const [tripNumber, setTripNumber] = useState("");
  const { user } = useUser();
  const [{ token }] = useCookies(["token"]);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [data, setData] = useState<idk | undefined>();
  const { mutate } = useMutation({
    mutationKey: ["find_trip"],
    mutationFn: () => {
      return findTripApi({
        trip_number: tripNumber,
        companyID: String(user?.company_id),
        token,
      });
    },
  });
  const keypadButtons = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
    [".", "0", "*"],
  ];

  const handleKeypadClick = (value: string) => {
    if (value === "*") {
      // Handle backspace/delete
      setTripNumber((prev) => prev.slice(0, -1));
    } else {
      setTripNumber((prev) => prev + value);
    }
  };

  const handleFindTrip = () => {
    mutate(undefined, {
      onError: (err) => {
        toast.error(err.message ?? "Failed to find trip");
        setDialogOpen(false);
        setTripNumber("");
      },
      onSuccess: (data: idk) => {
        console.log(data);
        setDialogOpen(true);
        setData(data.data);
      },
    });
  };

  return (
    <Card className="w-full bg-white shadow-lg">
      <CardHeader className="text-center pb-4">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <MapPin className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-semibold text-gray-900">Trip Blocking</h1>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label
            htmlFor="trip-number"
            className="text-sm font-medium text-gray-700"
          >
            Trip Number
          </Label>
          <Input
            id="trip-number"
            type="text"
            placeholder="Enter Trip Number"
            value={tripNumber}
            onChange={(e) => setTripNumber(e.target.value)}
            className="text-center py-6 text-lg"
          />
        </div>

        {/* Numeric Keypad */}
        <div className="bg-gray-100 rounded-lg p-4">
          <div className="grid grid-cols-3 gap-3">
            {keypadButtons.flat().map((button, index) => (
              <Button
                key={index}
                variant="secondary"
                className="h-12 text-lg font-medium bg-white hover:bg-gray-50 border border-gray-200"
                onClick={() => handleKeypadClick(button)}
              >
                {button}
              </Button>
            ))}
          </div>
        </div>

        <Dialog open={dialogOpen}>
          <DialogTrigger asChild>
            {/* Find Trip Button */}
            <Button
              onClick={handleFindTrip}
              className="w-full h-12 text-lg font-medium bg-blue-500 hover:bg-blue-600"
              disabled={!tripNumber.trim()}
            >
              FIND TRIP
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <TripBlocker setDialogOpen={setDialogOpen} data={data} />
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
