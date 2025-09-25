import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QrCodeIcon } from "lucide-react";
import React from "react";
import TicketTopup from "./ticket-topup";
import RecentTransition from "./recent-transition";

export default function Page() {
  return (
    <main className="px-[100px] py-[50px] h-full w-full grid grid-cols-2 gap-12">
      <TicketTopup />
      <Card className="w-full h-[85dvh]">
        <CardHeader className="flex items-center justify-start gap-2">
          <QrCodeIcon className="flex" />
          <CardTitle className="block">Recent Transaction</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col justify-start items-start gap-4 overflow-y-auto">
          <RecentTransition />
        </CardContent>
      </Card>
    </main>
  );
}
