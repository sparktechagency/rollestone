import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Building, Camera } from "lucide-react";

export default function CompanySetupForm() {
  return (
    <Card className="w-full mt-6 mx-auto shadow-lg">
      <CardContent className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3 pb-4 border-b">
          <Building className="w-6 h-6 text-gray-700" />
          <h2 className="text-xl font-semibold text-gray-900">Company Setup</h2>
        </div>

        {/* Company Logo Upload */}
        <div className="flex items-center gap-6">
          <div className="relative">
            <Avatar className="size-24">
              <AvatarImage src={"https://avatar.iran.liara.run/public"} />
              <AvatarFallback>UI</AvatarFallback>
            </Avatar>
            <Button
              variant="secondary"
              size="icon"
              className="absolute bottom-0 right-0 rounded-full w-8 h-8 border-2 border-white"
              aria-label="Upload company logo"
            >
              <Camera className="w-4 h-4" />
            </Button>
          </div>
          <div className="space-y-1">
            <p className="text-base font-medium text-gray-900">
              upload a Company logo
            </p>
            <p className="text-sm text-gray-500">PNG,JPG,GIF up to 10MB</p>
          </div>
        </div>

        {/* Company Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label
              htmlFor="company-name"
              className="text-base font-medium text-gray-900"
            >
              Company Name
            </Label>
            <Input id="company-name" placeholder="e.g. Metro Transit Inc." />
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="company-email"
              className="text-base font-medium text-gray-900"
            >
              Company Email
            </Label>
            <Input id="company-email" placeholder="@gmail.com" />
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="phone-number"
              className="text-base font-medium text-gray-900"
            >
              Phone Number
            </Label>
            <Input id="phone-number" placeholder="+1555123456" />
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="address"
              className="text-base font-medium text-gray-900"
            >
              Address
            </Label>
            <Input id="address" placeholder="123 transit Ave,metropolis" />
          </div>
        </div>

        <Separator className="my-6" />

        {/* Main Admin Credentials */}
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Main Admin Credentials
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label
              htmlFor="admin-email"
              className="text-base font-medium text-gray-900"
            >
              Main Admin Username/Email
            </Label>
            <Input id="admin-email" placeholder="liam@gmail.com" />
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="password"
              className="text-base font-medium text-gray-900"
            >
              Password
            </Label>
            <Input id="password" type="password" placeholder="**********" />
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="confirm-password"
              className="text-base font-medium text-gray-900"
            >
              Confirm Password
            </Label>
            <Input
              id="confirm-password"
              type="password"
              placeholder="**********"
            />
          </div>
        </div>

        {/* Create Unique Subdomain */}
        <div className="space-y-2">
          <Label
            htmlFor="subdomain"
            className="text-base font-medium text-gray-900"
          >
            Create Unique Subdomain (Optional)
          </Label>
          <div className="flex rounded-md shadow-sm">
            <Input
              id="subdomain"
              className="flex-1 rounded-r-none focus-visible:ring-0 focus-visible:ring-offset-0"
              placeholder="Metro Transit"
            />
            <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 bg-gray-50 text-gray-500 text-sm">
              .companyname.app
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
