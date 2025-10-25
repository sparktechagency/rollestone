"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Building, Camera, Loader2 } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { useCookies } from "react-cookie";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createCompanyApi,
  getCompanyByIdApi,
  updateCompanyApi,
} from "@/api/admin";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { idk } from "@/lib/utils";

const companySetupSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phone_number: z
      .string()
      .regex(/^\d{10,}$/, "Phone number must be at least 10 digits"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    password_confirmation: z.string(),
    company_name: z
      .string()
      .min(2, "Company name must be at least 2 characters"),
    contact_email: z.string().email("Invalid contact email"),
    address: z.string().min(5, "Address must be at least 5 characters"),
    subdomain: z.string().min(2, "Subdomain must be at least 2 characters"),
    status: z.string(),
    system_access: z.array(z.string()).optional(),
    avatar: z.instanceof(File).optional(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords don't match",
    path: ["password_confirmation"],
  });

type CompanySetupFormData = z.infer<typeof companySetupSchema>;

const ACCESS_OPTIONS = [
  { id: "access admin dashboard", label: "Access Admin Dashboard" },
  { id: "access driver console", label: "Access Driver Console" },
  {
    id: "access trip & route management",
    label: "Access Trip & Route Management",
  },
  { id: "access passenger database", label: "Access Passenger Database" },
  { id: "access fare control", label: "Access Fare Control" },
  { id: "access notification system", label: "Access Notification System" },
  { id: "access analytics", label: "Access Analytics" },
];

export default function CompanySetupForm({ id }: { id: string }) {
  const [{ token }] = useCookies(["token"]);
  const qcl = useQueryClient();
  const navig = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>(
    undefined
  );

  const { data, isPending } = useQuery({
    queryKey: ["view_company", id],
    queryFn: (): idk => getCompanyByIdApi({ id, companyID: "1", token }),
  });

  const { mutate } = useMutation({
    mutationKey: ["company_create"],
    mutationFn: (formData: FormData): idk =>
      updateCompanyApi({ id, formData, companyID: "1", token }),
    onError: (err: any) => {
      toast.error(err.message ?? "Failed to complete this request");
      console.log(err);
    },
    onSuccess: (res: any) => {
      toast.success(res.message ?? "Success!");
      qcl.invalidateQueries({ queryKey: ["companies"] });
      navig.push("/admin/companies");
    },
  });

  const form = useForm<CompanySetupFormData>({
    resolver: zodResolver(companySetupSchema),
    defaultValues: {
      name: "",
      email: "",
      phone_number: "",
      password: "",
      password_confirmation: "",
      company_name: "",
      contact_email: "",
      address: "",
      subdomain: "",
      status: "active",
      system_access: [],
    },
  });

  // Populate form with backend data
  useEffect(() => {
    if (data) {
      form.reset({
        name: data.user?.name || "",
        email: data.user?.email || "",
        phone_number: data.user?.phone_number || "",
        password: "",
        password_confirmation: "",
        company_name: data.data?.company_name || "",
        contact_email: data.data?.contact_email || "",
        address: data.user?.address || "",
        subdomain: data.data?.subdomain || "",
        status: data.data?.status || "active",
        system_access: data.data?.system_access || [],
        avatar: undefined,
      });

      setAvatarPreview(data.user?.avatar);
    }
  }, [data, form]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("avatar", file);
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: CompanySetupFormData) => {
    setIsLoading(true);
    try {
      const formData = new FormData();

      // Text fields
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("phone_number", data.phone_number);
      formData.append("password", data.password);
      formData.append("password_confirmation", data.password_confirmation);
      formData.append("company_name", data.company_name);
      formData.append("contact_email", data.contact_email);
      formData.append("address", data.address);
      formData.append("subdomain", data.subdomain);
      formData.append("status", data.status);

      // System access
      data.system_access?.forEach((access) =>
        formData.append("system_access[]", access)
      );

      // Avatar
      if (data.avatar) formData.append("avatar", data.avatar);

      mutate(formData);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full mt-6 shadow-lg">
      <CardContent className="p-6 space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b">
          <Building className="w-6 h-6" />
          <h2 className="text-xl font-semibold">Company Setup</h2>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Avatar Upload */}
            <div className="flex items-center gap-6">
              <div className="relative">
                <Avatar className="size-24">
                  <AvatarImage src={avatarPreview || "/placeholder.svg"} />
                  <AvatarFallback>UI</AvatarFallback>
                </Avatar>
                <label
                  htmlFor="avatar-input"
                  className="absolute bottom-0 right-0"
                >
                  <Button
                    type="button"
                    variant="secondary"
                    size="icon"
                    className="rounded-full w-8 h-8 border-2 border-white cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById("avatar-input")?.click();
                    }}
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                </label>
                <input
                  id="avatar-input"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </div>
              <div className="space-y-1">
                <p className="text-base font-medium">Upload a Company Logo</p>
                <p className="text-sm text-muted-foreground">
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>
            </div>

            {/* Personal Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Personal Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="company@yopmail.com"
                          type="email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="01700000000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            {/* Company Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Company Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="company_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Example Company Ltd." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="contact_email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="contact@examplecompany.com"
                          type="email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input placeholder="123 Example Street" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="subdomain"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Create Unique Subdomain</FormLabel>
                      <FormControl>
                        <div className="flex rounded-md shadow-sm">
                          <Input
                            placeholder="example"
                            className="flex-1 rounded-r-none focus-visible:ring-0 focus-visible:ring-offset-0"
                            {...field}
                          />
                          <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 bg-muted text-muted-foreground text-sm">
                            .companyname.app
                          </span>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            {/* Admin Credentials */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Main Admin Credentials</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="••••••"
                          type="password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password_confirmation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="••••••"
                          type="password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            {/* Status & Access */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Status & Access</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* System Access Checkboxes */}
              <FormField
                control={form.control}
                name="system_access"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>System Access</FormLabel>
                    <div className="space-y-3 grid grid-cols-6">
                      {ACCESS_OPTIONS.map((item) => (
                        <FormItem
                          key={item.id}
                          className="flex flex-row items-center space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(item.id)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  field.onChange([
                                    ...(field.value || []),
                                    item.id,
                                  ]);
                                } else {
                                  field.onChange(
                                    field.value?.filter((v) => v !== item.id)
                                  );
                                }
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">
                            {item.label}
                          </FormLabel>
                        </FormItem>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end gap-4">
              <Button variant="outline" asChild>
                <Link href="/admin/companies">Cancel</Link>
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? "Setting up..." : "Create Company"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
