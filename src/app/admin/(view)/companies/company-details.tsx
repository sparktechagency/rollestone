"use client";

import {
  CheckCircle2,
  DollarSign,
  MapPin,
  Truck,
  Users,
  XCircle,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { idk } from "@/lib/utils";

export default function CompanyDetails({ data }: { data: idk }) {
  const company = data || {};
  const user = company.user || {};

  return (
    <div>
      <div className="grid md:grid-cols-3 gap-6">
        {/* Left Column: Company Details and System Access */}
        <div className="md:col-span-2 grid gap-6">
          {/* Company Details Card */}
          <Card>
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Avatar className="size-20">
                <AvatarImage
                  src={user.avatar || "https://avatar.iran.liara.run/public"}
                  alt={company.company_name || "Company Logo"}
                />
                <AvatarFallback>
                  {company.company_name?.slice(0, 2).toUpperCase() || "N/A"}
                </AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-xl">
                    {company.company_name || "N/A"}
                  </CardTitle>
                  <Badge
                    className={
                      company.status === "active"
                        ? "bg-green-100 text-green-700 hover:bg-green-100"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-100"
                    }
                  >
                    {company.status || "N/A"}
                  </Badge>
                </div>
                <p className="text-sm text-gray-500">{user.address || "N/A"}</p>
              </div>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 pt-4 border-t">
              <div>
                <p className="text-sm font-semibold text-gray-700">
                  Company Email
                </p>
                <p className="text-sm text-gray-500">
                  {company.contact_email || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700">
                  Phone Number
                </p>
                <p className="text-sm text-gray-500">
                  {user.phone_number || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700">
                  Main Admin
                </p>
                <p className="text-sm text-gray-500">{user.email || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700">Subdomain</p>
                <p className="text-sm text-gray-500">
                  {company.subdomain || "N/A"}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* System Access Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">System Access</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
              {/* Example access rules, since your API doesn’t provide these */}
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span className="text-sm text-gray-700">Admin Dashboard</span>
              </div>
              <div className="flex items-center gap-2">
                <XCircle className="w-5 h-5 text-red-500" />
                <span className="text-sm text-gray-700">
                  Passenger Database
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span className="text-sm text-gray-700">
                  Trip & Route Management
                </span>
              </div>
              <div className="flex items-center gap-2">
                <XCircle className="w-5 h-5 text-red-500" />
                <span className="text-sm text-gray-700">
                  Notification System
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span className="text-sm text-gray-700">Fare Control</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span className="text-sm text-gray-700">Analytics Access</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Key Statistics (placeholder since no stats in API) */}
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Key Statistics</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="flex items-center gap-4 p-4 border rounded-lg">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Active Drivers</p>
                  <p className="text-lg font-semibold">N/A</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 border rounded-lg">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100 text-green-600">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Routes</p>
                  <p className="text-lg font-semibold">N/A</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 border rounded-lg">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-yellow-100 text-yellow-600">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Passengers (Month)</p>
                  <p className="text-lg font-semibold">N/A</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 border rounded-lg">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-100 text-purple-600">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Revenue (Month)</p>
                  <p className="text-lg font-semibold">N/A</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
