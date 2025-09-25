"use client";
import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ArrowRightIcon,
  ChevronDown,
  ClockIcon,
  Loader2Icon,
  MapPinIcon,
  ShieldIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useUser } from "@/context/user-context";
import {
  blockJourneyApi,
  endJourneyApi,
  getDriverScheduleApi,
  startJourneyApi,
} from "@/api/driver";
import { useCookies } from "react-cookie";
import { idk } from "@/lib/utils";
import { toast } from "sonner";
export default function Trips() {
  const { user } = useUser();
  const qcl = useQueryClient();
  const [{ token }] = useCookies(["token"]);
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["trips"],
    queryFn: (): idk => {
      return getDriverScheduleApi({
        companyID: String(user?.company_id),
        token,
      });
    },
  });
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
    onError: (err) => {
      toast.error(err.message ?? "Failed to complete this request");
    },
    onSuccess: (res: idk) => {
      qcl.invalidateQueries({ queryKey: ["trips"] });
      toast.success(res.message ?? "Successfully blocked this trip");
    },
  });
  const { mutate: startJourney } = useMutation({
    mutationKey: ["start_trip"],
    mutationFn: ({
      dataset,
      jId,
    }: {
      dataset: { latitude: number; longitude: number };
      jId: number | string;
    }) => {
      return startJourneyApi({
        data: dataset,
        journeyID: jId,
        companyID: String(user?.company_id),
        token,
      });
    },
    onError: (err) => {
      toast.error(err.message ?? "Failed to complete this request");
    },
    onSuccess: (res: idk) => {
      qcl.invalidateQueries({ queryKey: ["trips"] });
      toast.success(res.message ?? "Successfully Started this trip");
    },
  });
  const { mutate: endJourney } = useMutation({
    mutationKey: ["end_trip"],
    mutationFn: ({ jId }: { jId: number | string }) => {
      return endJourneyApi({
        journeyID: jId,
        companyID: String(user?.company_id),
        token,
      });
    },
    onError: (err) => {
      toast.error(err.message ?? "Failed to complete this request");
    },
    onSuccess: (res: idk) => {
      qcl.invalidateQueries({ queryKey: ["trips"] });
      toast.success(res.message ?? "Successfully Started this trip");
    },
  });

  if (isPending) {
    return (
      <div className={`flex justify-center items-center h-24 mx-auto`}>
        <Loader2Icon className={`animate-spin`} />
      </div>
    );
  }
  if (isError) {
    return (
      <section className="h-full w-full flex justify-center items-center">
        {error.message}
      </section>
    );
  }

  return (
    <section className="h-full w-full">
      <Accordion type="single" className="space-y-4" collapsible>
        {isPending ? (
          <div className={`flex justify-center items-center h-24 mx-auto`}>
            <Loader2Icon className={`animate-spin`} />
          </div>
        ) : (
          data.data.map(
            (x: {
              id: number;
              trip_id: number;
              driver_id: number;
              fleet_number: string;
              journey_date: string;
              actual_departure_time: idk;
              actual_arrival_time: idk;
              current_lat: idk;
              current_lng: idk;
              status: string;
              location: {
                latitude: string;
                longitude: string;
                location_name: string;
              };
              created_at: string;
              updated_at: string;
              trip: {
                id: number;
                company_id: number;
                route_id: number;
                departure_time: string;
                direction: string;
                is_active: number;
                created_at: string;
                updated_at: string;
                route: {
                  id: number;
                  company_id: number;
                  name: string;
                  route_prefix: string;
                  google_map_link: string;
                  status: number;
                  created_at: string;
                  updated_at: string;
                };
              };
            }) => (
              <AccordionItem
                value={`item-${x.id}`}
                className="bg-blue-100 px-4 border-blue-500 border rounded-md"
                key={x.id}
              >
                <AccordionTrigger className="flex flex-col">
                  <div className="flex w-full justify-between items-center">
                    <div className="flex items-center gap-2">
                      <ChevronDown />{" "}
                      <Badge className="bg-blue-700 rounded-sm! ">Route</Badge>
                      <h3 className="font-bold">
                        {x.trip.route.route_prefix} - {x.trip.route.name}
                      </h3>
                    </div>
                    <div className="flex justify-center items-center gap-2 ">
                      <span>
                        <Badge>{x.status}</Badge>
                      </span>
                      <Badge className="bg-transparent! border-blue-600 text-foreground rounded-sm! ">
                        Trip: #{x.trip.id}
                      </Badge>
                      {x.status !== "blocked" && (
                        <Button
                          className="bg-amber-500 cursor-pointer"
                          size={"sm"}
                          onClick={() => {
                            mutate({
                              trip_id: x.trip_id,
                              fleet_number: x.fleet_number,
                            });
                          }}
                          asChild
                        >
                          <div>
                            <ShieldIcon /> Block this trip
                          </div>
                        </Button>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-center gap-4">
                    <span className="flex items-center gap-2">
                      <ClockIcon className="size-4" />
                      Dep : {x.actual_departure_time ?? "N/A"}
                    </span>
                    <span className="flex items-center gap-2">
                      <MapPinIcon className="size-4" />
                      {x.location.location_name}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <Card className="rounded-none!">
                    <CardHeader>
                      <CardTitle className="text-lg">
                        Block Trip Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-6">
                      {[
                        {
                          title: "Route",
                          content: (
                            <span className="gap-4 flex items-center">
                              {x.trip.route.name}{" "}
                              <ArrowRightIcon className="size-4" />{" "}
                              {x.location.location_name}
                            </span>
                          ),
                        },
                        {
                          title: "Trip",
                          content: `#${x.trip_id}`,
                        },
                        {
                          title: "Date",
                          content: x.journey_date,
                        },
                        {
                          title: "Departure",
                          content: x.actual_departure_time ?? "N/A",
                        },
                        {
                          title: "Arrival",
                          content: x.actual_arrival_time ?? "N/A",
                        },
                        {
                          title: "Fleet Number",
                          content: x.fleet_number,
                        },
                        {
                          title: "Status",
                          content: x.status,
                        },
                        {
                          title: "Active Status",
                          content:
                            x.trip.is_active === 1 ? (
                              <>
                                <div className="size-3 bg-green-600 rounded-full" />
                              </>
                            ) : (
                              <div className="size-3 bg-destructive rounded-full" />
                            ),
                        },
                      ].map(({ title, content }, i) => (
                        <div className="flex flex-col" key={i}>
                          <span className="text-base font-bold">{title}</span>
                          <span className="font-semibold text-sm">
                            {content}
                          </span>
                        </div>
                      ))}
                    </CardContent>
                    <CardFooter className="flex justify-end items-center gap-6">
                      <Button
                        className="cursor-pointer"
                        onClick={() => {
                          if (navigator.geolocation) {
                            navigator.geolocation.getCurrentPosition(
                              (pos) => {
                                startJourney({
                                  jId: x.id,
                                  dataset: {
                                    latitude: pos.coords.latitude,
                                    longitude: pos.coords.longitude,
                                  },
                                });
                              },
                              (err) => {
                                console.error("Error getting location:", err);
                              }
                            );
                          } else {
                            console.error("Geolocation not supported");
                          }
                        }}
                      >
                        Start Journey
                      </Button>

                      <Button
                        className="cursor-pointer"
                        onClick={() => {
                          endJourney({
                            jId: x.id,
                          });
                        }}
                      >
                        End Journey
                      </Button>
                    </CardFooter>
                  </Card>
                </AccordionContent>
              </AccordionItem>
            )
          )
        )}
      </Accordion>
    </section>
  );
}
