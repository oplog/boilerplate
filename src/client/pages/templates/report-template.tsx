// Rapor Template Sayfasi
// Aylik performans raporu ornegi - KPI kartlari, grafikler ve detay tablosu
// Kullanim: Bu template'i kopyalayip kendi raporunuzu olusturun

import * as React from "react";
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Label,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { PageHeader } from "@/components/shared/page-header";
import {
  Download,
  TrendingUp,
  TrendingDown,
  Calendar,
} from "lucide-react";

// ================================================================
// MOCK VERi SETLERi
// ================================================================

// --- Aylik Trend Verisi (Line Chart) ---
const monthlyTrendData = [
  { ay: "Oca", siparisler: 9800, gelir: 2240000 },
  { ay: "Sub", siparisler: 10200, gelir: 2380000 },
  { ay: "Mar", siparisler: 10850, gelir: 2510000 },
  { ay: "Nis", siparisler: 11400, gelir: 2620000 },
  { ay: "May", siparisler: 11900, gelir: 2730000 },
  { ay: "Haz", siparisler: 12450, gelir: 2845000 },
];

const trendChartConfig: ChartConfig = {
  siparisler: { label: "Siparis", color: "var(--color-chart-1)" },
  gelir: { label: "Gelir (TL)", color: "var(--color-chart-2)" },
};

// --- Depo Bazinda Performans (Stacked Bar Chart) ---
const warehouseData = [
  { depo: "Istanbul-1", tamamlanan: 3200, bekleyen: 280 },
  { depo: "Istanbul-2", tamamlanan: 2850, bekleyen: 350 },
  { depo: "Ankara", tamamlanan: 2100, bekleyen: 190 },
  { depo: "Izmir", tamamlanan: 1750, bekleyen: 230 },
];

const warehouseChartConfig: ChartConfig = {
  tamamlanan: { label: "Tamamlanan", color: "var(--color-chart-1)" },
  bekleyen: { label: "Bekleyen", color: "var(--color-chart-4)" },
};

// --- Kategori Dagilimi (Pie Chart) ---
const categoryData = [
  { kategori: "elektronik", adet: 4200, fill: "var(--color-elektronik)" },
  { kategori: "giyim", adet: 3100, fill: "var(--color-giyim)" },
  { kategori: "gida", adet: 2650, fill: "var(--color-gida)" },
  { kategori: "kozmetik", adet: 1500, fill: "var(--color-kozmetik)" },
  { kategori: "evyasam", adet: 1000, fill: "var(--color-evyasam)" },
];

const categoryChartConfig: ChartConfig = {
  adet: { label: "Adet" },
  elektronik: { label: "Elektronik", color: "var(--color-chart-1)" },
  giyim: { label: "Giyim", color: "var(--color-chart-2)" },
  gida: { label: "Gida", color: "var(--color-chart-3)" },
  kozmetik: { label: "Kozmetik", color: "var(--color-chart-4)" },
  evyasam: { label: "Ev & Yasam", color: "var(--color-chart-5)" },
};

// --- Detayli Rapor Tablosu ---
type MonthlyReport = {
  ay: string;
  siparis: number;
  gelir: number;
  iade: number;
  teslimatSuresi: number;
  performans: "iyi" | "normal" | "dusuk";
};

const detailData: MonthlyReport[] = [
  { ay: "Ocak", siparis: 9800, gelir: 2240000, iade: 294, teslimatSuresi: 1.6, performans: "normal" },
  { ay: "Subat", siparis: 10200, gelir: 2380000, iade: 306, teslimatSuresi: 1.5, performans: "normal" },
  { ay: "Mart", siparis: 10850, gelir: 2510000, iade: 304, teslimatSuresi: 1.5, performans: "iyi" },
  { ay: "Nisan", siparis: 11400, gelir: 2620000, iade: 399, teslimatSuresi: 1.4, performans: "iyi" },
  { ay: "Mayis", siparis: 11900, gelir: 2730000, iade: 416, teslimatSuresi: 1.3, performans: "iyi" },
  { ay: "Haziran", siparis: 12450, gelir: 2845000, iade: 399, teslimatSuresi: 1.4, performans: "iyi" },
];

