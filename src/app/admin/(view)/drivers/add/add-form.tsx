"use client";
import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { CameraIcon } from "lucide-react";
import { blankImg } from "@/lib/config";
import { useMutation } from "@tanstack/react-query";
import { createDriverApi } from "@/api/admin";
import { useCookies } from "react-cookie";
import { toast } from "sonner";
import { idk } from "@/lib/utils";
import { useRouter } from "next/navigation";

const driverSchema = z
  .object({
    fullName: z.string().min(1, "Full Name is required"),
    email: z.string().optional(),
    phone: z.string().optional(),
    dob: z.string().optional(),
    staffNumber: z.string().min(1, "Staff number is required"),
    pin: z
      .string()
      .min(3, "Pin code is required")
      .max(5, "Must be under 5 character"),
    licenseNumber: z.string().min(1, "License number is required"),
    licenseExpiry: z.string().min(1, "Expiry date is required"),
    experience_years: z.string().min(1, "Experience years is required"),
    status: z.enum(["active", "inactive"]),
  })
  .refine(
    (data) => {
      const years = Number(data.experience_years);
      return !isNaN(years) && years <= 100;
    },
    {
      message: "Experience years must be a valid number and ≤ 100",
      path: ["experience_years"],
    }
  );

export default function DriverForm() {
  const [img, setImg] = useState<File | undefined>();
  const [cookies] = useCookies(["token"]);
  const navig = useRouter();
  const { mutate } = useMutation({
    mutationKey: ["create_driver"],
    mutationFn: (data: FormData) => {
      return createDriverApi({
        formData: data,
        companyID: "1",
        token: cookies.token,
      });
    },
    onError: (err) => {
      toast.error(err.message ?? "Failed to complete this request");
    },
    onSuccess: (data: idk) => {
      toast.success(data.message ?? "Successfully created a driver");
      navig.push("/admin/drivers");
    },
  });
  const form = useForm<z.infer<typeof driverSchema>>({
    resolver: zodResolver(driverSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      dob: "",
      staffNumber: "",
      pin: "",
      licenseNumber: "",
      licenseExpiry: "",
      experience_years: "",
      status: "active",
    },
  });

  const onSubmit = (values: z.infer<typeof driverSchema>) => {
    console.log({ ...values, avatar: img });

    const payload = new FormData();
    payload.append("name", values.fullName);
    if (values.email) {
      payload.append("email", values.email);
    }
    if (values.phone) {
      payload.append("phone_number", values.phone);
    }
    payload.append("staff_number", values.staffNumber);
    payload.append("pin_code", values.pin);
    payload.append("license_number", values.licenseNumber);
    payload.append("license_expiry_date", values.licenseExpiry);
    payload.append("experience_years", values.experience_years);
    if (img) {
      payload.append("avatar", img);
    }

    mutate(payload);
  };

  const handleCancel = () => {
    form.reset({
      fullName: "",
      email: "",
      phone: "",
      dob: "",
      staffNumber: "",
      pin: "",
      licenseNumber: "",
      licenseExpiry: "",
      experience_years: "",
      status: "inactive",
    });
  };

  return (
    <>
      {/* Avatar Upload */}
      <section className="flex flex-col w-full items-center justify-start gap-6">
        <div className="relative h-[140px] w-[140px]">
          <Avatar className="size-[140px]">
            <AvatarImage src={img ? URL.createObjectURL(img) : blankImg(124)} />
            <AvatarFallback>UI</AvatarFallback>
          </Avatar>

          <Button
            className="bg-blue-600 hover:bg-blue-600/80 rounded-full absolute bottom-0 right-0"
            size={"icon"}
            asChild
          >
            <Label htmlFor="avatar">
              <CameraIcon />
            </Label>
          </Button>

          <input
            id="avatar"
            name="avatar"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setImg(file);
              }
            }}
          />
        </div>

        <p>{img?.name}</p>
      </section>

      {/* Form Section */}
      <section className="col-span-2">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            style={{
              maxWidth: 700,
              margin: "auto",
              color: "#222",
              lineHeight: 1.3,
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "32px 64px",
                marginBottom: 24,
              }}
            >
              {/* Full Name */}
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Liam Bentley" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="e.g. john.doe@gmail.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Phone */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 00881122334" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* DOB */}
              <FormField
                control={form.control}
                name="dob"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Birth</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} className="pl-1" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Staff Number */}
              <FormField
                control={form.control}
                name="staffNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Staff Number (for login)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 00881122334" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* PIN */}
              <FormField
                control={form.control}
                name="pin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>PIN (3-5 digits)</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter a 3 to 5 digit pin"
                        maxLength={5}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* License Number */}
              <FormField
                control={form.control}
                name="licenseNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>License Number</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 00881122334" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* License Expiry */}
              <FormField
                control={form.control}
                name="licenseExpiry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>License Expiry Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} className="pl-1" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Address */}
            <FormField
              control={form.control}
              name="experience_years"
              render={({ field }) => (
                <FormItem style={{ marginBottom: 24 }}>
                  <FormLabel>Experience years</FormLabel>
                  <FormControl>
                    <Input type="number" min={1} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Status */}
            {/* <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem style={{ marginBottom: 48 }}>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-6 mt-2">
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="radio"
                          value="active"
                          checked={field.value === "active"}
                          onChange={() => field.onChange("active")}
                          className="mr-2"
                        />
                        Active
                      </label>
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="radio"
                          value="inactive"
                          checked={field.value === "inactive"}
                          onChange={() => field.onChange("inactive")}
                          className="mr-2"
                        />
                        Inactive
                      </label>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}

            {/* Buttons */}
            <div style={{ textAlign: "right" }} className="space-x-2">
              <Button type="button" onClick={handleCancel} variant="outline">
                Cancel
              </Button>
              <Button
                type="submit"
                style={{
                  backgroundColor: "#1476ff",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                Save Driver
              </Button>
            </div>
          </form>
        </Form>
      </section>
    </>
  );
}
