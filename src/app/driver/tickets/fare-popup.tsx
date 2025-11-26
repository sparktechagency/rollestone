"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2Icon, MinusIcon, PlusIcon } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getPassengersApi, topUpPassengerWalletApi } from "@/api/admin";
import { useUser } from "@/context/user-context";
import { useCookies } from "react-cookie";
import { idk } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useRouter } from "next/navigation";

export default function FarePopup({
  selectedItem,
  setDialogOpen,
}: {
  selectedItem?: string;
  setDialogOpen: idk;
}) {
  const [amm, setAmm] = useState<number | undefined>();
  const [passeng, setPasseng] = useState<string | undefined>();
  const [submitting, setSubmitting] = useState<boolean>(false);
  const { user } = useUser();
  const navig = useRouter();
  const [{ token }] = useCookies(["token"]);
  const ticketTypes = [
    { title: "Adult", price: 4.0, icon: "/avatar/adult.png" },
    { title: "Child", price: 3.5, icon: "/avatar/child.png" },
    { title: "Family", price: 35.0, icon: "/avatar/family.jpg" },
    { title: "Senior", price: 1.5, icon: "/avatar/senior.png" },
  ];

  const [fareList, setFareList] = useState<
    { title: string; count: number; price: number }[]
  >([
    // { title: "Adult", count: 1, price: 4.0 }
  ]);
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["passengers"],
    queryFn: (): idk => {
      return getPassengersApi({
        companyID: String(user?.company_id),
        token,
      });
    },
  });
  const { mutate } = useMutation({
    mutationKey: ["topup"],
    mutationFn: () => {
      return topUpPassengerWalletApi({
        passengerId: passeng!,
        token,
        companyID: String(user?.company_id),
        body: { amount: amm! },
      });
    },
    onError: (err) => {
      toast.error(err.message ?? "Failed to complete this request");
    },
    onSuccess: (res: idk) => {
      setAmm(undefined);
      setPasseng(undefined);
      setSubmitting(true);
      setDialogOpen(false);
      toast.success(res.message ?? "Top Up was successful");
    },
  });

  useEffect(() => {
    if (!selectedItem) return;

    const curr = ticketTypes.find((x) => x.title === selectedItem);

    if (curr) {
      setFareList((prev) => {
        const existing = prev.find((x) => x.title === curr.title);

        if (existing) {
          // update count if already exists
          return prev.map((x) =>
            x.title === curr.title ? { ...x, count: x.count } : x
          );
        }

        // else add new one
        return [...prev, { title: curr.title, count: 1, price: curr.price }];
      });
    }
  }, [selectedItem]);

  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);

  const addFareType = (type: { title: string; price: number }) => {
    setFareList((prev) => [...prev, { ...type, count: 1 }]);
  };

  const increment = (title: string) => {
    setFareList((prev) =>
      prev.map((item) =>
        item.title === title ? { ...item, count: item.count + 1 } : item
      )
    );
  };

  const decrement = (title: string) => {
    setFareList((prev) =>
      prev
        .map((item) =>
          item.title === title ? { ...item, count: item.count - 1 } : item
        )
        .filter((item) => item.count > 0)
    );
  };

  const totalFare = fareList
    .reduce((acc, item) => acc + item.count * item.price, 0)
    .toFixed(2);

  const addedTitles = fareList.map((f) => f.title);

  const handlePaymentSelect = (method: string) => {
    setPaymentMethod((prev) => (prev === method ? null : method));
  };

  return (
    <>
      {/* {!isPending && (
        <pre className="bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 text-amber-400 rounded-xl p-6 shadow-lg overflow-x-auto text-sm leading-relaxed border border-zinc-700">
          <code className="whitespace-pre-wrap">
            {JSON.stringify(data, null, 2)}
          </code>
        </pre>
      )} */}
      <div className="p-4 space-y-4 w-full mx-auto">
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
        {fareList.map((fare, index) => (
          <Card key={index} className="p-0!">
            <CardContent className="flex justify-between items-center py-4 bg-blue-50 rounded-lg">
              <div>
                <div className="font-semibold">{fare.title}</div>
                <div className="text-sm text-gray-500">
                  {/* ${fare.price.toFixed(2)} */}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => decrement(fare.title)}
                >
                  <MinusIcon className="w-4 h-4" />
                </Button>
                <div className="w-6 text-center font-medium">{fare.count}</div>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => increment(fare.title)}
                >
                  <PlusIcon className="w-4 h-4" />
                </Button>
                {/* <div className="text-green-600 font-semibold">
                  ${(fare.count * fare.price).toFixed(2)}
                </div> */}
              </div>
            </CardContent>
          </Card>
        ))}

        <Dialog>
          <DialogTrigger asChild>
            {ticketTypes.filter((t) => !addedTitles.includes(t.title))
              .length !== 0 && (
              <div className="border-2 border-dashed rounded-lg p-2 text-center text-blue-500 cursor-pointer">
                + Add Fare Type
              </div>
            )}
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Select Fare Type</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              {ticketTypes
                .filter((t) => !addedTitles.includes(t.title))
                .map((t, i) => (
                  <Button
                    key={i}
                    variant="outline"
                    onClick={() => addFareType(t)}
                    className="flex flex-col items-center py-4 h-auto!"
                  >
                    <Image
                      height={100}
                      width={100}
                      src={t.icon}
                      alt={t.title}
                      className="w-10 h-10 rounded-full mb-2"
                    />
                    <span className="font-semibold">{t.title}</span>
                    {/* <span className="text-sm text-gray-500">
                      ${t.price.toFixed(2)}
                    </span> */}
                  </Button>
                ))}
              {ticketTypes.filter((t) => !addedTitles.includes(t.title))
                .length === 0 && (
                <div className="col-span-2 text-center text-sm text-gray-400">
                  All fare types added.
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>

        <Input
          placeholder="Top Up amount"
          className="bg-background"
          min={1}
          value={amm ? String(amm) : ""}
          onChange={(e) => {
            setAmm(parseInt(e.target.value));
          }}
        />

        <div className="text-center text-lg font-semibold">Payment Method</div>
        <div className="grid grid-cols-3 gap-2">
          {["Cash", "RX Card", "Complimentary"].map((method, i) => (
            <Button
              key={i}
              variant={paymentMethod === method ? "success" : "outline"}
              className="flex flex-col items-center h-auto py-6"
              onClick={() => {
                if (method === "RX Card") {
                  navig.push(`/driver/tickets/qr`);
                } else {
                  handlePaymentSelect(method);
                }
              }}
            >
              <span className="text-2xl">
                {method === "Cash" ? "$" : method === "RX Card" ? "📇" : "🎁"}
              </span>
              <span>{method}</span>
            </Button>
          ))}
        </div>
      </div>

      <DialogFooter className="grid grid-cols-2 gap-6">
        <DialogClose
          asChild
          onClick={() => {
            setDialogOpen(false);
          }}
        >
          <Button variant={"outline"}>Cancel</Button>
        </DialogClose>
        <Button
          className="bg-blue-500 hover:bg-blue-600/90 cursor-pointer"
          onClick={() => {
            setSubmitting(true);
            try {
              mutate();
            } catch (error) {
              console.error(error);
              toast.error("Something went wrong");
            } finally {
              setSubmitting(false);
            }
          }}
          disabled={submitting}
        >
          {submitting ? (
            <Loader2Icon className="animate-spin" />
          ) : (
            "Confirm & Proceed"
          )}
        </Button>
      </DialogFooter>
    </>
  );
}
