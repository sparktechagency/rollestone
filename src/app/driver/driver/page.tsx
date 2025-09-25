import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ClockIcon, Loader2Icon } from "lucide-react";
import React, { Suspense } from "react";
import Trips from "./trips";
import UserCard from "./user-card";

export default function Page() {
  return (
    <section className="p-4 flex-1 flex flex-col justify-start items-start">
      <Card className="w-full">
        <Suspense
          fallback={
            <div className={`flex justify-center items-center h-24 mx-auto`}>
              <Loader2Icon className={`animate-spin`} />
            </div>
          }
        >
          <UserCard />
        </Suspense>
      </Card>
      <Card className="pt-0! w-full flex-1 mt-4 rounded-none!">
        <CardHeader className="p-4! bg-blue-900 flex items-center text-background text-xl gap-2 font-semibold">
          <ClockIcon />
          <h4>Today’s Trips</h4>
        </CardHeader>
        <CardContent>
          <Suspense
            fallback={
              <div className={`flex justify-center items-center h-24 mx-auto`}>
                <Loader2Icon className={`animate-spin`} />
              </div>
            }
          >
            <Trips />
          </Suspense>
        </CardContent>
      </Card>
    </section>
  );
}
