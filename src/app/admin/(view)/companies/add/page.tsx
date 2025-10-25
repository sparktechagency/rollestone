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
    </main>
  );
}
