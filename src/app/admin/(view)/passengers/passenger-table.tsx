"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  ChevronLeftIcon,
  ChevronRight,
  CoinsIcon,
  EyeIcon,
  Loader2Icon,
  MonitorCogIcon,
  SearchIcon,
  UserPlus2Icon,
  Users2Icon,
} from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import PassengerDetails from "./pass-details";
import { useQuery } from "@tanstack/react-query";
import { getPassengersApi } from "@/api/admin";
import { useCookies } from "react-cookie";
import { idk } from "@/lib/utils";
import CreateUser from "./create-user";
import TopUp from "./top-up";
import PassengerState from "./passenger-state";
export default function PassengerTable() {
  const [search, setSearch] = useState<string>("");
  const [cookies] = useCookies(["AdminToken"]);
  const { data, isPending } = useQuery({
    queryKey: ["passengers"],
    queryFn: (): idk => {
      return getPassengersApi({ companyID: "1", token: cookies.AdminToken });
    },
  });
  return (
    <>
      <Card className="bg-background rounded-md py-4! mt-6">
        <CardHeader className="flex flex-row justify-between items-center">
          <div className="">
            <CardTitle className="flex items-center gap-2 text-xl mb-2">
              <Users2Icon className="" /> Search & Manage Users
            </CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <div className=" border rounded-md flex items-center px-2">
              <SearchIcon className="text-muted-foreground size-5" />
              <Input
                className="bg-transparent border-0! outline-0! ring-0! shadow-none!"
                placeholder="Search passengers"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
              />
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus2Icon />
                  Create User
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New User</DialogTitle>
                </DialogHeader>
                <CreateUser />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Card Number</TableHead>
                <TableHead>Balace</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Rider Type</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isPending ? (
                <TableRow>
                  <TableCell
                    className={`flex justify-center items-center h-24 mx-auto`}
                  >
                    <Loader2Icon className={`animate-spin`} />
                  </TableCell>
                </TableRow>
              ) : (
                data.data.map((x: idk) => (
                  <TableRow key={x.id}>
                    <TableCell>{x.name}</TableCell>
                    <TableCell>{x.email}</TableCell>
                    <TableCell>
                      {x.card_number ? `**** ${x.card_number}` : "N / A"}
                    </TableCell>
                    <TableCell className="font-bold">
                      {x.balance ? `$${x.balance}` : "N/A"}
                    </TableCell>
                    <TableCell className="flex items-center gap-2">
                      <Badge variant={"success"}>{x.status}</Badge>
                    </TableCell>
                    <TableCell className="">{x.rider_type}</TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant={"ghost"}>
                            <EyeIcon />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle></DialogTitle>
                          </DialogHeader>
                          <PassengerDetails data={x} />
                        </DialogContent>
                      </Dialog>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant={"ghost"}>
                            <CoinsIcon />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Top Up Balance</DialogTitle>
                          </DialogHeader>
                          <TopUp id={x.id} />
                        </DialogContent>
                      </Dialog>
                      {/* <Dialog>
                        <DialogTrigger asChild>
                          <Button variant={"ghost"}>
                            <MonitorCogIcon />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Statement for {x.name}</DialogTitle>
                          </DialogHeader>
                          <PassengerState data={x} />
                        </DialogContent>
                      </Dialog> */}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <div className=" flex items-center justify-center mt-8 gap-2">
        <Button variant={"outline"}>
          <ChevronLeftIcon />
        </Button>
        <Button variant={"outline"}>1</Button>
        <Button variant={"outline"}>2</Button>
        <Button variant={"outline"}>3</Button>
        <Button variant={"outline"}>
          <ChevronRight />
        </Button>
      </div>
    </>
  );
}
