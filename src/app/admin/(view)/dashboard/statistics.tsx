import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cookies } from "next/headers";
import { getDashboardStatsApi } from "@/api/admin";
import { idk } from "@/lib/utils";
export default async function Statistics() {
  const token = (await cookies()).get("token")?.value;

  const call: idk = await getDashboardStatsApi({
    companyID: "1",
    token: token ?? "",
  });

  console.log(call);
  const stats = call.data;

  if (!stats || !call.ok) {
    return (
      <div className="w-full grid grid-cols-4 gap-6">
        <Card className="col-span-4">
          <CardContent></CardContent>
        </Card>
        ;
      </div>
    );
  }

  const cardData = [
    {
      title: "Active Trips",
      value: stats.active_trips ?? "N/A",
      footer: "Morning rush hour",
      bgColor: "bg-blue-500", // Adjusted to be closer to the image's blue
    },
    {
      title: "Total Passengers",
      value: stats.total_passengers.today,
      footer: "Currently onboard",
      bgColor: "bg-green-500", // Green from the image
    },
    {
      title: "Revenue Today",
      value: stats.revenue.today ? `$${stats.revenue.today}` : "N/A",
      footer: `${stats.revenue.is_increase ? "+" : "-"}${
        stats.revenue.percentage_change ?? "N/A"
      } from yesterday`,
      bgColor: "bg-purple-600", // Purple from the image
    },
    {
      title: "Active Drivers",
      value: stats.active_drivers,
      footer: "Morning Shift",
      bgColor: "bg-yellow-600", // Golden/Yellow from the image
    },
  ];

  return (
    <div className="w-full grid grid-cols-4 gap-6">
      {cardData.map((card, index) => (
        <Card key={index} className={`gap-2 ${card.bgColor} text-white`}>
          <CardHeader className="">
            <CardTitle>{card.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{card.value}</p>
          </CardContent>
          <CardFooter className="text-sm">
            <p>{card.footer}</p>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
