"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ClockIcon, Loader2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCookies } from "react-cookie";
import { useUser } from "@/context/user-context";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getRoutesApi } from "@/api/admin";
import { idk } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { IconRoad } from "@tabler/icons-react";
import { blockJourneyApi } from "@/api/driver";
import { toast } from "sonner";

export default function AvailableTrips({ fleet }: { fleet: string }) {
  const [{ token }] = useCookies(["token"]);
  const { user } = useUser();
  const ql = useQueryClient();
  const { data, isPending } = useQuery({
    queryKey: ["routes"],
    queryFn: (): idk => {
      return getRoutesApi({
        companyID: String(user?.company_id),
        token,
      });
    },
  });

  // track which dialog is open
  const [openDialog, setOpenDialog] = useState<number | null>(null);

  const { mutate } = useMutation({
    mutationKey: ["block_trip"],
    mutationFn: (dataset: {
      trip_id: string | number;
      fleet_number: string | number;
    }) => {
      return blockJourneyApi({
        body: dataset,
        companyID: String(user?.company_id),
        token,
      });
    },
    onError: (err: idk) => {
      toast.error(err.message ?? "Failed to complete this request");
    },
    onSuccess: (res: idk) => {
      toast.success(res.message ?? "Successfully blocked this trip");
      ql.invalidateQueries({ queryKey: ["routes"] });
      setOpenDialog(null); // close dialog on success
    },
  });

  return (
    <div className="space-y-6 max-h-[40dvh] overflow-y-auto">
      {isPending ? (
        <div className="flex justify-center items-center h-24 mx-auto">
          <Loader2Icon className="animate-spin" />
        </div>
      ) : (
        data.data.map(
          (x: {
            id: number;
            name: string;
            status: string;
            duration_in_minutes: number;
            trips: {
              id: number;
              departure_time: string;
              direction: string;
              trip_number: string;
            }[];
          }) => (
            <Dialog
              key={x.id}
              open={openDialog === x.id}
              onOpenChange={(open) => setOpenDialog(open ? x.id : null)}
            >
              <DialogTrigger asChild>
                <Button className="w-full h-14 text-lg" variant={"outline"}>
                  {x.name}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader className="w-full">
                  <DialogTitle className="font-bold flex items-center gap-2">
                    <IconRoad />
                    {x.name}
                    <Badge variant={"success"}>{x.status}</Badge>
                  </DialogTitle>
                </DialogHeader>
                <div className="w-full grid grid-cols-3 gap-6">
                  {x.trips.length > 0 ? (
                    x.trips.map((y, i) => (
                      <Button
                        variant={"outline"}
                        className="h-16! w-full! cursor-pointer"
                        onClick={() => {
                          mutate({
                            trip_id: y.id,
                            fleet_number: fleet,
                          });
                        }}
                        key={i}
                      >
                        {y.departure_time}
                      </Button>
                    ))
                  ) : (
                    <p className="w-full text-center col-span-3 text-sm font-semibold text-muted-foreground">
                      No trips available
                    </p>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          )
        )
      )}
    </div>
  );
}
