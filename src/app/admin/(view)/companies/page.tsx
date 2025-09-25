import React, { Suspense } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2Icon, PlusIcon, SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";

import Link from "next/link";
import CompanyTable from "./company-table";

export default function Page() {
  return (
    <main className="p-6">
      <Card className="">
        <div className="px-6 flex flex-row! justify-between items-center">
          <p className="font-bold text-xl">Companies</p>
          <div className="flex items-center gap-2">
            <div className=" border rounded-md flex items-center px-2">
              <SearchIcon className="text-muted-foreground size-5" />
              <Input
                className="bg-transparent border-0! outline-0! ring-0! shadow-none!"
                placeholder="Search routes"
              />
            </div>
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