// --- KPI Verileri ---
const kpiCards = [
  {
    title: "Toplam Siparis",
    value: "12.450",
    change: "+8,2%",
    trend: "up" as const,
    description: "Onceki aya gore",
  },
  {
    title: "Toplam Gelir",
    value: "2.845.000 TL",
    change: "+12,5%",
    trend: "up" as const,
    description: "Onceki aya gore",
  },
  {
    title: "Ortalama Teslimat Suresi",
    value: "1,4 gun",
    change: "-15%",
    trend: "down" as const,
    description: "Iyilesme",
  },
  {
    title: "Iade Orani",
    value: "%3,2",
    change: "-0,5%",
    trend: "down" as const,
    description: "Iyilesme",
  },
];

// ================================================================
// SAYFA BiLESENi
// ================================================================

export function ReportTemplatePage() {
  const [period, setPeriod] = React.useState("bu-ay");

  // Pie chart icin toplam hesabi
  const totalCategory = React.useMemo(() => {
    return categoryData.reduce((acc, curr) => acc + curr.adet, 0);
  }, []);

  return (
    <div>
      {/* --- Sayfa Basligi --- */}
      <PageHeader
        title="Aylik Performans Raporu"
        description="Operasyonel performans metrikleri ve detayli analiz"
        actions={
          <div className="flex items-center gap-2">
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-[160px]">
                <Calendar className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Donem sec" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bu-ay">Bu Ay</SelectItem>
                <SelectItem value="son-3-ay">Son 3 Ay</SelectItem>
                <SelectItem value="son-6-ay">Son 6 Ay</SelectItem>
                <SelectItem value="bu-yil">Bu Yil</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Indir
            </Button>
          </div>
        }
      />

      <div className="grid gap-6">
        {/* ================================================================ */}
        {/* KPI OZET KARTLARI                                               */}
        {/* ================================================================ */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {kpiCards.map((kpi) => (
            <Card key={kpi.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {kpi.title}
                </CardTitle>
                {kpi.trend === "up" ? (
                  <TrendingUp className="h-4 w-4 text-emerald-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-emerald-500" />
                )}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpi.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span
                    className={
                      kpi.trend === "up" && kpi.change.startsWith("+")
                        ? "text-emerald-500 font-medium"
                        : kpi.trend === "down" && kpi.change.startsWith("-")
                          ? "text-emerald-500 font-medium"
                          : "text-red-500 font-medium"
                    }
                  >
                    {kpi.change}
                  </span>{" "}
                  {kpi.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Separator />

        {/* ================================================================ */}
        {/* AYLIK TREND - LINE CHART (TAM GENISLIK)                         */}
        {/* ================================================================ */}
        <Card>
          <CardHeader>
            <CardTitle>Aylik Trend</CardTitle>
            <CardDescription>
              Son 6 aylik siparis ve gelir trendi
            </CardDescription>
          </CardHeader>
          <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
            <ChartContainer
              config={trendChartConfig}
              className="aspect-auto h-[300px] w-full"
            >
              <LineChart data={monthlyTrendData} accessibilityLayer>
                <defs>
                  <linearGradient id="gradSiparis" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--color-siparisler)"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-siparisler)"
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                  <linearGradient id="gradGelir" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--color-gelir)"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-gelir)"
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="ay"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis
                  yAxisId="left"
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) =>
                    `${(v / 1000000).toFixed(1)}M`
                  }
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <ChartLegend content={<ChartLegendContent />} />
                <Line
                  yAxisId="left"
                  dataKey="siparisler"
                  type="monotone"
                  stroke="var(--color-siparisler)"
                  strokeWidth={2}
                  dot={{ r: 4, fill: "var(--color-siparisler)" }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  yAxisId="right"
                  dataKey="gelir"
                  type="monotone"
                  stroke="var(--color-gelir)"
                  strokeWidth={2}
                  dot={{ r: 4, fill: "var(--color-gelir)" }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col items-start gap-2 text-sm">
            <div className="flex gap-2 font-medium leading-none">
              Siparisler 6 ayda %27 artti{" "}
              <TrendingUp className="h-4 w-4" />
            </div>
            <div className="leading-none text-muted-foreground">
              Ocak - Haziran 2026 donemi
            </div>
          </CardFooter>
        </Card>

        {/* ================================================================ */}
        {/* 2 SUTUNLU GRAFIK ALANI                                          */}
        {/* ================================================================ */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* --- Depo Bazinda Performans (Stacked Bar) --- */}
          <Card>
            <CardHeader>
              <CardTitle>Depo Bazinda Performans</CardTitle>
              <CardDescription>
                Tamamlanan ve bekleyen siparis sayilari
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={warehouseChartConfig}
                className="aspect-auto h-[280px] w-full"
              >
                <BarChart data={warehouseData} accessibilityLayer>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="depo"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                  />
                  <YAxis tickLine={false} axisLine={false} />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent indicator="dashed" />
                    }
                  />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar
                    dataKey="tamamlanan"
                    stackId="a"
                    fill="var(--color-tamamlanan)"
                    radius={[0, 0, 4, 4]}
                  />
                  <Bar
                    dataKey="bekleyen"
                    stackId="a"
                    fill="var(--color-bekleyen)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
              <div className="flex gap-2 font-medium leading-none">
                Istanbul-1 en yuksek hacim (3.200)
              </div>
              <div className="leading-none text-muted-foreground">
                4 depo genelinde siparis durumu
              </div>
            </CardFooter>
          </Card>

          {/* --- Kategori Dagilimi (Donut Pie Chart) --- */}
          <Card className="flex flex-col">
            <CardHeader className="items-center pb-0">
              <CardTitle>Kategori Dagilimi</CardTitle>
              <CardDescription>
                Urun kategorilerine gore siparis dagilimi
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
              <ChartContainer
                config={categoryChartConfig}
                className="mx-auto aspect-square max-h-[280px]"
              >
                <PieChart>
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Pie
                    data={categoryData}
                    dataKey="adet"
                    nameKey="kategori"
                    innerRadius={60}
                    strokeWidth={5}
                  >
                    <Label
                      content={({ viewBox }) => {
                        if (
                          viewBox &&
                          "cx" in viewBox &&
                          "cy" in viewBox
                        ) {
                          return (
                            <text
                              x={viewBox.cx}
                              y={viewBox.cy}
                              textAnchor="middle"
                              dominantBaseline="middle"
                            >
                              <tspan
                                x={viewBox.cx}
                                y={viewBox.cy}
                                className="fill-foreground text-3xl font-bold"
                              >
                                {totalCategory.toLocaleString("tr-TR")}
                              </tspan>
                              <tspan
                                x={viewBox.cx}
                                y={(viewBox.cy || 0) + 24}
                                className="fill-muted-foreground"
                              >
                                Siparis
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
                Elektronik kategorisi lider (%34){" "}
                <TrendingUp className="h-4 w-4" />
              </div>
              <div className="leading-none text-muted-foreground">
                Toplam 5 kategoride dagilim
              </div>
            </CardFooter>
          </Card>
        </div>

        <Separator />

        {/* ================================================================ */}
        {/* DETAYLI RAPOR TABLOSU                                           */}
        {/* ================================================================ */}
        <Card>
          <CardHeader>
            <CardTitle>Detayli Rapor</CardTitle>
            <CardDescription>
              Aylik performans detaylari
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ay</TableHead>
                  <TableHead className="text-right">Siparis</TableHead>
                  <TableHead className="text-right">Gelir</TableHead>
                  <TableHead className="text-right">Iade</TableHead>
                  <TableHead className="text-right">
                    Teslimat Suresi
                  </TableHead>
                  <TableHead className="text-center">Performans</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {detailData.map((row) => (
                  <TableRow key={row.ay}>
                    <TableCell className="font-medium">{row.ay}</TableCell>
                    <TableCell className="text-right">
                      {row.siparis.toLocaleString("tr-TR")}
                    </TableCell>
                    <TableCell className="text-right">
                      {row.gelir.toLocaleString("tr-TR", {
                        minimumFractionDigits: 0,
                      })}{" "}
                      TL
                    </TableCell>
                    <TableCell className="text-right">
                      {row.iade.toLocaleString("tr-TR")}
                    </TableCell>
                    <TableCell className="text-right">
                      {row.teslimatSuresi.toFixed(1)} gun
                    </TableCell>
                    <TableCell className="text-center">
                      <PerformanceBadge value={row.performans} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className="text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Ocak - Haziran 2026 donemi verileri
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

// ================================================================
// YARDIMCI BiLESENLER
// ================================================================

function PerformanceBadge({ value }: { value: "iyi" | "normal" | "dusuk" }) {
  switch (value) {
    case "iyi":
      return (
        <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">
          Iyi
        </Badge>
      );
    case "normal":
      return (
        <Badge className="bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/20">
          Normal
        </Badge>
      );
    case "dusuk":
      return (
        <Badge className="bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/20">
          Dusuk
        </Badge>
      );
  }
}
