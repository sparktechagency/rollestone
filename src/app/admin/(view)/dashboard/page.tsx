import { Loader2Icon } from "lucide-react";
import React, { Suspense } from "react";
import Statistics from "./statistics";
import DataTable from "./data-table";
export default function Page() {
  return (
    <main className="h-full w-full p-2">
      <Suspense
        fallback={
          <div className={`flex justify-center items-center h-24 mx-auto`}>
            <Loader2Icon className={`animate-spin`} />
          </div>
        }
      >
        <Statistics />
      </Suspense>
      <Suspense>
        <DataTable />
      </Suspense>
    </main>
  );
}
