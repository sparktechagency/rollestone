"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DownloadIcon, Loader2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { getCashReconciliationApi } from "@/api/admin";
import { useCookies } from "react-cookie";
import { idk } from "@/lib/utils";

export default function CashCouncil() {
  const [{ AdminToken }] = useCookies(["AdminToken"]);
  const [selectedDate, setSelectedDate] = useState("2025-08-20"); // default

  const { data, isPending } = useQuery({
    queryKey: ["cash_reco", selectedDate], // refetch on date change
    queryFn: (): idk => {
      return getCashReconciliationApi({
        date: selectedDate,
        companyID: "1",
        token: AdminToken,
      });
    },
  });

  return (
    <Card className="bg-background rounded-md py-4! col-span-2">
      <CardHeader className="flex flex-row justify-between items-center">
        <div>
          <CardTitle className="flex items-center gap-2 text-xl mb-2">
            Cash Reconciliation
          </CardTitle>
          <p className="text-sm">
            Reconcile driver cash collections against sales data.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
          <Button className="bg-blue-500 hover:bg-blue-500/80">
            <DownloadIcon />
            Download Report
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isPending ? (
          <div className="flex justify-center items-center h-24 mx-auto">
            <Loader2Icon className="animate-spin" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Driver</TableHead>
                <TableHead>Cash Processed</TableHead>
                <TableHead>Recieved</TableHead>
                <TableHead>Difference</TableHead>
                <TableHead>Checked</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.data?.map(
                (x: {
                  date: string;
                  driver_id: number;
                  driver_name: string;
                  cash_processed: number;
                  wallet_collection: string;
                  received_cash: number;
                  difference: number;
                  is_checked: boolean;
                }) => (
                  <TableRow key={x.driver_id}>
                    <TableCell>{x.date}</TableCell>
                    <TableCell>{x.driver_name}</TableCell>
                    <TableCell>${x.cash_processed}</TableCell>
                    <TableCell>
                      <div className="p-2 w-fit border border-green-600 text-green-600 flex justify-center items-center rounded-md font-semibold">
                        ${x.wallet_collection}
                      </div>
                    </TableCell>
                    <TableCell
                      className={`font-bold ${
                        x.difference === null || x.difference === undefined
                          ? "text-gray-500"
                          : x.difference >= 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {x.difference === null || x.difference === undefined
                        ? "N/A"
                        : `$${x.difference}`}
                    </TableCell>

                    <TableCell className="flex items-center gap-2">
                      {x.is_checked ? (
                        <Badge variant="secondary">Checked</Badge>
                      ) : (
                        <Badge variant="destructive">Pending</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
