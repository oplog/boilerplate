import { MessageCard } from "@/components/ui/message-card";
import { cn } from "@/lib/utils";

const data = [
  { name: "Tekil Ziyaretçi", stat: "10,450", change: "-12.5%", changeType: "negative" },
  { name: "Hemen Çıkma Oranı", stat: "56.1%", change: "+1.8%", changeType: "positive" },
  { name: "Ziyaret Süresi", stat: "5.2dk", change: "+19.7%", changeType: "positive" },
  { name: "Dönüşüm Oranı", stat: "3.2%", change: "-2.4%", changeType: "negative" },
];

export default function Stats03() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {data.map((item) => (
        <MessageCard key={item.name}>
          <span className="text-sm font-medium text-muted-foreground">{item.name}</span>
          <div className="flex items-baseline space-x-2.5">
            <span className="tabular-nums text-3xl font-semibold text-foreground">{item.stat}</span>
            <span className={cn(
              "text-sm font-medium",
              item.changeType === "positive" ? "text-green-800 dark:text-green-400" : "text-red-800 dark:text-red-400"
            )}>
              {item.change}
            </span>
          </div>
        </MessageCard>
      ))}
    </div>
  );
}
