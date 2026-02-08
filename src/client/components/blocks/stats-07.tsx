import { Card, CardContent } from "@/components/ui/card";
import { type ChartConfig, ChartContainer } from "@/components/ui/chart";
import { PolarAngleAxis, RadialBar, RadialBarChart } from "recharts";

const data = [
  { name: "Çalışma Alanları", capacity: 20, current: 1, allowed: 5, fill: "hsl(20 90% 48%)" },
  { name: "Panolar", capacity: 10, current: 2, allowed: 20, fill: "hsl(173 58% 39%)" },
  { name: "Grafik Widget'ları", capacity: 30, current: 15, allowed: 50, fill: "hsl(197 37% 24%)" },
  { name: "Depolama", capacity: 50, current: 25, allowed: 100, fill: "hsl(43 96% 56%)" },
];

const chartConfig = {
  capacity: { label: "Kapasite", color: "hsl(var(--primary))" },
} satisfies ChartConfig;

export default function Stats07() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {data.map((item) => (
        <Card key={item.name} className="p-4">
          <CardContent className="p-0 flex items-center space-x-4">
            <div className="relative flex items-center justify-center shrink-0">
              <ChartContainer config={chartConfig} className="h-[80px] w-[80px]">
                <RadialBarChart data={[item]} innerRadius={30} outerRadius={60} barSize={6} startAngle={90} endAngle={-270}>
                  <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} axisLine={false} />
                  <RadialBar dataKey="capacity" background cornerRadius={10} fill={item.fill} angleAxisId={0} />
                </RadialBarChart>
              </ChartContainer>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-base font-medium text-foreground">{item.capacity}%</span>
              </div>
            </div>
            <div>
              <dt className="text-sm font-medium text-foreground">{item.name}</dt>
              <dd className="text-sm text-muted-foreground">{item.current} / {item.allowed} kullanıldı</dd>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
