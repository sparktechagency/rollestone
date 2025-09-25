import React, { Suspense } from "react";

import MessageForm from "./message-form";

import { Loader2Icon } from "lucide-react";
import Recents from "./recents";
import MessageStats from "./message-stats";
import QuickMessage from "./quick-message";
export default function Page() {
  return (
    <main className="h-full w-full p-6">
      <MessageStats />
      <div className="flex justify-between items-center mt-6">
        <h3 className="text-2xl font-semibold">Messaging & Notifications</h3>
        <QuickMessage />
      </div>
      <MessageForm />
      <Suspense
        fallback={
          <div className={`flex justify-center items-center h-24 mx-auto`}>
            <Loader2Icon className={`animate-spin`} />
          </div>
        }
      >
        <Recents />
      </Suspense>
    </main>
  );
}
