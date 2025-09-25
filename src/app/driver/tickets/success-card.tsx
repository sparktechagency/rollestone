import { CheckIcon } from "lucide-react";
import React from "react";

export default function SuccessCard() {
  return (
    <div>
      <div className="w-full py-6 bg-green-100 rounded-md flex flex-col justify-center items-center gap-4">
        <div className="size-24 bg-green-600 flex items-center justify-center rounded-full text-background">
          <CheckIcon className="size-18" />
        </div>
        <h2 className="text-xl font-semibold text-center text-green-700">
          Payment successful
        </h2>
        <h2 className="text-lg text-center text-green-700">
          Transaction Completed
        </h2>
      </div>
    </div>
  );
}
