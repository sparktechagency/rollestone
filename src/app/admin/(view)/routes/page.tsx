import Routes from "./routes";
import React, { Suspense } from "react";
export default function Page() {
  return (
    <main className="h-full w-full p-2">
      <Suspense>
        <Routes />
      </Suspense>
    </main>
  );
}
