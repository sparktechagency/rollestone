"use client";
import { getMessagesApi } from "@/api/admin";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { idk } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import React, { useState } from "react";
import { useCookies } from "react-cookie";

export default function Recents() {
  const [{ token }] = useCookies(["token"]);
  const [filterer, setFilterer] = useState<"sent" | "draft" | "schedule">(
    "sent"
  );
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["recent_messages", filterer],
    queryFn: (): idk => {
      return getMessagesApi({ status: filterer, companyID: "1", token });
    },
  });
  return (
    <Card className="bg-background rounded-md py-4! mt-6">
      <CardHeader className="flex flex-row justify-between items-center">
        <div className="">
          <CardTitle className="flex items-center gap-2 text-xl ">
            Recent Messages
          </CardTitle>
        </div>
        <Select
          value={filterer}
          onValueChange={(e) => {
            setFilterer(e as idk);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sent">Sent</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="schedule">Schedule</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="space-y-6">
        {isError ? (
          <p className="h-12 w-full justify-center items-center">
            {error.message}
          </p>
        ) : isPending ? (
          <div className={`flex justify-center items-center h-24 mx-auto`}>
            <Loader2Icon className={`animate-spin`} />
          </div>
        ) : (
          data.data.data.map((x: idk) => (
            <Card className="p-4 flex flex-col gap-4" key={x.id}>
              <div className="flex justify-between items-center">
                <div className="flex flex-row justify-center items-center gap-2 w-fit text-sm">
                  <Badge variant={"outline"} className="capitalize">
                    {x.message_type} Alert
                  </Badge>
                  <p className="capitalize">to {x.recipient_type} </p>
                </div>
                <div className="flex gap-2 items-center text-sm font-semibold">
                  <Button
                    variant="outline"
                    className={
                      x.status === "sent"
                        ? "bg-green-500 text-white hover:bg-green-600"
                        : ""
                    }
                  >
                    {x.status}
                  </Button>
                  <p>
                    {new Date(x.created_at).toLocaleString([], {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      // hour: "2-digit",
                      // minute: "2-digit",
                      // second: "2-digit",
                    })}
                  </p>
                </div>
              </div>
              <p className="text-gray-600">{x.body}</p>
            </Card>
          ))
        )}
      </CardContent>
    </Card>
  );
}
