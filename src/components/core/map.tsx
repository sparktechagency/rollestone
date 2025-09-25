"use client";
import React, { ReactNode } from "react";
import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";

export default function MapBase({
  children,
  defaultCenter,
  className,
}: Readonly<{
  children?: ReactNode;
  className?: string;
  defaultCenter?: { lat: number; lng: number };
}>) {
  const api_key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";

  return (
    <APIProvider apiKey={api_key}>
      <Map
        className={className} // ✅ apply className
        defaultCenter={defaultCenter ?? { lat: -41.2865, lng: 174.7762 }}
        defaultZoom={12}
        disableDefaultUI={true}
      >
        {children}
      </Map>
    </APIProvider>
  );
}
