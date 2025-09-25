"use client";
import React from "react";

type Stop = {
  id: number;
  route_id: number;
  location_name: string;
  stop_order: number;
  minutes_from_start: number;
  latitude: string;
  longitude: string;
  created_at: string;
  updated_at: string;
};

interface TimelineProps {
  stops: Stop[];
}

const Timeline: React.FC<TimelineProps> = ({ stops }) => {
  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-gray-200"></div>

      {/* Timeline items */}
      <div className="space-y-8">
        {stops.map((stop, index) => {
          // dynamic alignment: first=start, last=end, rest=center
          const alignment =
            index === 0
              ? "items-start"
              : index === stops.length - 1
              ? "items-end"
              : "items-center";

          return (
            <div key={index} className={`relative flex ${alignment} gap-4`}>
              <div className="w-4 h-4 bg-green-500 rounded-full relative z-10"></div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm">{stop.location_name}</h4>
                <p className="text-sm text-muted-foreground">
                  Scheduled: {stop.minutes_from_start} minutes
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Timeline;
