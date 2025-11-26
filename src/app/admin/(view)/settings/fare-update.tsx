"use client";
import { updateSettingsApi } from "@/api/admin";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { idk } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { toast } from "sonner";

export default function FareUpdate({ current }: { current: number }) {
  const [currentVal, setCurrentVal] = useState<number>(0);
  const [{ AdminToken }] = useCookies(["AdminToken"]);
  const qCl = useQueryClient();
  const { mutate } = useMutation({
    mutationKey: ["updateSettings"],
    mutationFn: (data: idk) => {
      return updateSettingsApi({
        body: data,
        companyID: "1",
        token: AdminToken,
      });
    },
    onError: (err) => {
      toast.error(err.message ?? "Failed to complete this request");
    },
    onSuccess: (res: idk) => {
      toast.success(res.message ?? "Successfully updated the settings");
      qCl.invalidateQueries({
        queryKey: ["settings"],
      });
    },
  });
  useEffect(() => {
    setCurrentVal(current);
  }, [current]);

  return (
    <>
      <div className="w-full">
        <Input
          placeholder="Fare rule"
          type="number"
          min={1}
          step="0.01"
          value={currentVal}
          onChange={(e) => {
            const val = parseFloat(e.target.value);
            if (!isNaN(val)) {
              setCurrentVal(Number(val.toFixed(2)));
            }
          }}
        />
      </div>
      <DialogFooter>
        <Button
          onClick={() => {
            if (!currentVal || typeof currentVal === "string") {
              toast.error("Please input a valid amount");
              return;
            }
            mutate({
              fare_rules: String(currentVal),
            });
          }}
        >
          Update
        </Button>
      </DialogFooter>
    </>
  );
}
