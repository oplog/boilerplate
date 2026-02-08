import { MessageCard } from "@/components/ui/message-card";
import { cn } from "@/lib/utils";

const data = [
  { name: "Aylık Tekrarlayan Gelir", value: "$34.1K", change: "+6.1%", changeType: "positive" },
  { name: "Kullanıcılar", value: "500.1K", change: "+19.2%", changeType: "positive" },
  { name: "Kullanıcı Büyümesi", value: "11.3%", change: "-1.2%", changeType: "negative" },
];

export default function Stats05() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {data.map((item) => (
        <MessageCard key={item.name}>
          <div className="flex items-start justify-between space-x-2">
            <span className="truncate text-sm text-muted-foreground">{item.name}</span>
            <span className={cn(
              "text-sm font-medium",
              item.changeType === "positive" ? "text-emerald-700 dark:text-emerald-500" : "text-red-700 dark:text-red-500"
            )}>
              {item.change}
            </span>
          </div>
          <span className="tabular-nums text-3xl font-semibold text-foreground">{item.value}</span>
          <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Detayları gör &rarr;</a>
        </MessageCard>
      ))}
    </div>
  );
}
