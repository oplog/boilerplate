import { MessageCard } from "@/components/ui/message-card";
import { cn } from "@/lib/utils";

const data = [
  { name: "Kâr", value: "$287,654.00", change: "+8.32%", changeType: "positive" },
  { name: "Geciken Ödemeler", value: "$9,435.00", change: "-12.64%", changeType: "negative" },
  { name: "Bekleyen Siparişler", value: "$173,229.00", change: "+2.87%", changeType: "positive" },
  { name: "İşletme Giderleri", value: "$52,891.00", change: "-5.73%", changeType: "negative" },
];

export default function Stats01() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {data.map((stat) => (
        <MessageCard key={stat.name}>
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
            <span className="text-sm font-medium text-muted-foreground">{stat.name}</span>
            <span className={cn(
              "tabular-nums text-xs font-medium",
              stat.changeType === "positive" ? "text-green-800 dark:text-green-400" : "text-red-800 dark:text-red-400"
            )}>
              {stat.change}
            </span>
            <span className="tabular-nums w-full flex-none text-3xl font-medium tracking-tight text-foreground">
              {stat.value}
            </span>
          </div>
        </MessageCard>
      ))}
    </div>
  );
}
