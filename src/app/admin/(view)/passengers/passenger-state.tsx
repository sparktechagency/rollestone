import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { idk } from "@/lib/utils";

import { PrinterIcon } from "lucide-react";
import React from "react";

export default function PassengerState({ data }: { data: idk }) {
  return (
    <>
      <div className="w-full">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Balance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      <DialogFooter>
        <Button>
          <PrinterIcon />
          Print Statement
        </Button>
      </DialogFooter>
    </>
  );
}
