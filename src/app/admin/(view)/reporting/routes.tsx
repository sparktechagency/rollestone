import { getRouteStatisticsApi } from "@/api/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { idk } from "@/lib/utils";
import { cookies } from "next/headers";
import React from "react";

export default async function Routes() {
  const token = (await cookies()).get("AdminToken")?.value;
  const call: idk = await getRouteStatisticsApi({ companyID: "1", token });

  return (
    <CardContent>
      <Card className="w-full ">
        <CardHeader>
          <CardTitle>Route Statistics</CardTitle>
        </CardHeader>
        <CardContent className="">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Route</TableHead>
                <TableHead>Daily Trips</TableHead>
                <TableHead>Passengers</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>On Time Rate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {call.data.map(
                (
                  x: {
                    route_name: string;
                    daily_trips: number;
                    passengers: number;
                    revenue: string;
                    on_time_rate: string;
                  },
                  i: number
                ) => (
                  <TableRow key={`${x.route_name}${i}`}>
                    <TableCell>{x.route_name}</TableCell>
                    <TableCell>{x.daily_trips}</TableCell>
                    <TableCell>{x.passengers}</TableCell>
                    <TableCell className="text-green-600">
                      {x.revenue ? `$${x.revenue}` : "N/A"}
                    </TableCell>
                    <TableCell className="font-bold">
                      {x.on_time_rate}%
                    </TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </CardContent>
  );
}
