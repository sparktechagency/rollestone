"use client";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  EditIcon,
  EyeIcon,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import CompanyDetails from "./company-details";
import { useQuery } from "@tanstack/react-query";
import { getCompaniesApi } from "@/api/admin";
import { useCookies } from "react-cookie";
import { idk } from "@/lib/utils";
export default function CompanyTable() {
  const [{ token }] = useCookies(["token"]);

  const { data, isPending } = useQuery({
    queryKey: ["companies"],
    queryFn: (): idk => {
      return getCompaniesApi({ companyID: "1", token });
    },
  });

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Company</TableHead>
            <TableHead>Admin</TableHead>
            <TableHead>Subdomain</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!isPending &&
            data.data.map((x: idk) => (
              <TableRow key={x.id}>
                <TableCell>
                  <div className="w-fit flex gap-2">
                    <Avatar className="border-2 size-10 border-blue-400">
                      <AvatarImage
                        src={
                          x.user.avatar ??
                          "https://avatar.iran.liara.run/public"
                        }
                      />
                      <AvatarFallback>UI</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col justify-start items-start">
                      <h4 className="font-semibold">{x.company_name}</h4>
                      <p className="text-xs">{x.contact_email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{x.user.email}</TableCell>
                <TableCell>{x.subdomain}</TableCell>
                <TableCell className="text-green-600">
                  <Badge variant={"success"}>{x.status}</Badge>
                </TableCell>
                <TableCell className="font-bold">
                  <Button variant={"ghost"} asChild>
                    <Link href={"/admin/companies/edit"}>
                      <EditIcon />
                    </Link>
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant={"ghost"}>
                        <EyeIcon />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="min-w-[60dvw]">
                      <DialogHeader className="border-b pb-2">
                        <DialogTitle>Company Details</DialogTitle>
                      </DialogHeader>
                      <CompanyDetails data={x} />
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      <div className=" flex items-center justify-center mt-8 gap-2">
        <Button variant={"outline"}>
          <ChevronLeftIcon />
        </Button>
        <Button variant={"outline"}>1</Button>
        <Button variant={"outline"}>
          <ChevronRightIcon />
        </Button>
      </div>
    </>
  );
}
