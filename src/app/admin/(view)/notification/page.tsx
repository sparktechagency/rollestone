"use client";
import React from "react";
import { NotifCard } from "./notif-card";
import { useQuery } from "@tanstack/react-query";
import { getNotifications } from "@/api/driver";
import { useCookies } from "react-cookie";
import { Loader2Icon } from "lucide-react";
import { idk } from "@/lib/utils";

export default function Page() {
  const [{ token }] = useCookies(["token"]);
  const { data, isPending } = useQuery({
    queryKey: ["notif"],
    queryFn: (): idk => {
      return getNotifications({ companyID: "1", token });
    },
  });
  return (
    <main className="p-6 space-y-6">
      {isPending ? (
        <div className={`flex justify-center items-center h-24 mx-auto`}>
          <Loader2Icon className={`animate-spin`} />
        </div>
      ) : (
        data.data.map((x: idk) => <NotifCard data={x} key={x.id} />)
      )}
    </main>
  );
}
