import { MessageCard, MessageCardAction } from "@/components/ui/message-card";
import { type ChartConfig, ChartContainer } from "@/components/ui/chart";
import { PolarAngleAxis, RadialBar, RadialBarChart } from "recharts";

const data = [
  { name: "İK", progress: 25, budget: "$1,000", current: "$250", fill: "var(--color-chart-1)" },
  { name: "Pazarlama", progress: 55, budget: "$1,000", current: "$550", fill: "var(--color-chart-2)" },
  { name: "Finans", progress: 85, budget: "$1,000", current: "$850", fill: "var(--color-chart-3)" },
  { name: "Mühendislik", progress: 70, budget: "$2,000", current: "$1,400", fill: "var(--color-chart-4)" },
];

const chartConfig = {
  progress: { label: "İlerleme", color: "var(--color-chart-1)" },
} satisfies ChartConfig;

export default function Stats08() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {data.map((item) => (
        <MessageCard key={item.name}>
          <div className="flex items-center space-x-3">
            <div className="relative flex items-center justify-center shrink-0">
              <ChartContainer config={chartConfig} className="h-[80px] w-[80px]">
                <RadialBarChart data={[item]} innerRadius={30} outerRadius={55} barSize={6} startAngle={90} endAngle={-270}>
                  <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} axisLine={false} />
                  <RadialBar dataKey="progress" background cornerRadius={10} fill={item.fill} angleAxisId={0} />
                </RadialBarChart>
              </ChartContainer>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-base font-medium text-foreground">{item.progress}%</span>
              </div>
            </div>
            <div>
              <span className="text-base font-medium text-foreground">{item.current} / {item.budget}</span>
              <p className="text-sm text-muted-foreground">Bütçe: {item.name}</p>
            </div>
          </div>
          <MessageCardAction variant="link" className="mt-0 p-0 h-auto text-sm">Detayları gör &rarr;</MessageCardAction>
        </MessageCard>
      ))}
    </div>
  );
}
