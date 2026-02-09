// Grafik/Chart örnekleri sayfası
// Recharts + shadcn/ui ChartContainer ile interaktif grafikler
// Tüm shadcn chart tipleri: Area, Bar, Line, Pie, Radar, Radial, Stacked, Horizontal

import * as React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Area,
  AreaChart,
  Pie,
  PieChart,
  Label,
  Line,
  LineChart,
  Radar,
  RadarChart,
  PolarAngleAxis,
  PolarGrid,
  RadialBar,
  RadialBarChart,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { PageHeader } from "@/components/shared/page-header";
import { TrendingUp, TrendingDown } from "lucide-react";

// ═══════════════════════════════════════════════════════════════
// VERİ SETLERİ
// ═══════════════════════════════════════════════════════════════

// ─── Sipariş Trendi (Area Chart - son 90 gün) ───────────────
function generateOrderData() {
  const data = [];
  const now = new Date(2026, 1, 7);
  for (let i = 89; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dayOfWeek = date.getDay();
    const baseOrders = dayOfWeek === 0 || dayOfWeek === 6 ? 120 : 280;
    const baseCost = dayOfWeek === 0 || dayOfWeek === 6 ? 8000 : 18000;
    data.push({
      date: date.toISOString().split("T")[0],
      siparisler: baseOrders + Math.floor(Math.random() * 150),
      maliyet: baseCost + Math.floor(Math.random() * 12000),
    });
  }
  return data;
}
const fullOrderData = generateOrderData();

const orderChartConfig: ChartConfig = {
  siparisler: { label: "Siparişler", color: "var(--color-chart-1)" },
  maliyet: { label: "Maliyet (₺)", color: "var(--color-chart-2)" },
};

// ─── Aylık Sipariş & İade (Bar Chart) ───────────────────────
const monthlyOrders = [
  { month: "Oca", siparisler: 1420, iadeler: 85 },
  { month: "Şub", siparisler: 1680, iadeler: 92 },
  { month: "Mar", siparisler: 1890, iadeler: 78 },
  { month: "Nis", siparisler: 2100, iadeler: 105 },
  { month: "May", siparisler: 2350, iadeler: 118 },
  { month: "Haz", siparisler: 2580, iadeler: 95 },
];

const barChartConfig: ChartConfig = {
  siparisler: { label: "Siparişler", color: "var(--color-chart-1)" },
  iadeler: { label: "İadeler", color: "var(--color-chart-4)" },
};

// ─── Kategori Dağılımı (Pie Chart) ──────────────────────────
const categoryDistribution = [
  { kategori: "elektronik", adet: 3200, fill: "var(--color-elektronik)" },
  { kategori: "giyim", adet: 2800, fill: "var(--color-giyim)" },
  { kategori: "gida", adet: 4100, fill: "var(--color-gida)" },
  { kategori: "kozmetik", adet: 1900, fill: "var(--color-kozmetik)" },
  { kategori: "evyasam", adet: 2400, fill: "var(--color-evyasam)" },
];

const pieChartConfig: ChartConfig = {
  adet: { label: "Adet" },
  elektronik: { label: "Elektronik", color: "var(--color-chart-1)" },
  giyim: { label: "Giyim", color: "var(--color-chart-2)" },
  gida: { label: "Gıda", color: "var(--color-chart-3)" },
  kozmetik: { label: "Kozmetik", color: "var(--color-chart-4)" },
  evyasam: { label: "Ev & Yaşam", color: "var(--color-chart-5)" },
};

// ─── Depo Performans (Stacked Bar) ──────────────────────────
const warehousePerformance = [
  { depo: "İstanbul-1", tamamlanan: 920, devameden: 180, bekleyen: 45 },
  { depo: "İstanbul-2", tamamlanan: 780, devameden: 220, bekleyen: 60 },
  { depo: "Ankara", tamamlanan: 650, devameden: 150, bekleyen: 35 },
  { depo: "İzmir", tamamlanan: 540, devameden: 190, bekleyen: 55 },
  { depo: "Bursa", tamamlanan: 420, devameden: 130, bekleyen: 25 },
];

