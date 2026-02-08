// DataGrid örneği sayfası
// DiceUI DataGrid ile düzenlenebilir, sıralanabilir, filtrelenebilir tablo
// Excel/Google Sheets benzeri hücre düzenleme ve klavye navigasyonu destekler
// Finansal veri tipleri: Muhasebe formatı, sayısal, yüzde, değişim göstergesi

import { DirectionProvider } from "@radix-ui/react-direction";
import * as React from "react";
import type { ColumnDef, CellContext } from "@tanstack/react-table";
import { DataGrid } from "@/components/data-grid/data-grid";
import { useDataGrid } from "@/hooks/use-data-grid";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PageHeader } from "@/components/shared/page-header";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

// ═══════════════════════════════════════════════════════════════
// BÖLÜM 1: Sevkiyat Takip DataGrid (Düzenlenebilir)
// ═══════════════════════════════════════════════════════════════

// ─── Veri Tipi ──────────────────────────────────────────────
interface Shipment {
  id: string;
  customer: string;
  product: string;
  quantity: number;
  status: string;
  warehouse: string;
  carrier: string;
  note: string;
}

// ─── Başlangıç Verileri ────────────────────────────────────
const initialData: Shipment[] = [
  {
    id: "SHP-001",
    customer: "Trendyol",
    product: "Elektronik Aksesuar",
    quantity: 250,
    status: "shipped",
    warehouse: "İstanbul-1",
    carrier: "Aras Kargo",
    note: "Ekspres teslimat",
  },
  {
    id: "SHP-002",
    customer: "Hepsiburada",
    product: "Giyim Ürünleri",
    quantity: 180,
    status: "preparing",
    warehouse: "İstanbul-2",
    carrier: "Yurtiçi Kargo",
    note: "",
  },
  {
    id: "SHP-003",
    customer: "Amazon TR",
    product: "Kozmetik Set",
    quantity: 420,
    status: "delivered",
    warehouse: "Ankara",
    carrier: "MNG Kargo",
    note: "Müşteri onayladı",
  },
  {
    id: "SHP-004",
    customer: "N11",
    product: "Ev & Yaşam",
    quantity: 95,
    status: "preparing",
    warehouse: "İzmir",
    carrier: "PTT Kargo",
    note: "Kırılacak ürün - dikkatli paketleme",
  },
  {
    id: "SHP-005",
    customer: "Trendyol",
    product: "Spor Malzemeleri",
    quantity: 310,
    status: "shipped",
    warehouse: "İstanbul-1",
    carrier: "Sürat Kargo",
    note: "",
  },
  {
    id: "SHP-006",
    customer: "GittiGidiyor",
    product: "Kitap & Kırtasiye",
    quantity: 540,
    status: "delivered",
    warehouse: "Bursa",
    carrier: "Aras Kargo",
    note: "Toplu sipariş",
  },
  {
    id: "SHP-007",
    customer: "Hepsiburada",
    product: "Bebek Ürünleri",
    quantity: 150,
    status: "cancelled",
    warehouse: "İstanbul-2",
    carrier: "Yurtiçi Kargo",
    note: "Müşteri iptal etti",
  },
  {
    id: "SHP-008",
    customer: "Amazon TR",
    product: "Elektronik",
    quantity: 75,
    status: "preparing",
    warehouse: "Ankara",
    carrier: "MNG Kargo",
    note: "Garanti belgesi eklenmeli",
  },
];

