"use client";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Plus, X, Clock } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useMutation } from "@tanstack/react-query";
import { createRouteApi } from "@/api/admin";
import { useCookies } from "react-cookie";
import { toast } from "sonner";
import { idk } from "@/lib/utils";
import { useRouter } from "next/navigation";
import LocationPicker from "@/components/core/location-picker";

/* -------------------------
   Zod schema (consistent)
   ------------------------- */
const FareSchema = z.object({
  id: z.string().optional(),
  type: z.string().min(1, "Fare type is required"),
  cash: z.string().min(1, "Cash amount required"),
  userApp: z.string().min(1, "User app amount required"),
});

const TimePointSchema = z.object({
  id: z.string().optional(),
  location: z.string().min(1, "Location required"),
  time: z.string().min(1, "Time required"),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
});

const FormSchema = z.object({
  routeName: z.string().min(1, "Route name is required"),
  tripNum: z
    .string()
    .min(1, "Trip # is required")
    .max(10, "Route prefix must not exceed 10 characters"),
  googleMapLink: z.string().optional(),
  trackedItem: z.enum(["none", "wheelchair", "bike", "stroller"]),
  timePoints: z
    .array(TimePointSchema)
    .min(1, "At least one time point required"),
  fares: z.array(FareSchema).min(1, "At least one fare required"),
  status: z.enum(["active", "inactive"]),
});

type FormValues = z.infer<typeof FormSchema>;

/* -------------------------
   Component
   ------------------------- */
