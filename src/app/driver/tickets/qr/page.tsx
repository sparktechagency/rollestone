"use client";
import { Scanner } from "@yudiel/react-qr-scanner";

export default function Page() {
  return (
    <div>
      <Scanner
        onScan={(result) => console.log(result)}
        onError={(error: any) => console.log(error?.message)}
      />
    </div>
  );
}
