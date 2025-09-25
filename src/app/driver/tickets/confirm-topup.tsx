import { getPassengerByIdApi, topUpPassengerWalletApi } from "@/api/admin";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUser } from "@/context/user-context";
import { idk } from "@/lib/utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useCookies } from "react-cookie";
import { toast } from "sonner";
import SuccessCard from "./success-card";

export default function ConfirmTopup({
  passenger,
  amount,
}: {
  passenger: string;
  amount: number;
}) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmed, setConfirmed] = useState<boolean>(false);
  const [{ token }] = useCookies(["token"]);
  const { user } = useUser();
  const router = useRouter();
  const { data, isPending } = useQuery({
    queryKey: ["passenger"],
    queryFn: (): idk => {
      return getPassengerByIdApi({
        id: passenger,
        companyID: String(user?.company_id),
        token,
      });
    },
  });

  const { mutate } = useMutation({
    mutationKey: ["topup"],
    mutationFn: () => {
      return topUpPassengerWalletApi({
        passengerId: passenger,
        token,
        companyID: String(user?.company_id),
        body: { amount },
      });
    },
    onError: (err) => {
      toast.error(err.message ?? "Failed to complete this request");
    },
    onSuccess: (res: idk) => {
      setConfirmed(true);

      toast.success(res.message ?? "Top Up was successful");
    },
  });
  return (
    <Dialog open={dialogOpen}>
      <Button
        className="h-12 w-full bg-green-500 hover:bg-green-600 text-white font-medium"
        disabled={!amount || confirmed}
        onClick={() => {
          setDialogOpen(true);
        }}
      >
        {confirmed ? "DONE" : "CONFIRM"}
      </Button>
      <DialogContent>
        {confirmed ? (
          <>
            <SuccessCard />
            <Button
              variant={"outline"}
              onClick={() => {
                setDialogOpen(false);
              }}
            >
              Go back
            </Button>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>RX Card Top Up</DialogTitle>
            </DialogHeader>
            <div className="">
              <div className="rounded-md p-4 bg-blue-50 w-full flex flex-row justify-between items-center text-blue-600">
                {!isPending && (
                  <>
                    <h4 className="text-sm font-bold">{data.data.name}</h4>
                    <div className="flex flex-col gap-2 items-end">
                      <h4 className="text-xl">${Number(amount).toFixed(2)}</h4>
                      <p className="text-xs font-semibold">Top Up Amount</p>
                    </div>
                  </>
                )}
              </div>
              <h3 className="text-sm font-semibold text-center mt-8 mb-4">
                Select Payment Method
              </h3>
              <Button
                className="h-14 w-full bg-green-600 hover:bg-green-600/90"
                onClick={() => {
                  mutate();
                }}
              >
                $ Cash
              </Button>

              <DialogClose asChild>
                <Button className="mt-2 h-12 w-full" variant={"outline"}>
                  Back to Amount
                </Button>
              </DialogClose>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