export default function AddRouteForm() {
  const navig = useRouter();
  const [cookies] = useCookies(["AdminToken"]);
  const { mutate } = useMutation({
    mutationKey: ["route-create"],
    mutationFn: (data: idk) => {
      return createRouteApi({
        body: data,
        companyID: "1",
        token: cookies.AdminToken,
      });
    },
    onError: (err) => {
      toast.error(err.message ?? "Failed to complete this request");
      console.log(err);
    },
    onSuccess: (data: idk) => {
      toast.success(data.message ?? "Route Created Successfully");
      navig.push("/admin/routes");
    },
  });
  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      routeName: "",
      tripNum: "",
      googleMapLink: "", // Explicit empty string instead of undefined
      trackedItem: "none", // Explicit value to match enum
      timePoints: [
        {
          location: "",
          time: "0",
          latitude: "", // Explicit empty strings
          longitude: "",
        },
      ],
      fares: [
        {
          id: "f-adult",
          type: "Adult",
          cash: "50.00",
          userApp: "45.00",
        },
        {
          id: "f-student",
          type: "Student",
          cash: "30.00",
          userApp: "25.00",
        },
        {
          id: "f-child",
          type: "Child",
          cash: "20.00",
          userApp: "15.00",
        },
      ],
      status: "active" as const, // Explicit const assertion
    },
  });

  const { control, handleSubmit } = form;

  const timePoints = useFieldArray({ control, name: "timePoints" });
  const fares = useFieldArray({ control, name: "fares" });

  /* -------------------------
     onSubmit: transform to backend shape
     ------------------------- */

  function onSubmit(values: FormValues) {
    const payload = {
      name: values.routeName,
      route_prefix: values.tripNum,
      google_map_link: values.googleMapLink || null,
      status: values.status === "active" ? 1 : 0,
      stops: values.timePoints.map((stop, idx) => ({
        location_name: stop.location,
        stop_order: idx + 1,
        minutes_from_start: Number(stop.time ?? 0),
        latitude: stop.latitude || null,
        longitude: stop.longitude || null,
      })),
      fares: values.fares.map((fare) => ({
        passenger_type: fare.type.toLowerCase(),
        cash_amount: Number.isNaN(Number(fare.cash)) ? 0 : Number(fare.cash),
        app_amount: Number.isNaN(Number(fare.userApp))
          ? 0
          : Number(fare.userApp),
      })),
    };

    console.log(payload);
    mutate(payload);
  }

  return (
    <main className="p-6">
      <div className="p-8 w-full mx-auto bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold mb-6">Add New Routes</h1>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* route/trip */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={control}
                name="routeName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Route Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="RX1 Rolleston North" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="tripNum"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trip #</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g 101A" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* googleMapLink */}
            <FormField
              control={control}
              name="googleMapLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Google Map Link</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="https://maps.google.com/?q=..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* <FormField
              control={control}
              name="trackedItem"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tracked Item</FormLabel>
                  <FormControl>
                    <RadioGroup
                      value={field.value}
                      onValueChange={field.onChange}
                      className="flex flex-wrap gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="none" id="none" />
                        <Label htmlFor="none">None</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="wheelchair" id="wheelchair" />
                        <Label htmlFor="wheelchair">Wheelchair</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="bike" id="bike" />
                        <Label htmlFor="bike">Bike</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="stroller" id="stroller" />
                        <Label htmlFor="stroller">Stroller</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}

            {/* timePoints */}
            <div>
              <h2 className="text-lg font-medium mb-4">Time points</h2>
              {timePoints.fields.map((item, idx) => (
                <div
                  key={item.id}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center mb-3"
                >
                  {/* <FormField
                    control={control}
                    name={`timePoints.${idx}.location` as const}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input {...field} placeholder="Stop name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  /> */}
                  <LocationPicker
                    onLocationSelect={({ address, lat, lng }) => {
                      form.setValue(
                        `timePoints.${idx}.location`,
                        address ?? ""
                      );
                      form.setValue(
                        `timePoints.${idx}.latitude`,
                        lat.toString()
                      );
                      form.setValue(
                        `timePoints.${idx}.longitude`,
                        lng.toString()
                      );
                    }}
                  />

                  <FormField
                    control={control}
                    name={`timePoints.${idx}.time` as const}
                    disabled={idx === 0}
                    render={({ field }) => (
                      <FormItem className="h-full">
                        <FormControl>
                          <div className="relative h-full">
                            <Input
                              {...field}
                              className="pr-10 h-full"
                              placeholder="Time"
                              type="number"
                              min={1}
                            />
                            <Clock className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex space-x-2">
                    {/* <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="w-8 h-8 bg-transparent"
                      onClick={() =>
                        timePoints.append({
                          id: `tp-${Date.now()}`,
                          location: "",
                          time: "",
                          latitude: "", // Explicit empty strings
                          longitude: "",
                        })
                      }
                    >
                      <Plus className="w-4 h-4" />
                    </Button> */}
                    {idx !== 0 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="w-8 h-8 bg-transparent"
                        onClick={() => timePoints.remove(idx)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              <Button
                type="button"
                variant="link"
                onClick={() =>
                  timePoints.append({
                    id: `tp-${Date.now()}`,
                    location: "",
                    time: "",
                    latitude: "", // Explicit empty strings
                    longitude: "",
                  })
                }
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Timing Point
              </Button>
            </div>

            {/* fares */}
            <div>
              <h2 className="text-lg font-medium mb-4">Applicable Fares</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {fares.fields.map((fare, idx) => (
                  <Card key={fare.id} className={`p-4 relative border-2`}>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 rounded-full w-6 h-6 p-0"
                      onClick={() => fares.remove(idx)}
                    >
                      <X className="w-4 h-4" />
                    </Button>

                    <div className="mb-3 flex items-center space-x-2">
                      <FormField
                        control={control}
                        name={`fares.${idx}.type` as const}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel className="text-md font-semibold">
                              {field.value || "Fare"}
                            </FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="space-y-2">
                      <FormField
                        control={control}
                        name={`fares.${idx}.cash` as const}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="block text-sm text-gray-600">
                              Cash
                            </FormLabel>
                            <FormControl>
                              <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={control}
                        name={`fares.${idx}.userApp` as const}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="block text-sm text-gray-600">
                              User App
                            </FormLabel>
                            <FormControl>
                              <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </Card>
                ))}
              </div>

              <Button
                type="button"
                variant="link"
                onClick={() =>
                  fares.append({
                    id: `f-${Date.now()}`,
                    type: "New Fare",
                    cash: "0.00",
                    userApp: "0.00",
                  })
                }
              >
                <Plus className="w-4 h-4 mr-1" /> Add Applicable fares
              </Button>
            </div>

            {/* status + actions */}
            <div>
              <h2 className="text-lg font-medium mb-4">Status</h2>
              <FormField
                control={control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <RadioGroup
                        value={field.value}
                        onValueChange={field.onChange}
                        className="flex space-x-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="active" id="active" />
                          <Label htmlFor="active">Active</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="inactive" id="inactive" />
                          <Label htmlFor="inactive">Inactive</Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  navig.back();
                }}
              >
                Cancel
              </Button>
              <Button type="submit">Add</Button>
            </div>
          </form>
        </Form>
      </div>
    </main>
  );
}
