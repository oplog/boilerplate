import { Card, CardContent } from "@/components/ui/card";
import { type ChartConfig, ChartContainer } from "@/components/ui/chart";
import { PolarAngleAxis, RadialBar, RadialBarChart } from "recharts";

const data = [
  { name: "İK", progress: 25, budget: "$1,000", current: "$250", fill: "hsl(20 90% 48%)" },
  { name: "Pazarlama", progress: 55, budget: "$1,000", current: "$550", fill: "hsl(173 58% 39%)" },
  { name: "Finans", progress: 85, budget: "$1,000", current: "$850", fill: "hsl(197 37% 24%)" },
  { name: "Mühendislik", progress: 70, budget: "$2,000", current: "$1,400", fill: "hsl(43 96% 56%)" },
];

const chartConfig = {
  progress: { label: "İlerleme", color: "hsl(var(--primary))" },
} satisfies ChartConfig;

export default function Stats08() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {data.map((item) => (
        <Card key={item.name} className="p-4">
          <CardContent className="p-0">
            <div className="flex items-center space-x-4">
              <div className="relative flex items-center justify-center shrink-0">
                <ChartContainer config={chartConfig} className="h-[80px] w-[80px]">
                  <RadialBarChart data={[item]} innerRadius={30} outerRadius={60} barSize={6} startAngle={90} endAngle={-270}>
                    <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} axisLine={false} />
                    <RadialBar dataKey="progress" background cornerRadius={10} fill={item.fill} angleAxisId={0} />
                  </RadialBarChart>
                </ChartContainer>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-base font-medium text-foreground">{item.progress}%</span>
                </div>
              </div>
              <div>
                <dt className="text-sm font-medium text-foreground">{item.current} / {item.budget}</dt>
                <dd className="text-sm text-muted-foreground">Bütçe: {item.name}</dd>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t">
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1">
                Detayları gör &rarr;
              </a>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
