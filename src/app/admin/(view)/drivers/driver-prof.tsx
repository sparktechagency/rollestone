import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { idk } from "@/lib/utils";
import React from "react";

const DriverProfilePopup = ({ data }: { data: idk }) => {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Avatar className="size-10">
            <AvatarImage
              src={data.user.avatar ?? "https://avatar.iran.liara.run/public"}
            />
            <AvatarFallback>UI</AvatarFallback>
          </Avatar>
          <div className="pl-2">
            <h2 className="text-lg font-semibold text-gray-800">
              {data.user.name}
            </h2>
            <p className="text-gray-500 text-xs">{data.user.email}</p>
          </div>
        </div>
        <div className="w-4 h-4 bg-green-500 rounded-full"></div>{" "}
        {/* Green dot */}
      </div>
      <div className="space-y-3 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Experience :</span>
          <span className="font-medium text-gray-800">
            {data.experience_years} years
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Rating :</span>
          <div className="flex items-center">
            <span className="text-yellow-400 text-xl mr-1">⭐</span>
            <span className="font-medium text-gray-800">{data.rating}</span>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Total Trips :</span>
          <span className="font-medium text-gray-800">1247</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">On Time Rate :</span>
          <span className="font-medium text-green-600">94%</span>
        </div>
      </div>

      <div className="flex justify-start space-x-4">
        <button className="p-3 border border-gray-300 rounded-lg flex items-center justify-center text-gray-700 hover:bg-gray-50">
          {/* Phone icon (you might use an actual SVG icon library like Heroicons) */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
            />
          </svg>
        </button>
        <button className="p-3 border border-gray-300 rounded-lg flex items-center justify-center text-gray-700 hover:bg-gray-50">
          {/* Chat icon (you might use an actual SVG icon library like Heroicons) */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default DriverProfilePopup;
