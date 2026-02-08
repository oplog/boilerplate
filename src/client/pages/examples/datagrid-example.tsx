// DataGrid örneği sayfası
// DiceUI DataGrid ile düzenlenebilir, sıralanabilir, filtrelenebilir tablo
// Excel/Google Sheets benzeri hücre düzenleme ve klavye navigasyonu destekler
// Finansal veri tipleri: Muhasebe formatı, sayısal, yüzde, değişim göstergesi

import { DirectionProvider } from "@radix-ui/react-direction";
import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { DataGrid } from "@/components/data-grid/data-grid";
import { useDataGrid } from "@/hooks/use-data-grid";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PageHeader } from "@/components/shared/page-header";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  MessageCard,
  MessageCardHeading,
  MessageCardParagraph,
} from "@/components/ui/message-card";

// ═══════════════════════════════════════════════════════════════
// FORMATLAMA YARDIMCILARI
// ═══════════════════════════════════════════════════════════════

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

// ═══════════════════════════════════════════════════════════════
// FORMAT FONKSİYONLARI — number variant'ın format prop'u için
// Display modunda renkli format, tıklayınca düz sayı edit
// ═══════════════════════════════════════════════════════════════

/** Muhasebe formatı — negatifler parantezli ve kırmızı */
function formatAccountingNode(value: number): React.ReactNode {
  const isNeg = value < 0;
  return (
    <span className={cn(
      "text-right font-mono text-sm tabular-nums block",
      isNeg ? "text-red-600 dark:text-red-400" : "text-foreground"
    )}>
      {formatAccounting(value)}
    </span>
  );
}

/** Sayısal — sağa yaslı, mono font, virgüllü */
function formatNumericNode(value: number): React.ReactNode {
  return (
    <span className="text-right font-mono text-sm tabular-nums block">
      {formatNumeric(value)}
    </span>
  );
}

/** Para birimi — ₺ ile, negatifler kırmızı */
function formatCurrencyNode(value: number): React.ReactNode {
  const isNeg = value < 0;
  return (
    <span className={cn(
      "text-right font-mono text-sm tabular-nums block",
      isNeg ? "text-red-600 dark:text-red-400" : "text-foreground"
    )}>
      {isNeg ? `-₺${formatCurrency(Math.abs(value))}` : `₺${formatCurrency(value)}`}
    </span>
  );
}

/** Marj/Yüzde — yeşil pozitif, kırmızı negatif */
function formatMarginNode(value: number): React.ReactNode {
  const isNeg = value < 0;
  const isZero = value === 0;
  return (
    <span className={cn(
      "text-right font-mono text-sm tabular-nums block",
      isNeg ? "text-red-600 dark:text-red-400" : isZero ? "text-muted-foreground" : "text-emerald-600 dark:text-emerald-400"
    )}>
      {value >= 0 ? `%${value.toFixed(1)}` : `(%${Math.abs(value).toFixed(1)})`}
    </span>
  );
}

