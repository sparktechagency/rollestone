"use client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getSettingsApi,
  testStripeSettingsApi,
  updateSettingsApi,
} from "@/api/admin";
import { useCookies } from "react-cookie";
import { idk } from "@/lib/utils";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Loader2Icon } from "lucide-react";

// ✅ Zod schema
const stripeSchema = z.object({
  publishable_key: z.string().min(1, "Publishable key is required"),
  secret_key: z.string().min(1, "Secret key is required"),
  webhook_secret: z.string().min(1, "Webhook secret is required"),
});

type StripeFormValues = z.infer<typeof stripeSchema>;

export default function StripeForm() {
  const [{ AdminToken }] = useCookies(["AdminToken"]);
  const qCl = useQueryClient();
  const [whd, setWhd] = useState("");
  const { data, isPending } = useQuery({
    queryKey: ["settings"],
    queryFn: (): idk => {
      return getSettingsApi({ companyID: "1", token: AdminToken });
    },
  });
  const { mutate } = useMutation({
    mutationKey: ["updateSettings"],
    mutationFn: (data: idk) => {
      return updateSettingsApi({
        body: data,
        companyID: "1",
        token: AdminToken,
      });
    },
    onError: (err) => {
      toast.error(err.message ?? "Failed to complete this request");
    },
    onSuccess: (res: idk) => {
      toast.success(res.message ?? "Successfully updated the settings");
      qCl.invalidateQueries({
        queryKey: ["settings"],
      });
    },
  });
  const { mutate: tester, isPending: testPending } = useMutation({
    mutationKey: ["test_stripe"],
    mutationFn: () => {
      return testStripeSettingsApi({ companyID: "1", token: AdminToken });
    },
    onError: (err) => {
      toast.error(err.message ?? "Failed to complete this request");
    },
    onSuccess: (res: idk) => {
      toast.success(res.message ?? "Test was a success");
    },
  });

  useEffect(() => {
    if (!isPending) {
      setWhd(data.data.webhook_endpoint);
    }
  }, [isPending]);
  const form = useForm<StripeFormValues>({
    resolver: zodResolver(stripeSchema),
    defaultValues: {
      publishable_key: "",
      secret_key: "",
      webhook_secret: "",
    },
  });

  const onSubmit = (values: StripeFormValues) => {
    console.log("Stripe Form Submitted:", values);
    mutate(values);
  };

  return (
    <Card className="shadow-sm rounded-lg col-span-2">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between text-lg font-medium">
          Stripe Integration
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Connected
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="publishable_key"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stripe Publishable Key</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter publishable key"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="secret_key"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stripe Secret Key</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter secret key"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="webhook_secret"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stripe Webhook Secret</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter webhook secret"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Webhook Endpoint (read-only) */}
            <FormItem>
              <FormLabel>Webhook Endpoint</FormLabel>
              <FormControl>
                <Input type="url" value={whd} readOnly />
              </FormControl>
            </FormItem>

            <div className="grid grid-cols-2 gap-6">
              <Button type="submit">Save</Button>
              <Button
                type="button"
                variant="outline"
                className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
                onClick={() => {
                  tester();
                }}
                disabled={testPending}
              >
                {testPending ? (
                  <Loader2Icon className="animate-spin" />
                ) : (
                  "Test Connection"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
