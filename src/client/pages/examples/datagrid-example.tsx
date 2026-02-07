// DataGrid örneği sayfası
// DiceUI DataGrid ile düzenlenebilir, sıralanabilir, filtrelenebilir tablo
// Excel/Google Sheets benzeri hücre düzenleme ve klavye navigasyonu destekler

import { DirectionProvider } from "@radix-ui/react-direction";
import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { DataGrid } from "@/components/data-grid/data-grid";
import { useDataGrid } from "@/hooks/use-data-grid";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PageHeader } from "@/components/shared/page-header";

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

// ─── Sayfa bileşeni: DirectionProvider sağlar ───────────────
export function DataGridExamplePage() {
  return (
    <DirectionProvider dir="ltr">
      <TooltipProvider>
        <div>
          <PageHeader
            title="DataGrid Örneği"
            description="DiceUI DataGrid - Excel benzeri düzenlenebilir tablo"
          />
          <DataGridContent />
        </div>
      </TooltipProvider>
    </DirectionProvider>
  );
}
