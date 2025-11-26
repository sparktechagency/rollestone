import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getMonthlyTrendsApi, getRevenueByRouteApi } from "@/api/admin";
import { cookies } from "next/headers";
import { idk } from "@/lib/utils";
import CashCouncil from "./cash-council";

export default async function Revenue() {
  const token = (await cookies()).get("AdminToken")?.value;
  const call: idk = await getRevenueByRouteApi({
    filter: "weekly",
    companyID: "1",
    token,
  });
  const mCall: idk = await getMonthlyTrendsApi({
    companyID: "1",
    token,
  });
  return (
    <CardContent className="w-full grid grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Revenue by Route</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {call.data.map((x: idk) => (
            <div className="flex items-center justify-between" key={x.id}>
              <div className="flex items-center gap-2">
                <Badge>RX1</Badge> <span>N/A</span>
              </div>
              <p className="text-green-600">N/A</p>
            </div>
          ))}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Monthly Trends</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {mCall.data.map((x: idk, i: number) => (
            <div
              key={`${x.month_name}${i}`}
              className="flex items-center justify-between"
            >
              <div className="">{x.month_name}</div>
              <p className="text-green-600">
                {x.total_revenue ? `$${x.total_revenue}` : "N/A"}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
      <CashCouncil />
    </CardContent>
  );
}
