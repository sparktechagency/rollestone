"use client";
import { topUpPassengerWalletApi } from "@/api/admin";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { idk } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { useCookies } from "react-cookie";
import { toast } from "sonner";

export default function TopUp({
  id,
  onClose,
}: {
  id: string;
  onClose: () => void;
}) {
  console.log(id);

  const [amm, setAmm] = useState<string>("0");
  const [{ token }] = useCookies(["token"]);
  const { mutate } = useMutation({
    mutationKey: ["top_up"],
    mutationFn: () => {
      return topUpPassengerWalletApi({
        passengerId: id,
        companyID: "1",
        body: { amount: parseFloat(amm) },
        token,
      });
    },
    onError: (err) => {
      toast.error(err.message ?? "Failed to complete this request");
    },
    onSuccess: (res: idk) => {
      toast.success(res.message ?? "Top Up Successful");
      onClose();
    },
  });
  return (
    <>
      <div className="space-y-2">
        <Label>Amount ($)</Label>
        <Input
          type="number"
          min={1}
          placeholder="e.g 200"
          value={amm}
          onChange={(e) => {
            setAmm(String(e.target.value));
          }}
        />
      </div>
      <DialogFooter>
        <Button
          className="cursor-pointer"
          onClick={() => {
            mutate();
          }}
        >
          Confirm Topup
        </Button>
      </DialogFooter>
    </>
  );
}
