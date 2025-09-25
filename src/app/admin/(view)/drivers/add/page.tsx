import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";
import DriverForm from "./add-form";

export default function Page() {
  return (
    <main className="p-12">
      <Card className="h-full w-full">
        <CardHeader className="border-b pb-4!">
          <CardTitle>Driver Information</CardTitle>
        </CardHeader>
        <CardContent className="pt-12 grid grid-cols-3 gap-6">
          <DriverForm />
        </CardContent>
      </Card>
    </main>
  );
}
