import { getPassengerAnalyticsApi } from "@/api/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { idk } from "@/lib/utils";
import { cookies } from "next/headers";
import React from "react";

export default async function Passengers() {
  const token = (await cookies()).get("AdminToken")?.value;
  const data: idk = await getPassengerAnalyticsApi({ companyID: "1", token });

  return (
    <CardContent>
      <Card>
        <CardHeader>
          <CardTitle>Passenger Analytics</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-3 gap-6 pb-6">
          <div className="flex flex-col justify-center items-center">
            <p className="font-semibold text-teal-700 text-3xl">
              {data.data.total_passengers}
            </p>
            <p>Total Passenger</p>
          </div>
          <div className="flex flex-col justify-center items-center">
            <p className="font-semibold text-amber-600 text-3xl">N/A</p>
            <p>Monthly Pass Holders</p>
          </div>
          <div className="flex flex-col justify-center items-center">
            <p className="font-semibold text-purple-700 text-3xl">
              {data.data.daily_active_passengers ?? "N/A"}
            </p>
            <p>Daily Active</p>
          </div>
        </CardContent>
      </Card>
    </CardContent>
  );
}
