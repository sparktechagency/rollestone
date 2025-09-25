"use client";

import { useEffect, useState } from "react";

function getCurrentTimeString() {
  const now = new Date();
  let hours = now.getHours();
  const minutes = now.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12 || 12; // Convert 0 -> 12 in 12-hour format

  const pad = (num: number) => num.toString().padStart(2, "0");

  return `${hours}:${pad(minutes)} ${ampm}`;
}

export function useCurrentTime() {
  const [time, setTime] = useState(getCurrentTimeString());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(getCurrentTimeString());
    }, 1000); // Update every second for accuracy

    return () => clearInterval(interval);
  }, []);

  return time;
}
