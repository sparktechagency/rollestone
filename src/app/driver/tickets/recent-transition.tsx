"use client";
import { getTransitionHistory } from "@/api/driver";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@/context/user-context";
import { idk } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import React from "react";
import { useCookies } from "react-cookie";

export default function RecentTransition() {
  const [{ token }] = useCookies(["token"]);
  const { user } = useUser();
  const { data, isPending } = useQuery({
    queryKey: ["transition"],
    queryFn: (): idk => {
      return getTransitionHistory({
        companyID: String(user?.company_id),
        token,
      });
    },
  });
  if (isPending) {
    return (
      <div className={`flex justify-center items-center h-24 mx-auto`}>
        <Loader2Icon className={`animate-spin`} />
      </div>
    );
  }

  return data?.data?.map(
    (x: {
      id: number;
      date_time: string;
      description: string;
      type: string;
      payment_method: string;
      amount: number;
      status: string;
      fare_details: Array<{
        type: string;
        quantity: number;
        unit_price: string;
      }>;
    }) => (
      <div
        className="flex flex-row justify-between items-center w-full rounded-md bg-blue-50 p-4"
        key={x.id}
      >
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">{x.type}</h5>
          <p className="text-sm">{x.description}</p>
        </div>
        <div className="flex flex-col justify-end items-end gap-2">
          <p className="text-sm">{x.date_time}</p>
          <Badge
            className=""
            variant={x.status === "succeeded" ? "success" : "outline"}
          >
            {x.status}
          </Badge>
        </div>
      </div>
    )
  );
}
