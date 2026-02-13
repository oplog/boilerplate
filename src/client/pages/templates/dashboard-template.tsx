// Dashboard Template
// Referans sablon: KPI kartlari, alan grafigi, cubuk grafik ve son aktivite tablosu
// Kullanim: Bu dosyayi kopyalayip kendi dashboard sayfanizi olusturun

import {
  TrendingUp,
  ShoppingCart,
  DollarSign,
  Users,
  Truck,
  Package,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle2,
  XCircle,
  RefreshCw,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
} from "recharts";
import { PageHeader } from "@/components/shared/page-header";

// ============================================================
// MOCK VERiLER
// ============================================================

// --- KPI Kartlari ---
const kpiCards = [
  {
    title: "Toplam Siparis",
    value: "12.847",
    change: "+12.5%",
    trend: "up" as const,
    icon: ShoppingCart,
    description: "Onceki aya gore",
  },
  {
    title: "Gelir",
    value: "₺2.4M",
    change: "+8.2%",
    trend: "up" as const,
    icon: DollarSign,
    description: "Onceki aya gore",
  },
  {
    title: "Aktif Musteri",
    value: "3.621",
    change: "-2.1%",
    trend: "down" as const,
    icon: Users,
    description: "Onceki aya gore",
  },
  {
    title: "Teslimat Orani",
    value: "%97.8",
    change: "+1.3%",
    trend: "up" as const,
    icon: Truck,
    description: "Zamaninda teslimat",
  },
];

// --- 6 Aylik Trend (Area Chart) ---
const trendData = [
  { month: "Eyl", siparisler: 8420, gelir: 1680000 },
  { month: "Eki", siparisler: 9350, gelir: 1870000 },
  { month: "Kas", siparisler: 10200, gelir: 2040000 },
  { month: "Ara", siparisler: 11800, gelir: 2360000 },
  { month: "Oca", siparisler: 11420, gelir: 2284000 },
  { month: "Sub", siparisler: 12847, gelir: 2400000 },
];

const areaChartConfig: ChartConfig = {
  siparisler: { label: "Siparisler", color: "var(--color-chart-1)" },
  gelir: { label: "Gelir (₺)", color: "var(--color-chart-2)" },
};

// --- Aylik Karsilastirma (Bar Chart) ---
const monthlyComparison = [
  { month: "Eyl", tamamlanan: 7850, iptal: 320, iade: 250 },
  { month: "Eki", tamamlanan: 8720, iptal: 380, iade: 250 },
  { month: "Kas", tamamlanan: 9500, iptal: 410, iade: 290 },
  { month: "Ara", tamamlanan: 11050, iptal: 450, iade: 300 },
  { month: "Oca", tamamlanan: 10680, iptal: 420, iade: 320 },
  { month: "Sub", tamamlanan: 12100, iptal: 390, iade: 357 },
];

const barChartConfig: ChartConfig = {
  tamamlanan: { label: "Tamamlanan", color: "var(--color-chart-1)" },
  iptal: { label: "Iptal", color: "var(--color-chart-4)" },
  iade: { label: "Iade", color: "var(--color-chart-5)" },
};

// --- Son Aktiviteler (Tablo) ---
const recentActivities = [
  {
    id: "SIP-2847",
    musteri: "Trendyol",
    urun: "Elektronik Aksesuar Seti",
    adet: 1250,
    durum: "tamamlandi",
    tarih: "2026-02-13 14:32",
  },
  {
    id: "SIP-2846",
    musteri: "Hepsiburada",
    urun: "Spor Ayakkabi Koleksiyonu",
    adet: 840,
    durum: "kargoda",
    tarih: "2026-02-13 13:18",
  },
  {
    id: "SIP-2845",
    musteri: "N11",
    urun: "Kozmetik Urun Paketi",
    adet: 2100,
    durum: "hazirlaniyor",
    tarih: "2026-02-13 11:45",
  },
  {
    id: "SIP-2844",
    musteri: "Ciceksepeti",
    urun: "Ev & Yasam Urunleri",
    adet: 560,
    durum: "tamamlandi",
    tarih: "2026-02-13 10:22",
  },
  {
    id: "SIP-2843",
    musteri: "Amazon TR",
    urun: "Kitap & Kirtasiye",
    adet: 3200,
    durum: "iptal",
    tarih: "2026-02-13 09:05",
  },
];

// --- Durum Badge Ayarlari ---
const statusConfig: Record<
  string,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline"; icon: typeof CheckCircle2 }
> = {
  tamamlandi: { label: "Tamamlandi", variant: "default", icon: CheckCircle2 },
  kargoda: { label: "Kargoda", variant: "outline", icon: Truck },
  hazirlaniyor: { label: "Hazirlaniyor", variant: "secondary", icon: RefreshCw },
  iptal: { label: "Iptal", variant: "destructive", icon: XCircle },
};

