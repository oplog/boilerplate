import { Badge } from "@/components/ui/badge";
import { MessageCard } from "@/components/ui/message-card";
import { cn } from "@/lib/utils";
import { TrendingDown, TrendingUp } from "lucide-react";

const data = [
  { name: "Günlük Aktif Kullanıcı", stat: "3,450", change: "+12.1%", changeType: "positive" },
  { name: "Haftalık Oturum", stat: "1,342", change: "-9.8%", changeType: "negative" },
  { name: "Oturum Süresi", stat: "5.2dk", change: "+7.7%", changeType: "positive" },
];

export default function Stats04() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {data.map((item) => (
        <MessageCard key={item.name}>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">{item.name}</span>
            <Badge
              variant="outline"
              className={cn(
                "font-medium inline-flex items-center px-1.5 ps-2.5 py-0.5 text-xs",
                item.changeType === "positive"
                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                  : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
              )}
            >
              {item.changeType === "positive" ? (
                <TrendingUp className="mr-0.5 -ml-1 h-5 w-5 shrink-0 text-green-500" />
              ) : (
                <TrendingDown className="mr-0.5 -ml-1 h-5 w-5 shrink-0 text-red-500" />
              )}
              {item.change}
            </Badge>
          </div>
          <span className="tabular-nums text-3xl font-semibold text-foreground">{item.stat}</span>
        </MessageCard>
      ))}
    </div>
  );
}