/** Değişim göstergesi — ok ikonu ile yeşil/kırmızı */
function formatChangeNode(value: number): React.ReactNode {
  const isNeg = value < 0;
  const isZero = value === 0;

  return (
    <span className={cn(
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
    </span>
  );
}

// ═══════════════════════════════════════════════════════════════
// BÖLÜM 1: Finansal Veri Tipleri DataGrid (Tam özellikli)
// ═══════════════════════════════════════════════════════════════

interface FinancialRecord {
  id: string;
  warehouse: string;
  status: string;
  revenue: number;
  cost: number;
  profit: number;
  margin: number;
  orders: number;
  avgOrderValue: number;
  change: number;
  note: string;
}

const warehouseOptions = [
  { label: "İstanbul-1", value: "İstanbul-1" },
  { label: "İstanbul-2", value: "İstanbul-2" },
  { label: "Ankara", value: "Ankara" },
  { label: "İzmir", value: "İzmir" },
  { label: "Bursa", value: "Bursa" },
  { label: "Antalya", value: "Antalya" },
  { label: "Gebze", value: "Gebze" },
  { label: "Mersin", value: "Mersin" },
  { label: "Kocaeli", value: "Kocaeli" },
  { label: "Eskişehir", value: "Eskişehir" },
];

const financialStatusOptions = [
  { label: "Aktif", value: "active" },
  { label: "Hedef Üstü", value: "above-target" },
  { label: "Hedef Altı", value: "below-target" },
  { label: "İnceleniyor", value: "review" },
];

const financialData: FinancialRecord[] = [
  { id: "WH-01", warehouse: "İstanbul-1", status: "above-target", revenue: 4003000.56, cost: 2850000.30, profit: 1153000.26, margin: 28.8, orders: 12450, avgOrderValue: 321.53, change: 12.4, note: "En yüksek hacimli depo" },
  { id: "WH-02", warehouse: "İstanbul-2", status: "below-target", revenue: 1548498.02, cost: 1620000.00, profit: -71501.98, margin: -4.6, orders: 8320, avgOrderValue: 186.12, change: -3.2, note: "Maliyet optimizasyonu gerekli" },
  { id: "WH-03", warehouse: "Ankara", status: "active", revenue: 2150000.00, cost: 1890000.45, profit: 259999.55, margin: 12.1, orders: 6780, avgOrderValue: 317.11, change: 5.7, note: "" },
  { id: "WH-04", warehouse: "İzmir", status: "review", revenue: 890450.80, cost: 945430.90, profit: -54980.10, margin: -6.2, orders: 3210, avgOrderValue: 277.40, change: -8.1, note: "Kapasite artırımı planlanıyor" },
  { id: "WH-05", warehouse: "Bursa", status: "active", revenue: 1200000.45, cost: 980000.00, profit: 220000.45, margin: 18.3, orders: 4560, avgOrderValue: 263.16, change: 0.0, note: "" },
  { id: "WH-06", warehouse: "Antalya", status: "below-target", revenue: 650000.00, cost: 720000.00, profit: -70000.00, margin: -10.8, orders: 2100, avgOrderValue: 309.52, change: -15.3, note: "Sezonluk düşüş" },
  { id: "WH-07", warehouse: "Gebze", status: "above-target", revenue: 3200000.00, cost: 2400000.00, profit: 800000.00, margin: 25.0, orders: 9800, avgOrderValue: 326.53, change: 22.1, note: "Yeni müşteri kazanımı" },
  { id: "WH-08", warehouse: "Mersin", status: "review", revenue: 480000.00, cost: 510000.00, profit: -30000.00, margin: -6.3, orders: 1850, avgOrderValue: 259.46, change: -2.5, note: "Liman operasyonları inceleniyor" },
  { id: "WH-09", warehouse: "Kocaeli", status: "above-target", revenue: 1750000.00, cost: 1320000.00, profit: 430000.00, margin: 24.6, orders: 5600, avgOrderValue: 312.50, change: 8.9, note: "" },
  { id: "WH-10", warehouse: "Eskişehir", status: "active", revenue: 320000.00, cost: 290000.00, profit: 30000.00, margin: 9.4, orders: 1200, avgOrderValue: 266.67, change: 1.2, note: "Yeni açılan depo" },
];

// ─── Finansal Kolon Tanımları ────────────────────────────────
const financialColumns: ColumnDef<FinancialRecord, unknown>[] = [
  {
    id: "warehouse",
    accessorKey: "warehouse",
    header: "Depo",
    size: 130,
    minSize: 100,
    meta: {
      cell: {
        variant: "select" as const,
        options: warehouseOptions,
      },
    },
  },
  {
    id: "status",
    accessorKey: "status",
    header: "Durum",
    size: 130,
    minSize: 110,
    meta: {
      cell: {
        variant: "select" as const,
        options: financialStatusOptions,
      },
    },
  },
  {
    id: "revenue",
    accessorKey: "revenue",
    header: "Gelir ($)",
    size: 170,
    minSize: 140,
    meta: { cell: { variant: "number" as const, min: 0, step: 0.01, format: formatAccountingNode } },
  },
  {
    id: "cost",
    accessorKey: "cost",
    header: "Gider ($)",
    size: 170,
    minSize: 140,
    meta: { cell: { variant: "number" as const, min: 0, step: 0.01, format: formatAccountingNode } },
  },
  {
    id: "profit",
    accessorKey: "profit",
    header: "Kâr/Zarar ($)",
    size: 170,
    minSize: 140,
    meta: { cell: { variant: "number" as const, step: 0.01, format: formatAccountingNode } },
  },
  {
    id: "margin",
    accessorKey: "margin",
    header: "Marj (%)",
    size: 110,
    minSize: 90,
    meta: { cell: { variant: "number" as const, min: -100, max: 100, step: 0.1, format: formatMarginNode } },
  },
  {
    id: "orders",
    accessorKey: "orders",
    header: "Sipariş",
    size: 110,
    minSize: 90,
    meta: { cell: { variant: "number" as const, min: 0, step: 1, format: formatNumericNode } },
  },
  {
    id: "avgOrderValue",
    accessorKey: "avgOrderValue",
    header: "Ort. Sipariş (₺)",
    size: 150,
    minSize: 120,
    meta: { cell: { variant: "number" as const, min: 0, step: 0.01, format: formatCurrencyNode } },
  },
  {
    id: "change",
    accessorKey: "change",
    header: "Aylık Değişim (%)",
    size: 150,
    minSize: 120,
    meta: { cell: { variant: "number" as const, step: 0.1, format: formatChangeNode } },
  },
  {
    id: "note",
    accessorKey: "note",
    header: "Not",
    size: 220,
    minSize: 150,
    meta: {
      cell: { variant: "short-text" as const },
    },
  },
];

function FinancialDataGridContent() {
  const [data, setData] = React.useState<FinancialRecord[]>(financialData);

  const onRowAdd = React.useCallback(() => {
    const newRow: FinancialRecord = {
      id: `WH-${String(data.length + 1).padStart(2, "0")}`,
      warehouse: "",
      status: "active",
      revenue: 0,
      cost: 0,
      profit: 0,
      margin: 0,
      orders: 0,
      avgOrderValue: 0,
      change: 0,
      note: "",
    };
    setData((prev) => [...prev, newRow]);
    return { rowIndex: data.length, columnId: "warehouse" };
  }, [data.length]);

  const onRowsDelete = React.useCallback((rows: FinancialRecord[]) => {
    const idsToDelete = new Set(rows.map((r) => r.id));
    setData((prev) => prev.filter((row) => !idsToDelete.has(row.id)));
  }, []);

  const { table, ...dataGridProps } = useDataGrid({
    data,
    columns: financialColumns,
    onDataChange: setData,
    onRowAdd,
    onRowsDelete,
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
      {/* Format Referans Kartları — Tablodaki formatlama örnekleri */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MessageCard>
          <MessageCardHeading>Muhasebe Formatı</MessageCardHeading>
          <MessageCardParagraph>Gelir, Gider, Kâr/Zarar kolonları</MessageCardParagraph>
          <div className="space-y-1.5 mt-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Pozitif</span>
              <span className="tabular-nums text-sm font-medium text-foreground">$4,003,000.56</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Negatif</span>
              <span className="tabular-nums text-sm font-medium text-red-600 dark:text-red-400">($71,501.98)</span>
            </div>
          </div>
        </MessageCard>

        <MessageCard>
          <MessageCardHeading>Sayısal Format</MessageCardHeading>
          <MessageCardParagraph>Sipariş ve Ort. Sipariş kolonları</MessageCardParagraph>
          <div className="space-y-1.5 mt-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Sipariş</span>
              <span className="tabular-nums text-sm font-medium">12,450</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Ort. Sipariş</span>
              <span className="tabular-nums text-sm font-medium">₺321.53</span>
            </div>
          </div>
        </MessageCard>

        <MessageCard>
          <MessageCardHeading>Yüzde / Marj</MessageCardHeading>
          <MessageCardParagraph>Marj (%) kolonu</MessageCardParagraph>
          <div className="space-y-1.5 mt-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Pozitif</span>
              <span className="tabular-nums text-sm font-medium text-emerald-600 dark:text-emerald-400">%28.8</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Negatif</span>
              <span className="tabular-nums text-sm font-medium text-red-600 dark:text-red-400">(%4.6)</span>
            </div>
          </div>
        </MessageCard>

        <MessageCard>
          <MessageCardHeading>Değişim Göstergesi</MessageCardHeading>
          <MessageCardParagraph>Aylık Değişim (%) kolonu</MessageCardParagraph>
          <div className="space-y-1.5 mt-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Artış</span>
              <span className="flex items-center gap-1 tabular-nums text-sm font-medium text-emerald-600 dark:text-emerald-400">
                <TrendingUp className="h-3.5 w-3.5" /> +12.4%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Düşüş</span>
              <span className="flex items-center gap-1 tabular-nums text-sm font-medium text-red-600 dark:text-red-400">
                <TrendingDown className="h-3.5 w-3.5" /> -8.1%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Sabit</span>
              <span className="flex items-center gap-1 tabular-nums text-sm font-medium text-muted-foreground">
                <Minus className="h-3.5 w-3.5" /> 0.0%
              </span>
            </div>
          </div>
        </MessageCard>
      </div>

      {/* Özet Badge'leri */}
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
            Depo ve durum kolonlarını tıklayarak düzenle. Satır seç + Delete ile sil.
            Alt satırdaki + butonu ile yeni depo ekle. Finansal kolonlar muhasebe formatında gösterilir.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <DataGrid table={table} {...dataGridProps} height={440} />
        </CardContent>
      </Card>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════
// BÖLÜM 2: Sevkiyat Takip DataGrid (Düzenlenebilir)
// ═══════════════════════════════════════════════════════════════

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

const initialData: Shipment[] = [
  { id: "SHP-001", customer: "Trendyol", product: "Elektronik Aksesuar", quantity: 250, status: "shipped", warehouse: "İstanbul-1", carrier: "Aras Kargo", note: "Ekspres teslimat" },
  { id: "SHP-002", customer: "Hepsiburada", product: "Giyim Ürünleri", quantity: 180, status: "preparing", warehouse: "İstanbul-2", carrier: "Yurtiçi Kargo", note: "" },
  { id: "SHP-003", customer: "Amazon TR", product: "Kozmetik Set", quantity: 420, status: "delivered", warehouse: "Ankara", carrier: "MNG Kargo", note: "Müşteri onayladı" },
  { id: "SHP-004", customer: "N11", product: "Ev & Yaşam", quantity: 95, status: "preparing", warehouse: "İzmir", carrier: "PTT Kargo", note: "Kırılacak ürün - dikkatli paketleme" },
  { id: "SHP-005", customer: "Trendyol", product: "Spor Malzemeleri", quantity: 310, status: "shipped", warehouse: "İstanbul-1", carrier: "Sürat Kargo", note: "" },
  { id: "SHP-006", customer: "GittiGidiyor", product: "Kitap & Kırtasiye", quantity: 540, status: "delivered", warehouse: "Bursa", carrier: "Aras Kargo", note: "Toplu sipariş" },
  { id: "SHP-007", customer: "Hepsiburada", product: "Bebek Ürünleri", quantity: 150, status: "cancelled", warehouse: "İstanbul-2", carrier: "Yurtiçi Kargo", note: "Müşteri iptal etti" },
  { id: "SHP-008", customer: "Amazon TR", product: "Elektronik", quantity: 75, status: "preparing", warehouse: "Ankara", carrier: "MNG Kargo", note: "Garanti belgesi eklenmeli" },
];

const shipmentColumns: ColumnDef<Shipment, unknown>[] = [
  {
    id: "id",
    accessorKey: "id",
    header: "Sipariş No",
    size: 120,
    minSize: 100,
    meta: { cell: { variant: "short-text" as const } },
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
    meta: { cell: { variant: "short-text" as const } },
  },
  {
    id: "quantity",
    accessorKey: "quantity",
    header: "Adet",
    size: 100,
    minSize: 80,
    meta: { cell: { variant: "number" as const, min: 0, step: 1 } },
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
    meta: { cell: { variant: "short-text" as const } },
  },
];

function ShipmentDataGridContent() {
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
    columns: shipmentColumns,
    onDataChange: setData,
    onRowAdd,
    onRowsDelete,
    getRowId: (row) => row.id,
  });

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
// ANA SAYFA BİLEŞENİ
// ═══════════════════════════════════════════════════════════════

export function DataGridExamplePage() {
  return (
    <DirectionProvider dir="ltr">
      <TooltipProvider>
        <div className="space-y-10 max-w-full overflow-x-hidden">
          <div>
            <PageHeader
              title="Finansal Veri Tipleri"
              description="Muhasebe formatı, sayısal gösterim, yüzde ve değişim göstergeleri — enterprise seviyede veri formatlama"
            />
            <FinancialDataGridContent />
          </div>

          <div>
            <PageHeader
              title="Sevkiyat Takip"
              description="DiceUI DataGrid - Excel benzeri düzenlenebilir tablo"
            />
            <ShipmentDataGridContent />
          </div>
        </div>
      </TooltipProvider>
    </DirectionProvider>
  );
}
