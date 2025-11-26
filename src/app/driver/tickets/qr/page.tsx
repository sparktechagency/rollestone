"use client";
import { scanQRApi } from "@/api/driver";
import { useUser } from "@/context/user-context";
import { idk } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { Scanner } from "@yudiel/react-qr-scanner";
import { useRouter } from "next/navigation";
import { useCookies } from "react-cookie";
import { toast } from "sonner";

export default function Page() {
  const { user } = useUser();
  const [{ token }] = useCookies(["token"]);
  const navig = useRouter();
  const { mutate } = useMutation({
    mutationKey: ["qr_scan"],
    mutationFn: (pay_code: string) => {
      return scanQRApi({
        companyID: String(user?.company_id),
        token,
        pay_code,
      });
    },
    onError: (err) => {
      toast.error(err.message ?? "Failed to complete this request");
    },
    onSuccess: (res: idk) => {
      toast.success(res.message ?? "Successful!");
      navig.push("/driver/tickets");
    },
  });
  return (
    <div>
      <Scanner
        onScan={(result) => mutate(result[0]?.rawValue)}
        onError={(error: any) => console.log(error?.message)}
      />
    </div>
  );
}
