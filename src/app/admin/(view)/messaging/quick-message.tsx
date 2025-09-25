"use client";

import React from "react";
import { useForm, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { DialogClose } from "@radix-ui/react-dialog";
import { MessageSquareIcon } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createMessageApi } from "@/api/admin";
import { useCookies } from "react-cookie";
import { toast } from "sonner";
import { idk } from "@/lib/utils";

type FormValues = {
  recipients: "all" | "drivers" | "passengers";
  message: string;
};

export default function QuickMessage() {
  const [{ token }] = useCookies(["token"]);
  const queryClient = useQueryClient();

  const { control, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: {
      recipients: "all",
      message: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: idk) =>
      createMessageApi({ body: data, companyID: "1", token }),
    onSuccess: () => {
      toast.success("Message sent successfully!");
      queryClient.invalidateQueries({ queryKey: ["recent_messages"] });
      reset();
    },
    onError: (err) => toast.error(err.message ?? "Failed to send message"),
  });

  const onSubmit = (values: FormValues) => {
    const payload = {
      subject: "Quick Alert", // static
      message_type: "quick", // static
      action: "send_now", // static
      recipient_type: values.recipients,
      body: values.message,
    };
    mutation.mutate(payload);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <MessageSquareIcon /> Quick Message
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Send Quick Message</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>Recipients</Label>
            <Controller
              control={control}
              name="recipients"
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Recipients" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Users</SelectItem>
                    <SelectItem value="drivers">Drivers</SelectItem>
                    <SelectItem value="passengers">Passengers</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div className="space-y-2">
            <Label>Message</Label>
            <Controller
              control={control}
              name="message"
              render={({ field }) => (
                <Input placeholder="Type a short alert" {...field} />
              )}
            />
          </div>
          <DialogFooter className="flex gap-2">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-600/80">
              Send Now
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
