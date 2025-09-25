import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getRouteAnalytics } from "@/api/admin";
import { cookies } from "next/headers";
import { idk } from "@/lib/utils";
export default async function Statistics() {
  const token = (await cookies()).get("token")?.value;
  const call: idk = await getRouteAnalytics({ companyID: "1", token });
  const data = call.data;
  const cardData = [
    {
      title: "Todays Revenue",
      value: data.total_passengers,
      footer: "",
    },
    {
      title: "Active Passengers",
      value: data.daily_active_passengers,
      footer: "",
    },
    {
      title: "Total Balance",
      value: "N/A",
      footer: "",
    },
    {
      title: "Suspended",
      value: "N/A",
      footer: "",
    },
  ];

  return (
    <div className="w-full grid grid-cols-4 gap-6 p-4">
      {cardData.map((x: idk) => (
        <Card key={x.title} className={`gap-2`}>
          <CardHeader className="">
            <CardTitle>{x.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{x.value}</p>
          </CardContent>
          <CardFooter className="text-sm">
            <p>{x.footer}</p>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
