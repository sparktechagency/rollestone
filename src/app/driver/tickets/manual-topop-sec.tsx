"use client";
import React, { useState } from "react";
import { Loader2Icon, PlusIcon, SearchIcon } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import ManualTopup from "./manual-topup";
import { Button } from "@/components/ui/button";
import { cn, idk } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getPassengersApi, topUpPassengerWalletApi } from "@/api/admin";
import { toast } from "sonner";
import { useCookies } from "react-cookie";
import { useUser } from "@/context/user-context";
import SuccessCard from "./success-card";

export default function ManualTopupSec() {
  const [topupAmm, setTopupAmm] = useState<number | null>(null);
  const [passeng, setPasseng] = useState<string | undefined>();
  const [{ token }] = useCookies(["token"]);
  const [searcher, setSearcher] = useState<string>("");
  const { user } = useUser();
  const [confirmed, setConfirmed] = useState(false);
  const handleTopupSelect = (amount: number) => {
    setTopupAmm((prev) => (prev === amount ? null : amount));
  };

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["passengers", searcher],
    queryFn: (): idk => {
      return getPassengersApi({
        companyID: String(user?.company_id),
        token,
        search: searcher,
      });
    },
  });

  const { mutate, isPending: submitting } = useMutation({
    mutationKey: ["topup"],
    mutationFn: () => {
      return topUpPassengerWalletApi({
        passengerId: passeng!,
        token,
        companyID: String(user?.company_id),
        body: { amount: topupAmm! },
      });
    },
    onError: (err) => {
      toast.error(err.message ?? "Failed to complete this request");
    },
    onSuccess: (res: idk) => {
      setTopupAmm(0);
      setPasseng(undefined);
      setConfirmed(true);
      toast.success(res.message ?? "Top Up was successful");
    },
  });
  return (
    <Dialog
      onOpenChange={() => {
        setInterval(() => {
          setConfirmed(false);
        }, 1500);
      }}
    >
      <DialogTrigger asChild>
        <Button className="flex gap-2 items-center text-lg h-14 w-full bg-green-300 hover:bg-green-400/90 text-green-700 font-bold">
          <PlusIcon className="size-6" />
          Top Up
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>RX Card Top Up</DialogTitle>
        </DialogHeader>
        {confirmed ? (
          <SuccessCard />
        ) : (
          <>
            <div className="w-full">
              <div className="rounded-sm flex justify-start items-center gap-2 px-2 bg-blue-50">
                <SearchIcon className="size-4 text-blue-500" />
                <Input
                  value={searcher}
                  onChange={(e) => {
                    setSearcher(e.target.value);
                  }}
                  className="border-none! shadow-none! ring-0! outline-0! bg-transparent!"
                  placeholder="Search by serial"
                />
              </div>
            </div>
            {isError ? (
              <Alert>
                <AlertTitle>Something went wrong!</AlertTitle>
                <AlertDescription>{error.message}</AlertDescription>
              </Alert>
            ) : (
              <Select
                onValueChange={(e) => {
                  setPasseng(e);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Passengers" />
                </SelectTrigger>
                <SelectContent>
                  {!isPending &&
                    data.data.map((x: { name: string; id: string }) => (
                      <SelectItem value={x.id} key={x.id}>
                        {x.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            )}
            <h4 className="text-center font-semibold text-sm">
              Select Top Up Amount
            </h4>
            <div className="grid grid-cols-3 gap-6">
              {[10, 50, 100].map((amount) => (
                <Button
                  key={amount}
                  variant={topupAmm === amount ? "default" : "success"}
                  className={cn(
                    "h-16 text-lg",
                    topupAmm === amount
                      ? "border-blue-600 bg-green-950 hover:bg-green-950/90"
                      : ""
                  )}
                  onClick={() => handleTopupSelect(amount)}
                >
                  ${amount}
                </Button>
              ))}
            </div>
            <DialogFooter className="flex flex-col! justify-center items-center gap-4">
              {!topupAmm ? (
                <ManualTopup passenger={passeng!} />
              ) : (
                <>
                  <Button
                    className="h-12 w-full bg-green-500 hover:bg-green-600 text-white font-medium"
                    onClick={() => {
                      mutate();
                    }}
                    disabled={submitting}
                  >
                    {submitting ? (
                      <Loader2Icon className="animate-spin" />
                    ) : (
                      "CONFIRM"
                    )}
                  </Button>
                </>
              )}
              <DialogClose asChild>
                <Button variant="outline" className="w-full">
                  Back To Scan
                </Button>
              </DialogClose>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