const warehouseConfig: ChartConfig = {
  tamamlanan: { label: "Tamamlanan", color: "var(--color-chart-1)" },
  devameden: { label: "Devam Eden", color: "var(--color-chart-2)" },
  bekleyen: { label: "Bekleyen", color: "var(--color-chart-4)" },
};

// ─── Teslimat Süreleri (Line Chart) ─────────────────────────
const deliveryTimes = [
  { month: "Oca", istanbul: 1.2, ankara: 2.1, izmir: 1.8, ortalama: 1.7 },
  { month: "Şub", istanbul: 1.1, ankara: 2.0, izmir: 1.9, ortalama: 1.67 },
  { month: "Mar", istanbul: 1.3, ankara: 1.8, izmir: 1.7, ortalama: 1.6 },
  { month: "Nis", istanbul: 1.0, ankara: 1.9, izmir: 1.6, ortalama: 1.5 },
  { month: "May", istanbul: 0.9, ankara: 1.7, izmir: 1.5, ortalama: 1.37 },
  { month: "Haz", istanbul: 0.8, ankara: 1.6, izmir: 1.4, ortalama: 1.27 },
];

const lineChartConfig: ChartConfig = {
  istanbul: { label: "İstanbul", color: "var(--color-chart-1)" },
  ankara: { label: "Ankara", color: "var(--color-chart-2)" },
  izmir: { label: "İzmir", color: "var(--color-chart-3)" },
  ortalama: { label: "Ortalama", color: "var(--color-chart-4)" },
};

// ─── Depo Yetenek (Radar Chart) ─────────────────────────────
const warehouseCapabilities = [
  { metric: "Hız", istanbul: 92, ankara: 78, izmir: 85 },
  { metric: "Kapasite", istanbul: 88, ankara: 82, izmir: 70 },
  { metric: "Doğruluk", istanbul: 95, ankara: 90, izmir: 88 },
  { metric: "Maliyet", istanbul: 72, ankara: 85, izmir: 80 },
  { metric: "Esneklik", istanbul: 80, ankara: 75, izmir: 90 },
  { metric: "Teknoloji", istanbul: 90, ankara: 70, izmir: 78 },
];

const radarChartConfig: ChartConfig = {
  istanbul: { label: "İstanbul", color: "var(--color-chart-1)" },
  ankara: { label: "Ankara", color: "var(--color-chart-2)" },
  izmir: { label: "İzmir", color: "var(--color-chart-3)" },
};

// ─── KPI Göstergeleri (Radial Bar Chart) ────────────────────
const kpiData = [
  { kpi: "zamaninda", label: "Zamanında Teslimat", value: 92, fill: "var(--color-zamaninda)" },
  { kpi: "musteri", label: "Müşteri Memnuniyeti", value: 87, fill: "var(--color-musteri)" },
  { kpi: "doluluk", label: "Depo Doluluk", value: 74, fill: "var(--color-doluluk)" },
  { kpi: "verimlilik", label: "İşgücü Verimliliği", value: 81, fill: "var(--color-verimlilik)" },
];

const radialChartConfig: ChartConfig = {
  value: { label: "Değer" },
  zamaninda: { label: "Zamanında Teslimat", color: "var(--color-chart-1)" },
  musteri: { label: "Müşteri Memnuniyeti", color: "var(--color-chart-2)" },
  doluluk: { label: "Depo Doluluk", color: "var(--color-chart-3)" },
  verimlilik: { label: "İşgücü Verimliliği", color: "var(--color-chart-4)" },
};

// ─── Kargo Firma Karşılaştırma (Horizontal Bar) ─────────────
const carrierComparison = [
  { firma: "Aras Kargo", teslimat: 4250 },
  { firma: "Yurtiçi Kargo", teslimat: 3800 },
  { firma: "MNG Kargo", teslimat: 2950 },
  { firma: "Sürat Kargo", teslimat: 2400 },
  { firma: "PTT Kargo", teslimat: 1800 },
];

const horizontalBarConfig: ChartConfig = {
  teslimat: { label: "Teslimat Sayısı", color: "var(--color-chart-1)" },
};

// ═══════════════════════════════════════════════════════════════
// SAYFA BİLEŞENİ
// ═══════════════════════════════════════════════════════════════

