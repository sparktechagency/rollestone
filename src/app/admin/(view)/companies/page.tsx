import React, { Suspense } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2Icon, PlusIcon } from "lucide-react";

import Link from "next/link";
import CompanyTable from "./company-table";

export default function Page() {
  return (
    <main className="p-6">
      <Card className="">
        <div className="px-6 flex flex-row! justify-between items-center">
          <p className="font-bold text-xl">Companies</p>
          <div className="flex items-center gap-2">
            <div className=""></div>
            <Button asChild>
              <Link href={"/admin/companies/add"}>
                <PlusIcon />
                Add New Company
              </Link>
            </Button>
          </div>
        </div>
        <CardContent className="">
          <Suspense
            fallback={
              <div className={`flex justify-center items-center h-24 mx-auto`}>
                <Loader2Icon className={`animate-spin`} />
              </div>
            }
          >
            <CompanyTable />
          </Suspense>
        </CardContent>
      </Card>
    </main>
  );
}
