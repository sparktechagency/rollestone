import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getMessagesDashboardStatsApi } from "@/api/admin";
import { cookies } from "next/headers";
import { idk } from "@/lib/utils";

export default async function MessageStats() {
  const token = (await cookies()).get("token")?.value;
  const call: idk = await getMessagesDashboardStatsApi({
    companyID: "1",
    token,
  });

  if (!call.data) {
    return (
      <p className="h-12 w-full flex justify-center items-center">
        {call.message}
      </p>
    );
  }

  return (
    <div className="w-full grid grid-cols-4 gap-6">
      <Card className="gap-0">
        <CardHeader className="pb-2">
          <p className="font-semibold">Total Messages</p>
          <div className="flex items-center">
            <CardTitle className="text-2xl font-semibold">
              {call.data.total_messages}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-gray-600 text-lg">
            Overall messages created
          </CardDescription>
        </CardContent>
      </Card>

      <Card className="gap-0">
        <CardHeader className="pb-2">
          <p className="font-semibold">Draft Messages</p>
          <div className="flex items-center">
            <CardTitle className="text-2xl font-semibold">
              {call.data.draft_messages}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-gray-600 text-lg">
            Saved but not sent
          </CardDescription>
        </CardContent>
      </Card>

      <Card className="gap-0">
        <CardHeader className="pb-2">
          <p className="font-semibold">Scheduled Messages</p>
          <div className="flex items-center">
            <CardTitle className="text-2xl font-semibold">
              {call.data.scheduled_messages}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-gray-600 text-lg">
            Set to send later
          </CardDescription>
        </CardContent>
      </Card>

      <Card className="gap-0">
        <CardHeader className="pb-2">
          <p className="font-semibold">Sent Messages</p>
          <div className="flex items-center">
            <CardTitle className="text-2xl font-semibold">
              {call.data.sent_messages}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-gray-600 text-lg">
            Successfully delivered
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  );
}
