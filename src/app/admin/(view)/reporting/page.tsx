import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  DownloadIcon,
  FileIcon,
  LayoutDashboardIcon,
  Loader2Icon,
} from "lucide-react";
import React, { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Revenue from "./revenue";
import Passengers from "./passengers";
import Routes from "./routes";
import Statistics from "./statistics";

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
      <div className="rounded-md py-4! mt-6">
        <CardHeader className="flex flex-row justify-between items-center">
          <div className="">
            <CardTitle className="flex items-center gap-2 text-xl mb-2">
              <LayoutDashboardIcon className="text-blue-600" /> Live Trip
              Dashboard - Morning Rush Hour (6:15 AM)
            </CardTitle>
            <p className="text-sm">
              Real-time tracking of all active bus routes
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant={"outline"}>
              <DownloadIcon />
              Export Report
            </Button>
            <Button>
              <FileIcon />
              Generate Report
            </Button>
          </div>
        </CardHeader>
        <div className="">
          <Tabs defaultValue="revenue">
            <CardContent className="mt-2">
              <TabsList className="bg-zinc-200">
                <TabsTrigger value="revenue">Revenue</TabsTrigger>
                <TabsTrigger value="passengers">Passengers</TabsTrigger>
                <TabsTrigger value="routes">Routes</TabsTrigger>
              </TabsList>
            </CardContent>
            <TabsContent value="revenue" className="">
              <Suspense
                fallback={
                  <div
                    className={`flex justify-center items-center h-24 mx-auto`}
                  >
                    <Loader2Icon className={`animate-spin`} />
                  </div>
                }
              >
                <Revenue />
              </Suspense>
            </TabsContent>
            <TabsContent value="passengers" className="">
              <Suspense
                fallback={
                  <div
                    className={`flex justify-center items-center h-24 mx-auto`}
                  >
                    <Loader2Icon className={`animate-spin`} />
                  </div>
                }
              >
                <Passengers />
              </Suspense>
            </TabsContent>
            <TabsContent value="routes" className="">
              <Suspense
                fallback={
                  <div
                    className={`flex justify-center items-center h-24 mx-auto`}
                  >
                    <Loader2Icon className={`animate-spin`} />
                  </div>
                }
              >
                <Routes />
              </Suspense>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  );
}