export function ChartExamplePage() {
  const [timeRange, setTimeRange] = React.useState("30d");

  const filteredOrderData = React.useMemo(() => {
    const now = new Date(2026, 1, 7);
    let daysToSubtract = 30;
    if (timeRange === "7d") daysToSubtract = 7;
    else if (timeRange === "90d") daysToSubtract = 90;
    const startDate = new Date(now);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return fullOrderData.filter((item) => new Date(item.date) >= startDate);
  }, [timeRange]);

  const trend = React.useMemo(() => {
    if (filteredOrderData.length < 2) return { value: 0, isUp: true };
    const half = Math.floor(filteredOrderData.length / 2);
    const firstHalf = filteredOrderData.slice(0, half);
    const secondHalf = filteredOrderData.slice(half);
    const firstAvg = firstHalf.reduce((s, d) => s + d.siparisler, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((s, d) => s + d.siparisler, 0) / secondHalf.length;
    const pct = ((secondAvg - firstAvg) / firstAvg) * 100;
    return { value: Math.abs(pct).toFixed(1), isUp: pct >= 0 };
  }, [filteredOrderData]);

  const totalOrders = React.useMemo(() => {
    return categoryDistribution.reduce((acc, curr) => acc + curr.adet, 0);
  }, []);

  return (
    <div>
      <PageHeader
        title="Grafik Örnekleri"
        description="Recharts + shadcn/ui Chart — Area, Bar, Line, Pie, Radar, Radial ve daha fazlası"
      />

      <div className="grid gap-4">
        {/* ─── 1. İnteraktif Alan Grafiği (Area Chart) ──────── */}
        <Card>
          <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
            <div className="grid flex-1 gap-1 text-center sm:text-left">
              <CardTitle>Sipariş Trendi</CardTitle>
              <CardDescription>Günlük sipariş sayısı ve maliyet takibi</CardDescription>
            </div>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[160px] rounded-lg sm:ml-auto" aria-label="Zaman aralığı seç">
                <SelectValue placeholder="Son 30 gün" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="90d" className="rounded-lg">Son 90 gün</SelectItem>
                <SelectItem value="30d" className="rounded-lg">Son 30 gün</SelectItem>
                <SelectItem value="7d" className="rounded-lg">Son 7 gün</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
            <ChartContainer config={orderChartConfig} className="aspect-auto h-[250px] w-full">
              <AreaChart data={filteredOrderData}>
                <defs>
                  <linearGradient id="fillSiparisler" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-siparisler)" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="var(--color-siparisler)" stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient id="fillMaliyet" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-maliyet)" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="var(--color-maliyet)" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={32}
                  tickFormatter={(value) =>
                    new Date(value).toLocaleDateString("tr-TR", { month: "short", day: "numeric" })
                  }
                />
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      labelFormatter={(value) =>
                        new Date(value).toLocaleDateString("tr-TR", { month: "long", day: "numeric" })
                      }
                      indicator="dot"
                    />
                  }
                />
                <Area dataKey="maliyet" type="natural" fill="url(#fillMaliyet)" stroke="var(--color-maliyet)" stackId="a" />
                <Area dataKey="siparisler" type="natural" fill="url(#fillSiparisler)" stroke="var(--color-siparisler)" stackId="b" />
                <ChartLegend content={<ChartLegendContent />} />
              </AreaChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col items-start gap-2 text-sm">
            <div className="flex gap-2 font-medium leading-none">
              {trend.isUp ? (
                <>Dönem içi %{trend.value} artış <TrendingUp className="h-4 w-4" /></>
              ) : (
                <>Dönem içi %{trend.value} düşüş <TrendingDown className="h-4 w-4" /></>
              )}
            </div>
            <div className="leading-none text-muted-foreground">
              {timeRange === "7d" ? "Son 7 günlük" : timeRange === "90d" ? "Son 90 günlük" : "Son 30 günlük"} sipariş ve maliyet trendi
            </div>
          </CardFooter>
        </Card>

        {/* ─── 2. Çizgi Grafiği (Line Chart) ────────────────── */}
        <Card>
          <CardHeader>
            <CardTitle>Teslimat Süreleri</CardTitle>
            <CardDescription>Şehir bazında ortalama teslimat süresi (gün)</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={lineChartConfig} className="aspect-auto h-[250px] w-full">
              <LineChart data={deliveryTimes} accessibilityLayer>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis tickLine={false} axisLine={false} tickFormatter={(v) => `${v} gün`} />
                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Line dataKey="istanbul" type="monotone" stroke="var(--color-istanbul)" strokeWidth={2} dot={{ r: 4 }} />
                <Line dataKey="ankara" type="monotone" stroke="var(--color-ankara)" strokeWidth={2} dot={{ r: 4 }} />
                <Line dataKey="izmir" type="monotone" stroke="var(--color-izmir)" strokeWidth={2} dot={{ r: 4 }} />
                <Line dataKey="ortalama" type="monotone" stroke="var(--color-ortalama)" strokeWidth={2} strokeDasharray="5 5" dot={false} />
              </LineChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col items-start gap-2 text-sm">
            <div className="flex gap-2 font-medium leading-none">
              İstanbul teslimat süresi %33 iyileşti <TrendingDown className="h-4 w-4" />
            </div>
            <div className="leading-none text-muted-foreground">
              6 aylık şehir bazında teslimat performansı
            </div>
          </CardFooter>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          {/* ─── 3. Çubuk Grafik (Bar Chart) ──────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>Aylık Sipariş & İade</CardTitle>
              <CardDescription>Ocak - Haziran 2026 sipariş ve iade karşılaştırması</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={barChartConfig} className="aspect-auto h-[250px] w-full">
                <BarChart data={monthlyOrders} accessibilityLayer>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
                  <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dashed" />} />
                  <Bar dataKey="siparisler" fill="var(--color-siparisler)" radius={4} />
                  <Bar dataKey="iadeler" fill="var(--color-iadeler)" radius={4} />
                </BarChart>
              </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
              <div className="flex gap-2 font-medium leading-none">
                Aylık ortalama %4.2 büyüme <TrendingUp className="h-4 w-4" />
              </div>
              <div className="leading-none text-muted-foreground">6 aylık sipariş performansı</div>
            </CardFooter>
          </Card>

          {/* ─── 4. Pasta Grafik (Pie / Donut Chart) ──────────── */}
          <Card className="flex flex-col">
            <CardHeader className="items-center pb-0">
              <CardTitle>Kategori Dağılımı</CardTitle>
              <CardDescription>Ürün kategorilerine göre sipariş dağılımı</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
              <ChartContainer config={pieChartConfig} className="mx-auto aspect-square max-h-[250px]">
                <PieChart>
                  <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                  <Pie data={categoryDistribution} dataKey="adet" nameKey="kategori" innerRadius={60} strokeWidth={5}>
                    <Label
                      content={({ viewBox }) => {
                        if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                          return (
                            <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                              <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-3xl font-bold">
                                {totalOrders.toLocaleString()}
                              </tspan>
                              <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-muted-foreground">
                                Sipariş
                              </tspan>
                            </text>
                          );
                        }
                      }}
                    />
                  </Pie>
                </PieChart>
              </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
              <div className="flex items-center gap-2 font-medium leading-none">
                Gıda kategorisi lider (%28) <TrendingUp className="h-4 w-4" />
              </div>
              <div className="leading-none text-muted-foreground">Toplam 5 kategoride dağılım</div>
            </CardFooter>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {/* ─── 5. Radar Grafiği (Radar Chart) ───────────────── */}
          <Card>
            <CardHeader className="items-center">
              <CardTitle>Depo Yetenek Karşılaştırması</CardTitle>
              <CardDescription>6 metrikte depo performans profili (0-100)</CardDescription>
            </CardHeader>
            <CardContent className="pb-0">
              <ChartContainer config={radarChartConfig} className="mx-auto aspect-square max-h-[300px]">
                <RadarChart data={warehouseCapabilities}>
                  <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                  <PolarAngleAxis dataKey="metric" />
                  <PolarGrid />
                  <Radar dataKey="istanbul" fill="var(--color-istanbul)" fillOpacity={0.15} stroke="var(--color-istanbul)" strokeWidth={2} />
                  <Radar dataKey="ankara" fill="var(--color-ankara)" fillOpacity={0.15} stroke="var(--color-ankara)" strokeWidth={2} />
                  <Radar dataKey="izmir" fill="var(--color-izmir)" fillOpacity={0.15} stroke="var(--color-izmir)" strokeWidth={2} />
                  <ChartLegend content={<ChartLegendContent />} />
                </RadarChart>
              </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
              <div className="flex gap-2 font-medium leading-none">
                İstanbul hız ve teknolojide lider
              </div>
              <div className="leading-none text-muted-foreground">
                Hız, kapasite, doğruluk, maliyet, esneklik, teknoloji
              </div>
            </CardFooter>
          </Card>

          {/* ─── 6. Radyal Çubuk (Radial Bar Chart) ───────────── */}
          <Card className="flex flex-col">
            <CardHeader className="items-center">
              <CardTitle>KPI Göstergeleri</CardTitle>
              <CardDescription>Operasyonel anahtar performans göstergeleri (%)</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
              <ChartContainer config={radialChartConfig} className="mx-auto aspect-square max-h-[300px]">
                <RadialBarChart data={kpiData} startAngle={-90} endAngle={270} innerRadius={30} outerRadius={110}>
                  <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel nameKey="kpi" />} />
                  <RadialBar dataKey="value" background cornerRadius={10} />
                  <ChartLegend content={<ChartLegendContent nameKey="kpi" />} className="flex-wrap gap-x-4 gap-y-1 [&>*]:basis-[calc(50%-0.5rem)] [&>*]:justify-center" />
                </RadialBarChart>
              </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
              <div className="flex items-center gap-2 font-medium leading-none">
                Zamanında teslimat %92 ile hedef üstünde <TrendingUp className="h-4 w-4" />
              </div>
              <div className="leading-none text-muted-foreground">
                4 KPI metriki — hedef: %85 üzeri
              </div>
            </CardFooter>
          </Card>
        </div>

        {/* ─── 7. Depo Performans (Stacked Bar Chart) ────────── */}
        <Card>
          <CardHeader>
            <CardTitle>Depo Performansı</CardTitle>
            <CardDescription>Depo bazında sipariş durumları — tamamlanan, devam eden ve bekleyen</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={warehouseConfig} className="aspect-auto h-[250px] w-full">
              <BarChart data={warehousePerformance} accessibilityLayer>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="depo" tickLine={false} tickMargin={10} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent indicator="dashed" />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="tamamlanan" stackId="a" fill="var(--color-tamamlanan)" radius={[0, 0, 4, 4]} />
                <Bar dataKey="devameden" stackId="a" fill="var(--color-devameden)" radius={[0, 0, 0, 0]} />
                <Bar dataKey="bekleyen" stackId="a" fill="var(--color-bekleyen)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col items-start gap-2 text-sm">
            <div className="flex gap-2 font-medium leading-none">
              İstanbul-1 en yüksek tamamlanma oranı (%80)
            </div>
            <div className="leading-none text-muted-foreground">5 depo genelinde sipariş durumu dağılımı</div>
          </CardFooter>
        </Card>

        {/* ─── 8. Yatay Çubuk (Horizontal Bar Chart) ─────────── */}
        <Card>
          <CardHeader>
            <CardTitle>Kargo Firma Karşılaştırması</CardTitle>
            <CardDescription>Firma bazında aylık teslimat hacmi</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={horizontalBarConfig} className="aspect-auto h-[250px] w-full">
              <BarChart data={carrierComparison} layout="vertical" accessibilityLayer margin={{ left: 20 }}>
                <CartesianGrid horizontal={false} />
                <YAxis dataKey="firma" type="category" tickLine={false} axisLine={false} tickMargin={10} width={100} />
                <XAxis type="number" tickLine={false} axisLine={false} />
                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                <Bar dataKey="teslimat" fill="var(--color-teslimat)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col items-start gap-2 text-sm">
            <div className="flex gap-2 font-medium leading-none">
              Aras Kargo en yüksek hacim (4,250 teslimat) <TrendingUp className="h-4 w-4" />
            </div>
            <div className="leading-none text-muted-foreground">5 kargo firması karşılaştırması</div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
