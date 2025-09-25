import { Card, CardContent } from "@/components/ui/card";
import { dateExtractor, timeExtractor } from "@/lib/functions";
import { CalendarIcon, ClockIcon } from "lucide-react";

export function NotifCard({
  data,
}: {
  data: {
    id: string;
    is_read: boolean;
    created_at_human: string;
    type: string;
    title: string;
    message: string;
  };
}) {
  return (
    <Card className="w-full">
      <CardContent className="flex items-start justify-between">
        <div className="flex flex-col">
          <h3 className="text-xl font-semibold mb-2">{data.title}</h3>
          <p className="text-gray-600 text-sm">{data.message}</p>
        </div>
        <div className="flex flex-col items-end text-gray-500 text-sm">
          <div className="flex items-center space-x-1 mb-1">
            <CalendarIcon className="h-4 w-4" />
            <span>{data.created_at_human}</span>
          </div>
          <div className="flex items-center space-x-1">
            <ClockIcon className="h-4 w-4" />
            <span>{timeExtractor(data.created_at_human)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
