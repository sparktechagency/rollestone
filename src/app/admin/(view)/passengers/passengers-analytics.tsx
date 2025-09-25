"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { getPassengerAnalyticsApi } from "@/api/admin";
import { useCookies } from "react-cookie";
import { Loader2Icon } from "lucide-react";
import { idk } from "@/lib/utils";
export default function PassengersAnalytics() {
  const [{ token }] = useCookies(["token"]);
  const { data, isPending } = useQuery({
    queryKey: ["passengers_analytics"],
    queryFn: (): idk => {
      return getPassengerAnalyticsApi({ companyID: "1", token });
    },
  });

  if (isPending) {
    return (
      <div className={`flex justify-center items-center h-24 mx-auto`}>
        <Loader2Icon className={`animate-spin`} />
      </div>
    );
  }
  const cardData = [
    {
      title: "Total Users",
      value: data.data.total_passengers ?? "N/A",
      footer: "+23 this week",
    },
    {
      title: "Active Cards",
      value: data.data.active_cards ?? "0",
      footer: "96% of users",
    },
    {
      title: "Total Balance",
      value: data.data.total_balance ?? "0",
      footer: "Across all accounts",
    },
    {
      title: "Suspended",
      value: data.data.suspended_passengers ?? "0",
      footer: "Across suspended",
    },
  ];
  return (
    <div className="w-full grid grid-cols-4 gap-6">
      {cardData.map((card, index) => (
        <Card key={index} className={`gap-2`}>
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
