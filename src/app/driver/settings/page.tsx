"use client";
import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
// You'll need to import your icons, e.g., from 'lucide-react'
// import { Settings, Sun, Volume2 } from 'lucide-react';

export default function Page() {
  const [brightness, setBrightness] = useState(75);
  const [volume, setVolume] = useState(50);

  return (
    <main className="h-full w-full flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-md p-6 w-2/3">
        {/* Header */}
        <div className="flex items-center mb-6">
          {/* Replace with your settings icon component */}
          <span className="text-2xl mr-3">=</span>{" "}
          {/* Placeholder for settings icon */}
          <h2 className="text-xl font-semibold text-gray-800">
            Display & System Settings
          </h2>
        </div>

        {/* Screen Brightness Slider */}
        <div className="mb-4">
          <div className="flex items-center mb-2">
            {/* Replace with your sun icon component */}
            <span className="text-xl mr-2">☀️</span>{" "}
            {/* Placeholder for sun icon */}
            <label htmlFor="brightness-slider" className="text-gray-700">
              Screen Brightness
            </label>
          </div>
          <div className="flex items-center">
            <Slider
              id="brightness-slider"
              defaultValue={[brightness]}
              max={100}
              step={1}
              onValueChange={(value) => setBrightness(value[0])}
              className="w-full"
              // You might need more specific styling for the track and thumb
              // Check Shadcn Slider documentation for advanced customization with CSS variables or direct Tailwind
            />
            <span className="ml-4 w-10 text-right text-gray-700">
              {brightness}%
            </span>
          </div>
        </div>

        {/* System Volume Slider */}
        <div className="mb-6">
          <div className="flex items-center mb-2">
            {/* Replace with your volume icon component */}
            <span className="text-xl mr-2">🔊</span>{" "}
            {/* Placeholder for volume icon */}
            <label htmlFor="volume-slider" className="text-gray-700">
              System Volume
            </label>
          </div>
          <div className="flex items-center">
            <Slider
              id="volume-slider"
              defaultValue={[volume]}
              max={100}
              step={1}
              onValueChange={(value) => setVolume(value[0])}
              className="w-full "
              // More specific styling may be needed
            />
            <span className="ml-4 w-10 text-right text-gray-700">
              {volume}%
            </span>
          </div>
        </div>

        {/* Test Volume Button */}
        <Button
          className="w-full py-2 px-4 rounded-md bg-blue-100 text-blue-700 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          onClick={() => alert("Playing test volume!")}
        >
          Test Volume
        </Button>
      </div>
    </main>
  );
}
