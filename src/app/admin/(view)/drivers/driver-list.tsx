"use client";
import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  BusFrontIcon,
  ChevronLeftIcon,
  ChevronRight,
  EyeIcon,
  Loader2Icon,
  MessageSquareIcon,
  SearchIcon,
  SlidersVerticalIcon,
  StarIcon,
  UserPlusIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DriverProfilePopup from "./driver-prof";
import { useCookies } from "react-cookie";
import { useQuery } from "@tanstack/react-query";
import { getDriversApi } from "@/api/admin";
import { idk } from "@/lib/utils";
export default function DriverList() {
  const [cookies] = useCookies(["AdminToken"]);
  const [search, setSearch] = useState<string>("");
  const { data, isPending } = useQuery({
    queryKey: ["driver_list", search],
    queryFn: (): idk => {
      return getDriversApi({
        search,
        companyID: "1",
        token: cookies.AdminToken,
      });
    },
  });
  return (
    <>
      <Card className="bg-background rounded-md py-4!">
        <CardHeader className="flex flex-row justify-between items-center">
          <div className="">
            <CardTitle className="flex items-center gap-2 text-xl mb-2">
              <BusFrontIcon className="" /> All Drivers
            </CardTitle>
            <p className="text-sm">
              Manage drivers, schedules, and performance
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className=" border rounded-md flex items-center px-2">
              <SearchIcon className="text-muted-foreground size-5" />
              <Input
                className="bg-transparent border-0! outline-0! ring-0! shadow-none!"
                placeholder="Search routes"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
              />
            </div>
            {/* <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue
                  placeholder={
                    <p className="flex items-center gap-2">
                      <SlidersVerticalIcon />
                      All stauses
                    </p>
                  }
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">...</SelectItem>
              </SelectContent>
            </Select> */}
            <Button className="bg-blue-600 hover:bg-blue-600/90" asChild>
              <Link href={"/admin/drivers/add"}>
                <UserPlusIcon /> Add New Driver
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* <pre className="bg-gradient-to-br max-h-[80dvh] overflow-scroll fixed top-1/2 left-1/2 -translate-1/2 w-[90dvw] z-50 from-zinc-900/60 via-zinc-800/40 to-zinc-900/20 text-amber-400 rounded-xl p-6 shadow-lg overflow-x-auto text-sm leading-relaxed border border-zinc-700/20">
            <code className="whitespace-pre-wrap">
              {JSON.stringify(data.data, null, 2)}
            </code>
          </pre> */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Experience</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Stuff Number</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isPending ? (
                <TableRow>
                  <TableCell colSpan={6}>
                    <div className="flex justify-center items-center h-24">
                      <Loader2Icon className="animate-spin" />
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                data.data.map((x: idk) => (
                  <TableRow key={x.id}>
                    <TableCell>{x.user.name}</TableCell>
                    <TableCell>{x.experience_years} years</TableCell>
                    <TableCell>
                      <span className="flex items-center gap-2">
                        <StarIcon className="size-5" />
                        {x.rating}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge className="capitalize">{x.status}</Badge>
                    </TableCell>
                    <TableCell>{x.staff_number}</TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost">
                            <EyeIcon />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle></DialogTitle>
                          </DialogHeader>
                          <DriverProfilePopup data={x} />
                        </DialogContent>
                      </Dialog>
                      <Button variant="ghost">
                        <MessageSquareIcon />
                      </Button>
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
