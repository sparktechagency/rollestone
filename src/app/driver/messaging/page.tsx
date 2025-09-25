"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MessageCard } from "./message-card";
import { getNotifications, readAllNotif } from "@/api/driver";
import { useCookies } from "react-cookie";
import { useUser } from "@/context/user-context";
import { Loader2Icon } from "lucide-react";
import { idk } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function Page() {
  const [{ token }] = useCookies(["token"]);
  const ql = useQueryClient();
  const { user } = useUser();
  const { data, isPending } = useQuery({
    queryKey: ["messages"],
    queryFn: (): idk => {
      return getNotifications({
        companyID: String(user?.company_id),
        token,
      });
    },
  });

  const { mutate } = useMutation({
    mutationKey: ["read_notif"],
    mutationFn: () => {
      return readAllNotif({
        companyID: String(user?.company_id),
        token,
      });
    },
    onError: (err) => {
      toast.error(err.message ?? "Failed to complete this request");
    },
    onSuccess: (res: idk) => {
      ql.invalidateQueries({ queryKey: ["messages"] });
      toast.success(res.message ?? `Marked all messages as read`);
    },
  });

  return (
    <div className="w-full p-4 space-y-4">
      <div className="flex justify-end items-center">
        <Button
          className="cursor-pointer"
          onClick={() => {
            mutate();
          }}
        >
          Mark all as read
        </Button>
      </div>
      <div className="space-y-3">
        {isPending ? (
          <div className={`flex justify-center items-center h-24 mx-auto`}>
            <Loader2Icon className={`animate-spin`} />
          </div>
        ) : (
          data.data.map((message: idk) => (
            <MessageCard key={message.id} message={message} />
          ))
        )}
      </div>
    </div>
  );
}
