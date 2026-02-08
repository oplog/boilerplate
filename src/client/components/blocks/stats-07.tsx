import { MessageCard, MessageCardHeading, MessageCardParagraph } from "@/components/ui/message-card";
import { type ChartConfig, ChartContainer } from "@/components/ui/chart";
import { PolarAngleAxis, RadialBar, RadialBarChart } from "recharts";

const data = [
  { name: "Çalışma Alanları", capacity: 20, current: 1, allowed: 5, fill: "var(--color-chart-1)" },
  { name: "Panolar", capacity: 40, current: 8, allowed: 20, fill: "var(--color-chart-2)" },
  { name: "Grafik Widget'ları", capacity: 60, current: 30, allowed: 50, fill: "var(--color-chart-3)" },
  { name: "Depolama", capacity: 50, current: 25, allowed: 100, fill: "var(--color-chart-4)" },
];

const chartConfig = {
  capacity: { label: "Kapasite", color: "var(--color-chart-1)" },
} satisfies ChartConfig;

export default function Stats07() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {data.map((item) => (
        <MessageCard key={item.name}>
          <div className="flex items-center space-x-3">
            <div className="relative flex items-center justify-center shrink-0">
              <ChartContainer config={chartConfig} className="h-[80px] w-[80px]">
                <RadialBarChart data={[item]} innerRadius={30} outerRadius={55} barSize={6} startAngle={90} endAngle={-270}>
                  <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} axisLine={false} />
                  <RadialBar dataKey="capacity" background cornerRadius={10} fill={item.fill} angleAxisId={0} />
                </RadialBarChart>
              </ChartContainer>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-base font-medium text-foreground">{item.capacity}%</span>
              </div>
            </div>
            <div>
              <span className="text-sm font-medium text-foreground">{item.name}</span>
              <p className="text-sm text-muted-foreground">{item.current} / {item.allowed} kullanıldı</p>
            </div>
          </div>
        </MessageCard>
      ))}
    </div>
  );
}
