import { MessageCard } from "@/components/ui/message-card";
import { ChartContainer } from "@/components/ui/chart";
import { cn } from "@/lib/utils";
import { Area, AreaChart, XAxis } from "recharts";

const chartData = [
  { date: "Kas 24", "Depo-A": 142, "Depo-B": 65, "Depo-C": 83 },
  { date: "Kas 25", "Depo-A": 151, "Depo-B": 59, "Depo-C": 79 },
  { date: "Kas 26", "Depo-A": 157, "Depo-B": 64, "Depo-C": 76 },
  { date: "Kas 27", "Depo-A": 162, "Depo-B": 57, "Depo-C": 72 },
  { date: "Kas 28", "Depo-A": 148, "Depo-B": 49, "Depo-C": 81 },
  { date: "Kas 29", "Depo-A": 139, "Depo-B": 55, "Depo-C": 92 },
  { date: "Kas 30", "Depo-A": 145, "Depo-B": 61, "Depo-C": 88 },
  { date: "Ara 01", "Depo-A": 138, "Depo-B": 68, "Depo-C": 93 },
  { date: "Ara 02", "Depo-A": 129, "Depo-B": 74, "Depo-C": 97 },
  { date: "Ara 03", "Depo-A": 119, "Depo-B": 71, "Depo-C": 89 },
  { date: "Ara 04", "Depo-A": 128, "Depo-B": 63, "Depo-C": 92 },
  { date: "Ara 05", "Depo-A": 137, "Depo-B": 58, "Depo-C": 84 },
  { date: "Ara 06", "Depo-A": 134, "Depo-B": 69, "Depo-C": 79 },
  { date: "Ara 07", "Depo-A": 152, "Depo-B": 73, "Depo-C": 81 },
  { date: "Ara 08", "Depo-A": 168, "Depo-B": 78, "Depo-C": 75 },
];

const summary = [
  { name: "Depo-A", code: "IST-1", value: "168.5K", change: "+15.8K", pct: "+10.4%", changeType: "positive" },
  { name: "Depo-B", code: "ANK", value: "78.5K", change: "+4.6K", pct: "+6.3%", changeType: "positive" },
  { name: "Depo-C", code: "IZM", value: "75.6K", change: "-5.7K", pct: "-7.1%", changeType: "negative" },
];

export default function Stats10() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {summary.map((item) => {
        const gradientId = `gradient-${item.code}`;
        const color = item.changeType === "positive" ? "hsl(142.1 76.2% 36.3%)" : "hsl(0 72.2% 50.6%)";

        return (
          <MessageCard key={item.name} className="[&>div]:pb-0">
            <span className="text-sm font-medium text-foreground">
              {item.name} <span className="font-normal text-muted-foreground">({item.code})</span>
            </span>
            <div className="flex items-baseline justify-between">
              <span className={cn(
                "text-lg font-semibold",
                item.changeType === "positive" ? "text-green-600 dark:text-green-500" : "text-red-600 dark:text-red-500"
              )}>
                {item.value}
              </span>
              <span className="flex items-center space-x-1 text-sm">
                <span className="font-medium text-foreground">{item.change}</span>
                <span className={cn(
                  item.changeType === "positive" ? "text-green-600 dark:text-green-500" : "text-red-600 dark:text-red-500"
                )}>
                  ({item.pct})
                </span>
              </span>
            </div>
            <div className="h-16 overflow-hidden -mx-5 -mb-5 mt-1">
              <ChartContainer className="w-full h-full" config={{ [item.name]: { label: item.name, color } }}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={color} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" hide />
                  <Area dataKey={item.name} stroke={color} fill={`url(#${gradientId})`} fillOpacity={0.4} strokeWidth={1.5} type="monotone" />
                </AreaChart>
              </ChartContainer>
            </div>
          </MessageCard>
        );
      })}
    </div>
  );
}
