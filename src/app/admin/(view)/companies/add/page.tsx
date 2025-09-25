import React from "react";
import CompanySetupForm from "./company-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Page() {
  return (
    <main className="p-6">
      <div className="">
        <h2 className="font-bold text-xl">Add New Company</h2>
        <p className="text-sm">
          Create a new company with its own admin dashboard and driver console
          (BDC).
        </p>
      </div>
      <CompanySetupForm />
      <Card className="w-full mt-6">
        <CardHeader>
          <CardTitle>System Access</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-6 gap-12">
          {access.map((x, i) => (
            <div className="flex items-center gap-2" key={i}>
              <Checkbox /> <Label>{x}</Label>
            </div>
          ))}
        </CardContent>
      </Card>
      <div className="flex justify-end items-center mt-6 gap-2">
        <Button className="" variant={"outline"} asChild>
          <Link href={"/admin,companies"}>Cancel</Link>
        </Button>
        <Button className="bg-blue-600 hover:bg-blue-600/80">
          Create Company
        </Button>
      </div>
    </main>
  );
}

const access = [
  "Admin Dashboard",
  "Driver Console (BDC)",
  "Trip & Route Management",
  "Trip & Route Management",
  "Passenger Database",
  "Fare Control",
  "Notification System",
  "Analytics Access",
];
