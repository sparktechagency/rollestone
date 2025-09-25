"use client";
import { useEffect, useState } from "react";
import Clock from "./sub-ui/clock";

export function SiteHeader() {
  const [speed, setSpeed] = useState(0);
  useEffect(() => {
    let velocity = 0;
    let lastTime = Date.now();

    const handleMotion = (e: DeviceMotionEvent) => {
      if (e.acceleration) {
        const now = Date.now();
        const dt = (now - lastTime) / 1000; // seconds
        lastTime = now;

        const acc =
          Math.sqrt(
            (e.acceleration.x ?? 0) ** 2 +
              (e.acceleration.y ?? 0) ** 2 +
              (e.acceleration.z ?? 0) ** 2
          ) - 9.81; // remove gravity

        velocity += acc * dt; // integrate to velocity
        const speedKmh = Math.max(0, velocity * 3.6); // convert m/s → km/h
        setSpeed(speedKmh);
      }
    };

    window.addEventListener("devicemotion", handleMotion);
    return () => window.removeEventListener("devicemotion", handleMotion);
  }, []);

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="grid grid-cols-5 items-center w-full gap-1 px-4 lg:gap-2 lg:px-6 h-full text-lg">
        <Clock />
        <p className="font-semibold">
          <span className="text-blue-500">{speed.toFixed(1)}</span> km/h
        </p>
        <p className="text-red-700 font-semibold">Bus Not Selected</p>
        <p className="font-semibold">0/50</p>
        <p className="text-red-700 font-semibold">Trip not Selected</p>
      </div>
    </header>
  );
}
