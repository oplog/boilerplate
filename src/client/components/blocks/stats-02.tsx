import { Badge } from "@/components/ui/badge";
import { MessageCard } from "@/components/ui/message-card";
import { cn } from "@/lib/utils";
import { TrendingDown, TrendingUp } from "lucide-react";

const stats = [
  { metric: "Aktif Kullanıcılar", current: "128,456", previous: "115,789", difference: "10.9%", trend: "up" },
  { metric: "Dönüşüm Oranı", current: "5.32%", previous: "6.18%", difference: "0.86%", trend: "down" },
  { metric: "Ort. Oturum Süresi", current: "3dk 42sn", previous: "3dk 15sn", difference: "13.8%", trend: "up" },
];

export default function Stats02() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {stats.map((item) => (
        <MessageCard key={item.metric}>
          <span className="text-base font-normal text-muted-foreground">{item.metric}</span>
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="tabular-nums text-2xl font-semibold text-foreground">{item.current}</span>
            <span className="tabular-nums text-sm font-medium text-muted-foreground">önceki: {item.previous}</span>
          </div>
          <Badge
            variant="outline"
            className={cn(
              "tabular-nums inline-flex items-center w-fit px-1.5 ps-2.5 py-0.5 text-xs font-medium",
              item.trend === "up"
                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
            )}
          >
            {item.trend === "up" ? (
              <TrendingUp className="mr-0.5 -ml-1 h-5 w-5 shrink-0 text-green-500" />
            ) : (
              <TrendingDown className="mr-0.5 -ml-1 h-5 w-5 shrink-0 text-red-500" />
            )}
            {item.difference}
          </Badge>
        </MessageCard>
      ))}
    </div>
  );
}
