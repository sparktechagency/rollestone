"use client";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { IconCreditCardRefund, IconWheelchair } from "@tabler/icons-react";
import { BabyIcon, BikeIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import FarePopup from "./fare-popup";
import ManualTopupSec from "./manual-topop-sec";

export default function TicketTopup() {
  const [selectedItem, setSelectedItem] = useState<string | undefined>();
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  return (
    <Card className="w-full h-auto flex flex-col justify-between">
      <CardContent className="h-auto w-full grid grid-cols-3 gap-6 p-6">
        {ticketTypes.map((x, i) => (
          <Dialog key={i} open={dialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant={"outline"}
                onClick={() => {
                  setSelectedItem(x.title);
                  setDialogOpen(true);
                }}
                className={cn(
                  "h-auto! flex flex-col justify-center gap-4 border",
                  "border-blue-300"
                )}
              >
                <Avatar className="size-16">
                  <AvatarImage src={x.icon} />
                  <AvatarFallback>UI</AvatarFallback>
                </Avatar>
                <p className="text-2xl">{x.title}</p>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader className="border-b pb-2">
                <DialogTitle>Select Fare Quantity & Payment Method</DialogTitle>
              </DialogHeader>
              <FarePopup
                setDialogOpen={setDialogOpen}
                selectedItem={selectedItem}
              />
            </DialogContent>
          </Dialog>
        ))}
      </CardContent>
      <CardContent className="w-full grid grid-cols-3 gap-6">
        {ticketVariants.map((x, i) => (
          <Button
            key={i}
            variant={"outline"}
            className={cn(
              "h-auto! flex flex-col justify-center gap-4 border",
              "border-blue-300"
            )}
          >
            <div
              className={cn(
                "size-14 rounded-full flex justify-center items-center",
                bgColors[i] ?? "bg-fuchsia-200"
              )}
            >
              <x.icon className="size-8" />
            </div>
            <p className="text-2xl">{x.title}</p>
          </Button>
        ))}
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <ManualTopupSec />
        <Dialog>
          <DialogTrigger asChild>
            <Button className="flex gap-2 items-center text-lg h-14 w-full bg-rose-300 text-rose-700 font-bold">
              <IconCreditCardRefund className="size-6" />
              Refund
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Select Transaction to Refund</DialogTitle>
              <DialogDescription>
                Refunds are only available for transactions made within the last
                10 minutes.
              </DialogDescription>
            </DialogHeader>
            <div className=""></div>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}

const bgColors = ["bg-fuchsia-200", "bg-sky-200", "bg-amber-200"];
export const ticketTypes = [
  {
    title: "Adult",
    price: Number(4).toFixed(2),
    icon: "/avatar/adult.png",
  },
  {
    title: "Child",
    price: Number(3.5).toFixed(2),
    icon: "/avatar/child.png",
  },
  {
    title: "Family",
    price: Number(35).toFixed(2),
    icon: "/avatar/family.jpg",
  },
  {
    title: "Senior",
    price: Number(1.5).toFixed(2),
    icon: "/avatar/senior.png",
  },
];
const ticketVariants = [
  {
    title: "Bike",
    icon: BikeIcon,
  },
  {
    title: "Wheel chair",
    icon: IconWheelchair,
  },
  {
    title: "Stroller",
    icon: BabyIcon,
  },
];
