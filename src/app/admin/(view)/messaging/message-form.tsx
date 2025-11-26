"use client";

import { z } from "zod";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createMessageApi } from "@/api/admin";
import { idk } from "@/lib/utils";
import { useCookies } from "react-cookie";
import { toast } from "sonner";

const formSchema = z.object({
  messageType: z.string().min(1, "Select a message type"),
  recipients: z.enum(["all", "drivers", "passengers"]),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(1, "Message cannot be empty"),
  scheduleDate: z.string().optional(),
});

export default function MessageForm() {
  const [{ AdminToken }] = useCookies(["AdminToken"]);
  const qCl = useQueryClient();
  const { mutate } = useMutation({
    mutationKey: ["create_message"],
    mutationFn: (data: idk) => {
      return createMessageApi({
        body: data,
        companyID: "1",
        token: AdminToken,
      });
    },
    onError: (err) => {
      toast.error(err.message ?? "Failed to complete this request");
    },
    onSuccess: (res: idk) => {
      toast.success(res.message ?? "Message Created Successfully");
      qCl.invalidateQueries({ queryKey: ["recent_messages"] });
    },
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      messageType: "",
      recipients: "all",
      subject: "",
      message: "",
      scheduleDate: "",
    },
  });

  const scheduleDate = useWatch({
    control: form.control,
    name: "scheduleDate",
  });

  // Keep onSubmit with two parameters
  function onSubmit(values: z.infer<typeof formSchema>, action: string) {
    const payload = {
      subject: values.subject,
      body: values.message,
      message_type: values.messageType,
      recipient_type: values.recipients,
      action,
      scheduled_at: values.scheduleDate || null,
    };
    mutate(payload, {
      onSettled: () => {
        form.reset();
      },
    });
    console.log(payload);
  }

  return (
    <div className="flex justify-center items-center mt-6">
      <Card className="w-full rounded-xl shadow-sm">
        <CardHeader className="border-b p-4 md:p-6">
          <CardTitle className="text-xl md:text-2xl font-semibold">
            Revenue by Route
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 md:p-6 grid gap-6">
          <Form {...form}>
            <form className="grid gap-6">
              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="messageType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-gray-100 w-full">
                            <SelectValue placeholder="Select Message Type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="info">Info</SelectItem>
                          <SelectItem value="message">Message</SelectItem>
                          <SelectItem value="warn">Warn</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="recipients"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Recipients</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-gray-100 w-full">
                            <SelectValue placeholder="Select Recipients" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="all">All Users</SelectItem>
                          <SelectItem value="drivers">Drivers</SelectItem>
                          <SelectItem value="passengers">Passengers</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Message Subject"
                        className="bg-gray-100"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Type your message here"
                        className="min-h-[120px] bg-gray-100"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="scheduleDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Schedule Date (if schedule)</FormLabel>
                    <FormControl>
                      <Input
                        type="datetime-local"
                        className="bg-gray-100"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                {scheduleDate ? (
                  <Button
                    type="button"
                    onClick={() =>
                      form.handleSubmit((values) =>
                        onSubmit(values, "schedule")
                      )()
                    }
                    className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Schedule
                  </Button>
                ) : (
                  <>
                    <Button
                      type="button"
                      onClick={() =>
                        form.handleSubmit((values) =>
                          onSubmit(values, "send_now")
                        )()
                      }
                      className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Send Message
                    </Button>
                    <Button
                      type="button"
                      onClick={() =>
                        form.handleSubmit((values) =>
                          onSubmit(values, "save_draft")
                        )()
                      }
                      variant="outline"
                      className="flex-1 sm:flex-none border-gray-300 text-gray-700 hover:bg-gray-100 bg-transparent"
                    >
                      Save as draft
                    </Button>
                  </>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
