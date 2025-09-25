import React from "react";
import {
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { idk } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { blockJourneyApi } from "@/api/driver";
import { useUser } from "@/context/user-context";
import { useCookies } from "react-cookie";
export default function TripBlocker({
  setDialogOpen,
  data,
}: {
  setDialogOpen: idk;
  data: idk;
}) {
  const [{ token }] = useCookies(["token"]);
  const { user } = useUser();
  const { mutate } = useMutation({
    mutationKey: ["block_trip"],
    mutationFn: (dataset: {
      trip_id: string | number;
      fleet_number: string | number;
    }) => {
      return blockJourneyApi({
        companyID: String(user?.company_id),
        token,
        body: dataset,
      });
    },
  });

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-xl font-semibold">
          Please Confirm Trip Details Below
        </DialogTitle>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-2 items-center gap-4">
          <span className="text-gray-700 font-medium">Route:</span>
          <span className="text-right text-gray-900">{data[0].route.name}</span>
        </div>
        <div className="grid grid-cols-2 items-center gap-4">
          <span className="text-gray-700 font-medium">Time:</span>
          <span className="text-right text-gray-900">
            {data[0].departure_time}
          </span>
        </div>
        <div className="grid grid-cols-2 items-center gap-4">
          <span className="text-gray-700 font-medium">Start Point:</span>
          <span className="text-right text-gray-900">
            {data[0].starting_point}
          </span>
        </div>
      </div>
      <DialogFooter className="flex flex-col-reverse sm:flex-col sm:justify-center gap-3 mt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setDialogOpen(false);
          }}
          className="w-full sm:w-auto border-gray-300 text-gray-700 hover:bg-gray-100 py- px-4 rounded-md text-lg"
        >
          CANCEL
        </Button>
      </DialogFooter>
    </>
  );
}
