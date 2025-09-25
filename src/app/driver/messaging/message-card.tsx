"use client";
import { readNotifById } from "@/api/driver";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useUser } from "@/context/user-context";
import { cn, idk } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCookies } from "react-cookie";
import { toast } from "sonner";

interface MessageCardProps {
  message: idk;
}

export const MessageCard = ({ message }: MessageCardProps) => {
  const ql = useQueryClient();
  const { user } = useUser();
  const [{ token }] = useCookies(["token"]);
  const { mutate } = useMutation({
    mutationKey: ["read_notif"],
    mutationFn: () => {
      return readNotifById({
        id: message.id,
        companyID: String(user?.company_id),
        token,
      });
    },
    onError: (err) => {
      toast.error(err.message ?? "Failed to complete this request");
    },
    onSuccess: (res: idk) => {
      ql.invalidateQueries({ queryKey: ["messages"] });
      toast.success(res.message ?? `Marked ${message.title} as read`);
    },
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case "admin_alert":
        return "text-red-600";
      case "generic":
        return "text-gray-700";
      case "payment_success":
        return "text-green-600";
      case "schedule":
        return "text-black";
      case "update":
        return "text-blue-600";
      default:
        return "text-blue-600";
    }
  };
  const getTypeBorderColor = (type: string) => {
    switch (type) {
      case "admin_alert":
        return "border-red-600/60";
      case "generic":
        return "border-gray-700/60";
      case "payment_success":
        return "border-green-600/60";
      case "schedule":
        return "border-black/60";
      case "update":
        return "border-blue-600/60";
      default:
        return "border-blue-600/60";
    }
  };

  return (
    <Card
      className={cn(
        "w-full bg-slate-50 shadow-sm hover:shadow-md transition-shadow ",
        !message.is_read &&
          `border-2 cursor-pointer ${getTypeBorderColor(message.type)}`
      )}
      onClick={() => {
        mutate();
      }}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {/* <div className={`w-2 h-2 rounded-full`} /> */}
            <h3
              className={`font-semibold text-xl ${getTypeColor(message.type)}`}
            >
              {message.title}
            </h3>
          </div>
          <span className="text-sm text-slate-500 font-medium">
            {message.created_at_human}
          </span>
        </div>
        <p className="text-sm text-slate-600 mt-1">
          {/* From: <span className="font-medium">{sender}</span> */}
        </p>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm text-slate-700 leading-relaxed">
          {message.message}
        </p>
      </CardContent>
    </Card>
  );
};
