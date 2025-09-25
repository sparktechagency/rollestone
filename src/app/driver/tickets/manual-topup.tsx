"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ConfirmTopup from "./confirm-topup";
import { Alert, AlertTitle } from "@/components/ui/alert";

export default function ManualTopup({ passenger }: { passenger?: string }) {
  const [amount, setAmount] = useState("0");

  const handleNumberClick = (num: string) => {
    if (amount === "0") {
      setAmount(num);
    } else {
      setAmount(amount + num);
    }
  };

  const handleClear = () => {
    setAmount("0");
  };

  const handleConfirm = () => {
    console.log("Confirmed amount:", amount);
  };

  const keypadNumbers = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
    [".", "0", "*"],
  ];
  if (!passenger) {
    return (
      <Alert>
        <AlertTitle>Select a passenger First</AlertTitle>
      </Alert>
    );
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="w-full border-blue-400 text-blue-600"
          size={"lg"}
          variant={"outline"}
        >
          Manual Amount
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-left text-lg font-medium">
            Enter Top Up Amount
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Amount Display */}
          <div className="border-2 border-blue-200 rounded-lg p-6 bg-blue-50/30">
            <div className="text-center">
              <div className="text-3xl font-semibold text-blue-600 mb-1">
                ${amount}
              </div>
              <div className="text-sm text-blue-600/70">Top Up Amount</div>
            </div>
          </div>

          {/* Numeric Keypad */}
          <div className="bg-gray-100 rounded-lg p-4">
            <div className="grid grid-cols-3 gap-3">
              {keypadNumbers.flat().map((num, index) => (
                <Button
                  key={index}
                  variant="secondary"
                  className="h-12 text-lg font-medium bg-white hover:bg-gray-50 border border-gray-200"
                  onClick={() => handleNumberClick(num)}
                >
                  {num}
                </Button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="secondary"
              className="h-12 bg-red-100 hover:bg-red-200 text-red-600 font-medium"
              onClick={handleClear}
            >
              CLEAR
            </Button>

            <ConfirmTopup passenger={passenger} amount={parseInt(amount)} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