// ============================================================
// SAYFA BiLESENi
// ============================================================

export function DashboardTemplatePage() {
  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Genel bakis ve onemli metrikler"
      />

      {/* --- KPI Kartlari --- */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpiCards.map((kpi) => {
          const Icon = kpi.icon;
          const isUp = kpi.trend === "up";
          return (
            <Card key={kpi.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {kpi.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpi.value}</div>
                <div className="mt-1 flex items-center gap-1 text-xs">
                  {isUp ? (
                    <ArrowUpRight className="h-3 w-3 text-emerald-500" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 text-red-500" />
                  )}
                  <span
                    className={
                      isUp ? "text-emerald-500" : "text-red-500"
                    }
                  >
                    {kpi.change}
                  </span>
                  <span className="text-muted-foreground">
                    {kpi.description}
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Separator className="my-6" />

      {/* --- Alan Grafigi: 6 Aylik Trend --- */}
      <Card>
        <CardHeader>
          <CardTitle>Siparis Trendi</CardTitle>
          <CardDescription>
            Son 6 aylik siparis ve gelir trendi
          </CardDescription>
        </CardHeader>
        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
          <ChartContainer
            config={areaChartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <AreaChart data={trendData} accessibilityLayer>
              <defs>
                <linearGradient
                  id="fillSiparisler"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
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
                <linearGradient
                  id="fillGelir"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
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
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
              />
              <Area
                dataKey="gelir"
                type="natural"
                fill="url(#fillGelir)"
                stroke="var(--color-gelir)"
                stackId="a"
              />
              <Area
                dataKey="siparisler"
                type="natural"
                fill="url(#fillSiparisler)"
                stroke="var(--color-siparisler)"
                stackId="b"
              />
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 font-medium leading-none">
            Son 6 ayda %52.6 buyume{" "}
            <TrendingUp className="h-4 w-4" />
          </div>
          <div className="leading-none text-muted-foreground">
            Eylul 2025 - Subat 2026 arasi siparis ve gelir performansi
          </div>
        </CardFooter>
      </Card>

      <Separator className="my-6" />

      {/* --- Alt Bolum: Cubuk Grafik + Son Aktiviteler --- */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Cubuk Grafik: Aylik Karsilastirma */}
        <Card>
          <CardHeader>
            <CardTitle>Aylik Siparis Durumu</CardTitle>
            <CardDescription>
              Tamamlanan, iptal ve iade karsilastirmasi
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={barChartConfig}
              className="aspect-auto h-[280px] w-full"
            >
              <BarChart data={monthlyComparison} accessibilityLayer>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dashed" />}
                />
                <Bar
                  dataKey="tamamlanan"
                  fill="var(--color-tamamlanan)"
                  radius={4}
                />
                <Bar
                  dataKey="iptal"
                  fill="var(--color-iptal)"
                  radius={4}
                />
                <Bar
                  dataKey="iade"
                  fill="var(--color-iade)"
                  radius={4}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col items-start gap-2 text-sm">
            <div className="flex gap-2 font-medium leading-none">
              Tamamlanma orani %94.2{" "}
              <TrendingUp className="h-4 w-4" />
            </div>
            <div className="leading-none text-muted-foreground">
              6 aylik siparis durum dagilimi
            </div>
          </CardFooter>
        </Card>

        {/* Son Aktiviteler Tablosu */}
        <Card>
          <CardHeader>
            <CardTitle>Son Aktiviteler</CardTitle>
            <CardDescription>
              Son islenen 5 siparis kaydini goruntuleyin
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Siparis</TableHead>
                  <TableHead className="hidden sm:table-cell">
                    Musteri
                  </TableHead>
                  <TableHead className="hidden md:table-cell">
                    Adet
                  </TableHead>
                  <TableHead>Durum</TableHead>
                  <TableHead className="hidden lg:table-cell text-right">
                    Tarih
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentActivities.map((item) => {
                  const status = statusConfig[item.durum];
                  const StatusIcon = status.icon;
                  return (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div className="font-medium">{item.id}</div>
                            <div className="text-xs text-muted-foreground sm:hidden">
                              {item.musteri}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {item.musteri}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {item.adet.toLocaleString("tr-TR")}
                      </TableCell>
                      <TableCell>
                        <Badge variant={status.variant}>
                          <StatusIcon className="mr-1 h-3 w-3" />
                          {status.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-right">
                        <div className="flex items-center justify-end gap-1 text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span className="text-xs">
                            {item.tarih.split(" ")[1]}
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