// ─── Kolon Tanımları ────────────────────────────────────────
const columns: ColumnDef<Shipment, unknown>[] = [
  {
    id: "id",
    accessorKey: "id",
    header: "Sipariş No",
    size: 120,
    minSize: 100,
    meta: {
      cell: { variant: "short-text" as const },
    },
  },
  {
    id: "customer",
    accessorKey: "customer",
    header: "Müşteri",
    size: 150,
    minSize: 120,
    meta: {
      cell: {
        variant: "select" as const,
        options: [
          { label: "Trendyol", value: "Trendyol" },
          { label: "Hepsiburada", value: "Hepsiburada" },
          { label: "Amazon TR", value: "Amazon TR" },
          { label: "N11", value: "N11" },
          { label: "GittiGidiyor", value: "GittiGidiyor" },
        ],
      },
    },
  },
  {
    id: "product",
    accessorKey: "product",
    header: "Ürün",
    size: 180,
    minSize: 140,
    meta: {
      cell: { variant: "short-text" as const },
    },
  },
  {
    id: "quantity",
    accessorKey: "quantity",
    header: "Adet",
    size: 100,
    minSize: 80,
    meta: {
      cell: { variant: "number" as const, min: 0, step: 1 },
    },
  },
  {
    id: "status",
    accessorKey: "status",
    header: "Durum",
    size: 140,
    minSize: 120,
    meta: {
      cell: {
        variant: "select" as const,
        options: [
          { label: "Hazırlanıyor", value: "preparing" },
          { label: "Kargoda", value: "shipped" },
          { label: "Teslim Edildi", value: "delivered" },
          { label: "İptal", value: "cancelled" },
        ],
      },
    },
  },
  {
    id: "warehouse",
    accessorKey: "warehouse",
    header: "Depo",
    size: 130,
    minSize: 100,
    meta: {
      cell: {
        variant: "select" as const,
        options: [
          { label: "İstanbul-1", value: "İstanbul-1" },
          { label: "İstanbul-2", value: "İstanbul-2" },
          { label: "Ankara", value: "Ankara" },
          { label: "İzmir", value: "İzmir" },
          { label: "Bursa", value: "Bursa" },
        ],
      },
    },
  },
  {
    id: "carrier",
    accessorKey: "carrier",
    header: "Kargo Firması",
    size: 140,
    minSize: 120,
    meta: {
      cell: {
        variant: "select" as const,
        options: [
          { label: "Aras Kargo", value: "Aras Kargo" },
          { label: "Yurtiçi Kargo", value: "Yurtiçi Kargo" },
          { label: "MNG Kargo", value: "MNG Kargo" },
          { label: "PTT Kargo", value: "PTT Kargo" },
          { label: "Sürat Kargo", value: "Sürat Kargo" },
        ],
      },
    },
  },
  {
    id: "note",
    accessorKey: "note",
    header: "Not",
    size: 200,
    minSize: 150,
    meta: {
      cell: { variant: "short-text" as const },
    },
  },
];

