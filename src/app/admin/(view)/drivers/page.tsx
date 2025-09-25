// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";

// import { PauseIcon, StarIcon, UserCheckIcon, XCircleIcon } from "lucide-react";
import React from "react";
import DriverList from "./driver-list";

export default function Page() {
  return (
    <main className="h-full w-full p-2">
      {/* <div className="w-full grid grid-cols-4 gap-6">
        <Card className="gap-0">
          <CardHeader className="pb-2">
            <div className="flex items-center">
              <UserCheckIcon className="text-green-500 w-6 h-6 mr-2" />
              <CardTitle className="text-2xl font-semibold">18</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-gray-600 text-lg">
              Active Driver
            </CardDescription>
          </CardContent>
        </Card>
        <Card className="gap-0">
          <CardHeader className="pb-2">
            <div className="flex items-center">
              <PauseIcon className="text-amber-500 w-6 h-6 mr-2" />
              <CardTitle className="text-2xl font-semibold">4</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-gray-600 text-lg">
              On Break
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="gap-0">
          <CardHeader className="pb-2">
            <div className="flex items-center">
              <XCircleIcon className="text-muted-foreground w-6 h-6 mr-2" />
              <CardTitle className="text-2xl font-semibold">5</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-gray-600 text-lg">
              Offline
            </CardDescription>
          </CardContent>
        </Card>
        <Card className="gap-0">
          <CardHeader className="pb-2">
            <div className="flex items-center">
              <StarIcon className="text-blue-500 w-6 h-6 mr-2" />
              <CardTitle className="text-2xl font-semibold">4.7</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-gray-600 text-lg">
              Avg Rating
            </CardDescription>
          </CardContent>
        </Card>
      </div> */}
      <DriverList />
    </main>
  );
}