// ─── İç bileşen: DirectionProvider içinde çalışır ───────────
// useDataGrid içindeki useDirection() hook'u DirectionProvider
// context'ine ihtiyaç duyar, bu yüzden ayrı bileşen gerekir
function DataGridContent() {
  const [data, setData] = React.useState<Shipment[]>(initialData);

  const onRowAdd = React.useCallback(() => {
    const newRow: Shipment = {
      id: `SHP-${String(data.length + 1).padStart(3, "0")}`,
      customer: "",
      product: "",
      quantity: 0,
      status: "preparing",
      warehouse: "",
      carrier: "",
      note: "",
    };
    setData((prev) => [...prev, newRow]);
    return { rowIndex: data.length, columnId: "customer" };
  }, [data.length]);

  const onRowsDelete = React.useCallback((rows: Shipment[]) => {
    const idsToDelete = new Set(rows.map((r) => r.id));
    setData((prev) => prev.filter((row) => !idsToDelete.has(row.id)));
  }, []);

  const { table, ...dataGridProps } = useDataGrid({
    data,
    columns,
    onDataChange: setData,
    onRowAdd,
    onRowsDelete,
    getRowId: (row) => row.id,
  });

  // Durum istatistikleri
  const statusCounts = React.useMemo(() => {
    const counts = { preparing: 0, shipped: 0, delivered: 0, cancelled: 0 };
    data.forEach((row) => {
      if (row.status in counts) {
        counts[row.status as keyof typeof counts]++;
      }
    });
    return counts;
  }, [data]);

  return (
    <>
      {/* Durum Özeti */}
      <div className="mb-4 flex flex-wrap gap-2">
        <Badge variant="outline">
          Toplam: {data.length}
        </Badge>
        <Badge variant="default">
          Hazırlanıyor: {statusCounts.preparing}
        </Badge>
        <Badge variant="secondary">
          Kargoda: {statusCounts.shipped}
        </Badge>
        <Badge variant="outline" className="border-green-500 text-green-600">
          Teslim: {statusCounts.delivered}
        </Badge>
        {statusCounts.cancelled > 0 && (
          <Badge variant="destructive">
            İptal: {statusCounts.cancelled}
          </Badge>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sevkiyat Takip</CardTitle>
          <CardDescription>
            Hücrelere tıklayarak düzenleyebilirsin. Alt satırdaki + butonu ile yeni satır
            ekle. Satır seçip Delete ile sil.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <DataGrid table={table} {...dataGridProps} height={480} />
        </CardContent>
      </Card>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════
// BÖLÜM 2: Finansal Veri Tipleri DataGrid (Read-only)
// Muhasebe formatı, sayısal, yüzde ve değişim göstergesi
// ═══════════════════════════════════════════════════════════════

interface FinancialRecord {
  id: string;
  warehouse: string;
  revenue: number;
  cost: number;
  profit: number;
  margin: number;
  orders: number;
  avgOrderValue: number;
  change: number;
}

const financialData: FinancialRecord[] = [
  { id: "WH-01", warehouse: "İstanbul-1", revenue: 4003000.56, cost: 2850000.30, profit: 1153000.26, margin: 28.8, orders: 12450, avgOrderValue: 321.53, change: 12.4 },
  { id: "WH-02", warehouse: "İstanbul-2", revenue: 1548498.02, cost: 1620000.00, profit: -71501.98, margin: -4.6, orders: 8320, avgOrderValue: 186.12, change: -3.2 },
  { id: "WH-03", warehouse: "Ankara", revenue: 2150000.00, cost: 1890000.45, profit: 259999.55, margin: 12.1, orders: 6780, avgOrderValue: 317.11, change: 5.7 },
  { id: "WH-04", warehouse: "İzmir", revenue: 890450.80, cost: 945430.90, profit: -54980.10, margin: -6.2, orders: 3210, avgOrderValue: 277.40, change: -8.1 },
  { id: "WH-05", warehouse: "Bursa", revenue: 1200000.45, cost: 980000.00, profit: 220000.45, margin: 18.3, orders: 4560, avgOrderValue: 263.16, change: 0.0 },
  { id: "WH-06", warehouse: "Antalya", revenue: 650000.00, cost: 720000.00, profit: -70000.00, margin: -10.8, orders: 2100, avgOrderValue: 309.52, change: -15.3 },
  { id: "WH-07", warehouse: "Gebze", revenue: 3200000.00, cost: 2400000.00, profit: 800000.00, margin: 25.0, orders: 9800, avgOrderValue: 326.53, change: 22.1 },
  { id: "WH-08", warehouse: "Mersin", revenue: 480000.00, cost: 510000.00, profit: -30000.00, margin: -6.3, orders: 1850, avgOrderValue: 259.46, change: -2.5 },
  { id: "WH-09", warehouse: "Kocaeli", revenue: 1750000.00, cost: 1320000.00, profit: 430000.00, margin: 24.6, orders: 5600, avgOrderValue: 312.50, change: 8.9 },
  { id: "WH-10", warehouse: "Eskişehir", revenue: 320000.00, cost: 290000.00, profit: 30000.00, margin: 9.4, orders: 1200, avgOrderValue: 266.67, change: 1.2 },
];

// ─── Formatlama Yardımcıları ─────────────────────────────────

/** Muhasebe formatı: $1,234,567.89 veya ($1,234.56) negatifler için */
function formatAccounting(value: number): string {
  const abs = Math.abs(value);
  const formatted = abs.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  if (value < 0) return `($${formatted})`;
  return `$${formatted}`;
}

/** Sayısal format: 1,234,567 virgüllü */
function formatNumeric(value: number): string {
  return value.toLocaleString("en-US");
}

/** Para birimi format: ₺1,234.56 */
function formatCurrency(value: number): string {
  return value.toLocaleString("tr-TR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

// ─── Custom Cell Renderers ──────────────────────────────────

/** Muhasebe hücresi — negatifler parantezli ve kırmızı */
function AccountingCell({ getValue }: CellContext<FinancialRecord, unknown>) {
  const value = getValue() as number;
  const isNeg = value < 0;
  return (
    <div className={cn(
      "text-right font-mono text-sm tabular-nums",
      isNeg ? "text-red-600 dark:text-red-400" : "text-foreground"
    )}>
      {formatAccounting(value)}
    </div>
  );
}

/** Sayısal hücre — sağa yaslı, mono font, virgüllü */
function NumericCell({ getValue }: CellContext<FinancialRecord, unknown>) {
  const value = getValue() as number;
  return (
    <div className="text-right font-mono text-sm tabular-nums">
      {formatNumeric(value)}
    </div>
  );
}

/** Para birimi hücresi — ₺ ile, negatifler kırmızı */
function CurrencyCell({ getValue }: CellContext<FinancialRecord, unknown>) {
  const value = getValue() as number;
  const isNeg = value < 0;
  return (
    <div className={cn(
      "text-right font-mono text-sm tabular-nums",
      isNeg ? "text-red-600 dark:text-red-400" : "text-foreground"
    )}>
      {isNeg ? `-₺${formatCurrency(Math.abs(value))}` : `₺${formatCurrency(value)}`}
    </div>
  );
}

/** Marj/Yüzde hücresi — yeşil pozitif, kırmızı negatif */
function MarginCell({ getValue }: CellContext<FinancialRecord, unknown>) {
  const value = getValue() as number;
  const isNeg = value < 0;
  const isZero = value === 0;
  return (
    <div className={cn(
      "text-right font-mono text-sm tabular-nums",
      isNeg ? "text-red-600 dark:text-red-400" : isZero ? "text-muted-foreground" : "text-emerald-600 dark:text-emerald-400"
    )}>
      {value >= 0 ? `%${value.toFixed(1)}` : `(%${Math.abs(value).toFixed(1)})`}
    </div>
  );
}

/** Değişim göstergesi — ok ikonu ile yeşil/kırmızı */
function ChangeCell({ getValue }: CellContext<FinancialRecord, unknown>) {
  const value = getValue() as number;
  const isNeg = value < 0;
  const isZero = value === 0;

  return (
    <div className={cn(
      "flex items-center justify-end gap-1 font-mono text-sm tabular-nums",
      isNeg
        ? "text-red-600 dark:text-red-400"
        : isZero
          ? "text-muted-foreground"
          : "text-emerald-600 dark:text-emerald-400"
    )}>
      {isNeg ? (
        <TrendingDown className="h-3.5 w-3.5" />
      ) : isZero ? (
        <Minus className="h-3.5 w-3.5" />
      ) : (
        <TrendingUp className="h-3.5 w-3.5" />
      )}
      <span>{isNeg ? "" : "+"}{value.toFixed(1)}%</span>
    </div>
  );
}

// ─── Finansal Kolon Tanımları ────────────────────────────────
const financialColumns: ColumnDef<FinancialRecord, unknown>[] = [
  {
    id: "warehouse",
    accessorKey: "warehouse",
    header: "Depo",
    size: 130,
    minSize: 100,
    meta: { cell: { variant: "short-text" as const } },
  },
  {
    id: "revenue",
    accessorKey: "revenue",
    header: () => <div className="text-right">Gelir ($)</div>,
    cell: AccountingCell,
    size: 170,
    minSize: 140,
  },
  {
    id: "cost",
    accessorKey: "cost",
    header: () => <div className="text-right">Gider ($)</div>,
    cell: AccountingCell,
    size: 170,
    minSize: 140,
  },
  {
    id: "profit",
    accessorKey: "profit",
    header: () => <div className="text-right">Kâr/Zarar ($)</div>,
    cell: AccountingCell,
    size: 170,
    minSize: 140,
  },
  {
    id: "margin",
    accessorKey: "margin",
    header: () => <div className="text-right">Marj</div>,
    cell: MarginCell,
    size: 110,
    minSize: 90,
  },
  {
    id: "orders",
    accessorKey: "orders",
    header: () => <div className="text-right">Sipariş</div>,
    cell: NumericCell,
    size: 110,
    minSize: 90,
  },
  {
    id: "avgOrderValue",
    accessorKey: "avgOrderValue",
    header: () => <div className="text-right">Ort. Sipariş (₺)</div>,
    cell: CurrencyCell,
    size: 150,
    minSize: 120,
  },
  {
    id: "change",
    accessorKey: "change",
    header: () => <div className="text-right">Aylık Değişim</div>,
    cell: ChangeCell,
    size: 140,
    minSize: 120,
  },
];

function FinancialDataGridContent() {
  const [data] = React.useState<FinancialRecord[]>(financialData);

  const { table, ...dataGridProps } = useDataGrid({
    data,
    columns: financialColumns,
    getRowId: (row) => row.id,
  });

  // Özet hesaplama
  const totals = React.useMemo(() => {
    const totalRevenue = data.reduce((sum, r) => sum + r.revenue, 0);
    const totalCost = data.reduce((sum, r) => sum + r.cost, 0);
    const totalProfit = totalRevenue - totalCost;
    const totalOrders = data.reduce((sum, r) => sum + r.orders, 0);
    const profitableCount = data.filter((r) => r.profit >= 0).length;
    return { totalRevenue, totalProfit, totalOrders, profitableCount };
  }, [data]);

  return (
    <>
      <div className="mb-4 flex flex-wrap gap-2">
        <Badge variant="outline" className="font-mono tabular-nums">
          Toplam Gelir: ${(totals.totalRevenue / 1_000_000).toFixed(1)}M
        </Badge>
        <Badge
          variant="outline"
          className={cn(
            "font-mono tabular-nums",
            totals.totalProfit >= 0
              ? "border-emerald-500 text-emerald-600"
              : "border-red-500 text-red-600"
          )}
        >
          Net Kâr: ${(totals.totalProfit / 1_000_000).toFixed(1)}M
        </Badge>
        <Badge variant="secondary" className="font-mono tabular-nums">
          Sipariş: {formatNumeric(totals.totalOrders)}
        </Badge>
        <Badge variant="outline" className="border-emerald-500 text-emerald-600">
          Kârlı: {totals.profitableCount}/{data.length} depo
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Depo Finansal Performans</CardTitle>
          <CardDescription>
            Muhasebe formatı: negatif değerler parantez içinde kırmızı renkte gösterilir.
            Marj ve değişim kolonları yeşil/kırmızı renk kodlaması kullanır.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <DataGrid table={table} {...dataGridProps} height={440} />
        </CardContent>
      </Card>

      {/* Format Referans Kartları */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Muhasebe Formatı</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm font-mono tabular-nums">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Pozitif:</span>
              <span>$4,003,000.56</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Negatif:</span>
              <span className="text-red-600 dark:text-red-400">($50,000.00)</span>
            </div>
            <p className="text-xs text-muted-foreground pt-2 font-sans">
              Negatifler parantez + kırmızı renk. Sağa yaslı, mono font.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Sayısal Format</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm font-mono tabular-nums">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Büyük:</span>
              <span>12,450</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Küçük:</span>
              <span>102</span>
            </div>
            <p className="text-xs text-muted-foreground pt-2 font-sans">
              Binlik ayırıcı virgül. Sağa yaslı, mono font.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Yüzde / Marj</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm font-mono tabular-nums">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Pozitif:</span>
              <span className="text-emerald-600 dark:text-emerald-400">%28.8</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Negatif:</span>
              <span className="text-red-600 dark:text-red-400">(%4.6)</span>
            </div>
            <p className="text-xs text-muted-foreground pt-2 font-sans">
              Yeşil pozitif, kırmızı negatif. Negatifler parantez içinde.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Değişim Göstergesi</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm font-mono tabular-nums">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Artış:</span>
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                <TrendingUp className="h-3.5 w-3.5" /> +12.4%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Düşüş:</span>
              <span className="flex items-center gap-1 text-red-600 dark:text-red-400">
                <TrendingDown className="h-3.5 w-3.5" /> -8.1%
              </span>
            </div>
            <p className="text-xs text-muted-foreground pt-2 font-sans">
              Ok ikonu + renk kodu ile trend gösterimi.
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════
// ANA SAYFA BİLEŞENİ
// ═══════════════════════════════════════════════════════════════

export function DataGridExamplePage() {
  return (
    <DirectionProvider dir="ltr">
      <TooltipProvider>
        <div className="space-y-10">
          <div>
            <PageHeader
              title="DataGrid Örneği"
              description="DiceUI DataGrid - Excel benzeri düzenlenebilir tablo"
            />
            <DataGridContent />
          </div>

          <div>
            <PageHeader
              title="Finansal Veri Tipleri"
              description="Muhasebe formatı, sayısal gösterim, yüzde ve değişim göstergeleri — enterprise seviyede veri formatlama"
            />
            <FinancialDataGridContent />
          </div>
        </div>
      </TooltipProvider>
    </DirectionProvider>
  );
}
