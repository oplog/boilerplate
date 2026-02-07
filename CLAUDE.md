# CLAUDE.md - OPLOG App Builder Template

Bu dosya Claude Code'un bu projeyi anlamasini ve dogru sekilde kod yazmasi icin olusturulmustur.
Her zaman bu dosyayi referans al.

## Misyon

Bu proje OPLOG sirketi calisanlarina verilen bir uygulama gelistirme template'idir.
Bunu kullanan kisiler yazilimci DEGILDIR - Claude Code (yani sen) ile birlikte uygulama gelistirecekler.
Kullanici sana "su sayfayi ekle", "su API'yi yaz", "deploy et" gibi talimatlar verecek.
Sen bu template'in yapisina uygun sekilde kod yazacak, test edecek ve deploy edeceksin.

**Temel beklentiler:**
- Kullanici "npm run dev" dediginde hem frontend hem backend tek komutla ayaga kalkmali
- Kullanici "deploy et" dediginde `npm run deploy` veya `git push` ile CI/CD uzerinden deploy olmali
- Yeni sayfa, API, component eklerken bu dosyadaki kurallara uy
- Her degisiklikten sonra `npm run build` ile build'in basarili oldugunu dogrula
- Hata olursa kullaniciya acikla ve duzelt
- Kullanici yazilimci degildir, ona teknik jargon yerine basit aciklamalar yap

## Proje Ozeti

Bu proje, OPLOG ekibi icin hazirlanmis bir fullstack web uygulama sablonudur.
Frontend React 19 + TypeScript + Tailwind CSS 4, backend Hono.js uzerinde calisir ve Cloudflare Workers'a deploy edilir.
Tek bir Vite config ile hem frontend hem backend ayni anda calisir - ayri sunucu kurmaya gerek yok.

## Proje Yapisi

```
oplog-boilerplate/
├── src/
│   ├── client/                  # Frontend (React)
│   │   ├── components/
│   │   │   ├── layout/          # Layout bilesenleri (header, sidebar, root-layout)
│   │   │   ├── shared/          # Paylasilan bilesenler (page-header, loading, error-boundary)
│   │   │   ├── ui/              # shadcn/ui bilesenleri (46 adet - TUMU yuklu)
│   │   │   ├── theme-provider.tsx  # Dark/Light mod yonetimi
│   │   │   └── mode-toggle.tsx     # Tema degistirme butonu
│   │   ├── hooks/               # Custom React hook'lari
│   │   │   ├── use-api.ts       # API veri cekme/gonderme hook'lari
│   │   │   └── use-mobile.ts    # Mobil cihaz algilama hook'u
│   │   ├── lib/                 # Yardimci fonksiyonlar
│   │   │   ├── api-client.ts    # HTTP istemcisi (/api/... cagrilari)
│   │   │   └── utils.ts         # cn() yardimci fonksiyonu
│   │   ├── pages/               # Sayfa bilesenleri
│   │   │   ├── home.tsx         # Ana sayfa (rehber/ornek promptlar)
│   │   │   └── examples/        # Ornek sayfalar (form-example, table-example)
│   │   ├── app.tsx              # Root App component
│   │   ├── main.tsx             # Uygulama giris noktasi (ThemeProvider, QueryClient, Router)
│   │   ├── router.tsx           # React Router yapilandirmasi
│   │   └── index.css            # Tailwind CSS 4 tema ve global stiller
│   └── worker/                  # Backend (Hono.js + Cloudflare Workers)
│       ├── routes/              # API route dosyalari
│       │   ├── index.ts         # Route aggregator (tum route export'lari)
│       │   ├── health.ts        # GET /api/health - sunucu durumu
│       │   └── examples.ts      # GET/POST/PUT/DELETE /api/examples - ornek CRUD
│       ├── lib/
│       │   └── types.ts         # Paylasilan TypeScript tipleri
│       └── index.ts             # Hono ana giris noktasi, middleware ve route kaydi
├── public/                      # Statik dosyalar (OPLOG.png logo)
├── .github/workflows/           # CI/CD (deploy.yml, preview.yml)
├── .mcp.json                    # shadcn MCP Server yapilandirmasi
├── components.json              # shadcn/ui yapilandirmasi
├── wrangler.jsonc               # Cloudflare Workers yapilandirmasi
├── vite.config.ts               # Vite yapilandirmasi (React + Tailwind + Cloudflare)
├── tsconfig.json                # TypeScript yapilandirmasi (@ alias)
├── package.json                 # Bagimliliklar ve script'ler
└── index.html                   # HTML giris noktasi
```

## Hizli Baslatma Komutlari

```bash
npm install          # Bagimliliklari yukle
npm run dev          # Gelistirme sunucusunu baslat (http://localhost:5173)
npm run build        # Production build olustur
npm run deploy       # Cloudflare Workers'a deploy et
npm run cf-typegen   # Cloudflare binding type'larini olustur
```

---

## Frontend Gelistirme Kurallari

### Yeni Sayfa Ekleme (Adim Adim)

Kullanici "yeni bir sayfa ekle" dediginde su 3 adimi takip et:

**Adim 1: Sayfa dosyasini olustur**
```tsx
// src/client/pages/my-page.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";

export function MyPage() {
  return (
    <div>
      <PageHeader title="Sayfa Basligi" description="Aciklama" />
      <Card>
        <CardHeader>
          <CardTitle>Icerik</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Sayfa icerigi buraya</p>
        </CardContent>
      </Card>
    </div>
  );
}
```

**Adim 2: Router'a ekle**
```tsx
// src/client/router.tsx
import { MyPage } from "@/pages/my-page";

// children dizisine ekle:
{ path: "/my-page", element: <MyPage /> },
```

**Adim 3: Sidebar'a link ekle**
```tsx
// src/client/components/layout/sidebar.tsx
import { LayoutDashboard } from "lucide-react";

// navigation dizisine ekle:
{ name: "Sayfam", href: "/my-page", icon: LayoutDashboard },
```

### Yeni API Endpoint Ekleme (Adim Adim)

Kullanici "yeni bir API yaz" dediginde su 3 adimi takip et:

**Adim 1: Route dosyasini olustur**
```typescript
// src/worker/routes/my-route.ts
import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
});

const app = new Hono()
  .get("/", (c) => {
    return c.json({ items: [] });
  })
  .post("/", zValidator("json", schema), (c) => {
    const data = c.req.valid("json");
    return c.json({ item: data }, 201);
  })
  .get("/:id", (c) => {
    const id = c.req.param("id");
    return c.json({ id });
  })
  .put("/:id", zValidator("json", schema), (c) => {
    const id = c.req.param("id");
    const data = c.req.valid("json");
    return c.json({ item: { id, ...data } });
  })
  .delete("/:id", (c) => {
    const id = c.req.param("id");
    return c.json({ deleted: id });
  });

export default app;
```

**Adim 2: Route aggregator'a ekle**
```typescript
// src/worker/routes/index.ts
export { default as myRoute } from "./my-route";
```

**Adim 3: Hono'ya kaydet**
```typescript
// src/worker/index.ts
import myRoute from "./routes/my-route";

// app chain'ine ekle:
.route("/api/my-route", myRoute)
```

### Frontend'den API Cagirma

```tsx
// Veri listeleme (GET)
import { useApiQuery } from "@/hooks/use-api";

type Item = { id: string; name: string; email: string };
type Response = { items: Item[] };

const { data, isLoading, error } = useApiQuery<Response>(["my-items"], "/my-route");
```

```tsx
// Veri ekleme/guncelleme (POST/PUT/DELETE)
import { useApiMutation } from "@/hooks/use-api";
import { toast } from "sonner";

const createMutation = useApiMutation<Item, { name: string; email: string }>("/my-route", {
  method: "POST",
  invalidateKeys: [["my-items"]],  // POST basarili olunca listeyi yenile
});

// Kullanim:
createMutation.mutate(
  { name: "Ali", email: "ali@oplog.com" },
  {
    onSuccess: () => toast.success("Kaydedildi!"),
    onError: (err) => toast.error(err.message),
  }
);
```

### Tablo Sayfasi Olusturma

Referans dosya: `src/client/pages/examples/table-example.tsx`

```tsx
import { useApiQuery } from "@/hooks/use-api";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/shared/page-header";
import { Loading } from "@/components/shared/loading";

export function ItemsPage() {
  const { data, isLoading } = useApiQuery<{ items: Item[] }>(["items"], "/items");

  if (isLoading) return <Loading />;

  return (
    <div>
      <PageHeader title="Kayitlar" />
      <Input placeholder="Ara..." className="mb-4 max-w-sm" />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Isim</TableHead>
            <TableHead>Durum</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.name}</TableCell>
              <TableCell>
                <Badge variant={item.active ? "default" : "secondary"}>
                  {item.active ? "Aktif" : "Pasif"}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
```

### Form Sayfasi Olusturma

Referans dosya: `src/client/pages/examples/form-example.tsx`

```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const formSchema = z.object({
  name: z.string().min(1, "Isim zorunlu"),
  email: z.string().email("Gecerli email gir"),
});

type FormValues = z.infer<typeof formSchema>;

export function MyFormPage() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "" },
  });

  function onSubmit(data: FormValues) {
    // API'ye gonder veya islemi yap
    toast.success("Kaydedildi!");
    console.log(data);
  }

  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle>Yeni Kayit</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem>
                <FormLabel>Isim</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="email" render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl><Input type="email" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <Button type="submit">Kaydet</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
```

### Grafik/Chart Ekleme (Adim Adim)

Recharts 3 + shadcn/ui Chart bileseni yukludur. Grafik tipleri: Bar (cubuk), Area (alan), Pie (pasta), Stacked Bar (yigin cubuk).

**Referans dosya:** `src/client/pages/examples/chart-example.tsx`

**ONEMLI KURALLAR:**
- Renk olarak `var(--color-chart-1)` ile `var(--color-chart-5)` kullan (CSS'te tanimli, dark mode uyumlu)
- `hsl()` wrapper KULLANMA - renkler oklch formatinda, dogrudan `var(--color-chart-N)` yeterli
- ChartConfig'de tanimlanan key'ler otomatik olarak `--color-{key}` CSS degiskeni olusturur
- `aspect-auto` class'i ekleyerek responsive yukseklik kullan

**Cubuk Grafik (Bar Chart):**
```tsx
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";

const data = [
  { month: "Oca", siparisler: 1420, iadeler: 85 },
  { month: "Sub", siparisler: 1680, iadeler: 92 },
];

const chartConfig: ChartConfig = {
  siparisler: { label: "Siparisler", color: "var(--color-chart-1)" },
  iadeler: { label: "Iadeler", color: "var(--color-chart-4)" },
};

<Card>
  <CardHeader>
    <CardTitle>Aylik Rapor</CardTitle>
    <CardDescription>Siparis ve iade karsilastirmasi</CardDescription>
  </CardHeader>
  <CardContent>
    <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
      <BarChart data={data} accessibilityLayer>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} />
        <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dashed" />} />
        <Bar dataKey="siparisler" fill="var(--color-siparisler)" radius={4} />
        <Bar dataKey="iadeler" fill="var(--color-iadeler)" radius={4} />
      </BarChart>
    </ChartContainer>
  </CardContent>
  <CardFooter className="flex-col items-start gap-2 text-sm">
    <div className="leading-none text-muted-foreground">6 aylik performans</div>
  </CardFooter>
</Card>
```

**Interaktif Alan Grafik (Area Chart - Gradient + Tarih Filtresi):**
```tsx
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const chartConfig: ChartConfig = {
  gelir: { label: "Gelir", color: "var(--color-chart-1)" },
  maliyet: { label: "Maliyet", color: "var(--color-chart-2)" },
};

// State ile tarih araligi filtresi
const [timeRange, setTimeRange] = React.useState("30d");

// CardHeader icinde Select bileseni ile filtre
<Select value={timeRange} onValueChange={setTimeRange}>
  <SelectTrigger className="w-[160px] rounded-lg">
    <SelectValue placeholder="Son 30 gun" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="90d">Son 90 gun</SelectItem>
    <SelectItem value="30d">Son 30 gun</SelectItem>
    <SelectItem value="7d">Son 7 gun</SelectItem>
  </SelectContent>
</Select>

// Gradient tanimli Area Chart
<ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
  <AreaChart data={filteredData}>
    <defs>
      <linearGradient id="fillGelir" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor="var(--color-gelir)" stopOpacity={0.8} />
        <stop offset="95%" stopColor="var(--color-gelir)" stopOpacity={0.1} />
      </linearGradient>
    </defs>
    <CartesianGrid vertical={false} />
    <XAxis dataKey="date" tickLine={false} axisLine={false} />
    <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
    <Area dataKey="gelir" type="natural" fill="url(#fillGelir)" stroke="var(--color-gelir)" />
    <ChartLegend content={<ChartLegendContent />} />
  </AreaChart>
</ChartContainer>
```

**Pasta Grafik (Donut Pie Chart - Ortada Toplam):**
```tsx
import { Pie, PieChart, Label } from "recharts";

// Pie chart data'sinda her item'a fill alani ekle
const data = [
  { kategori: "elektronik", adet: 3200, fill: "var(--color-elektronik)" },
  { kategori: "giyim", adet: 2800, fill: "var(--color-giyim)" },
];

// Her kategori icin ChartConfig'de renk tanimla
const pieConfig: ChartConfig = {
  adet: { label: "Adet" },
  elektronik: { label: "Elektronik", color: "var(--color-chart-1)" },
  giyim: { label: "Giyim", color: "var(--color-chart-2)" },
};

<Pie data={data} dataKey="adet" nameKey="kategori" innerRadius={60} strokeWidth={5}>
  <Label content={({ viewBox }) => {
    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
      return (
        <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
          <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-3xl font-bold">
            {toplam.toLocaleString()}
          </tspan>
          <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-muted-foreground">
            Siparis
          </tspan>
        </text>
      );
    }
  }} />
</Pie>
```

**Yigin Cubuk Grafik (Stacked Bar Chart):**
```tsx
<Bar dataKey="tamamlanan" stackId="a" fill="var(--color-tamamlanan)" radius={[0, 0, 4, 4]} />
<Bar dataKey="devameden" stackId="a" fill="var(--color-devameden)" radius={[0, 0, 0, 0]} />
<Bar dataKey="bekleyen" stackId="a" fill="var(--color-bekleyen)" radius={[4, 4, 0, 0]} />
```

**Mevcut Chart Renkleri (index.css):**
- `--color-chart-1`: Mavi
- `--color-chart-2`: Yesil/Teal
- `--color-chart-3`: Amber
- `--color-chart-4`: Mor
- `--color-chart-5`: Kirmizi/Mercan

### Import Alias
- `@/` alias'i `src/client/` dizinine isaret eder
- Ornek: `import { Button } from "@/components/ui/button"`
- Ornek: `import { cn } from "@/lib/utils"`

### Bilesen Konumlari
- shadcn/ui bilesenleri: `src/client/components/ui/`
- Paylasilan bilesenler: `src/client/components/shared/`
- Layout bilesenleri: `src/client/components/layout/`
- Yeni ozel bilesenler: `src/client/components/` altinda uygun klasor olustur

---

## shadcn/ui Bilesenleri (46 bilesen - TUMU YUKLU)

Projede TUM shadcn/ui bilesenleri onceden yukludur. Ekstra yuklemeye gerek YOK.
Dogrudan import edip kullan.

**Layout & Navigation:**
accordion, breadcrumb, carousel, collapsible, menubar, navigation-menu, pagination, resizable, scroll-area, separator, sheet, sidebar, tabs

**Form & Input:**
button, calendar, checkbox, form, input, input-otp, label, radio-group, select, slider, switch, textarea, toggle, toggle-group

**Data Display:**
avatar, badge, card, chart, progress, skeleton, table

**Overlay & Feedback:**
alert, alert-dialog, aspect-ratio, command, context-menu, dialog, drawer, dropdown-menu, hover-card, popover, sonner (toast), tooltip

**Yeni shadcn/ui bileseni eklemek icin:** `npx shadcn@latest add <bilesen-adi>`

### DiceUI DataGrid (Excel-benzeri Tablo) (Adim Adim)

Projede DiceUI DataGrid (diceui.com) onceden yukludur. Excel/Google Sheets benzeri duzenlenebilir tablo icin kullan.
Hucre duzenleme, kopyala/yapistir, satir ekleme/silme, klavye navigasyonu destekler.

**Referans dosya:** `src/client/pages/examples/datagrid-example.tsx`

**Dosyalar:**
- `src/client/components/data-grid/` - DataGrid bilesenleri (9 dosya)
- `src/client/hooks/use-data-grid.ts` - DataGrid hook'u
- `src/client/lib/data-grid.ts` - Utility fonksiyonlar
- `src/client/types/data-grid.ts` - TypeScript tipleri

**KRITIK: DirectionProvider + TooltipProvider SARMALAMA ZORUNLU**
`useDataGrid` hook'u Radix UI'nin `useDirection()` hook'unu kullanir. Bu hook `DirectionProvider` context'ine ihtiyac duyar.
Ayrica DataGrid bilesenleri Tooltip kullanir, `TooltipProvider` da gereklidir.
**ONEMLI:** `useDataGrid` hook'unu cagiran bilesen, provider'larin ICINDE olmali. Ayni bilesende provider'i JSX'e koyup hook'u da cagirmak CALISMAZ.

```tsx
import { DirectionProvider } from "@radix-ui/react-direction";
import { DataGrid } from "@/components/data-grid/data-grid";
import { useDataGrid } from "@/hooks/use-data-grid";
import { TooltipProvider } from "@/components/ui/tooltip";

// YANLIS - hook provider disinda calisir, HATA verir:
// function MyPage() {
//   const { table, ...props } = useDataGrid({...}); // useDirection() HATA!
//   return <DirectionProvider><DataGrid ... /></DirectionProvider>;
// }

// DOGRU - iki bilesen kullan:
function DataGridContent() {
  // useDataGrid burada guvenle cagirilir (DirectionProvider ICINDE)
  const { table, ...dataGridProps } = useDataGrid({
    data, columns, onDataChange: setData, getRowId: (row) => row.id,
  });

  return <DataGrid table={table} {...dataGridProps} height={400} />;
}

// Dis bilesen provider'lari sarar
export function MyPage() {
  return (
    <DirectionProvider dir="ltr">
      <TooltipProvider>
        <DataGridContent />
      </TooltipProvider>
    </DirectionProvider>
  );
}
```

**Kolon Tanimlari:**
```tsx
import type { ColumnDef } from "@tanstack/react-table";

const columns: ColumnDef<MyType, unknown>[] = [
  {
    id: "name",
    accessorKey: "name",
    header: "Isim",
    size: 150,        // Kolon genisligi (px)
    minSize: 100,     // Minimum genislik
    meta: { cell: { variant: "short-text" } },
  },
  {
    id: "status",
    accessorKey: "status",
    header: "Durum",
    size: 140,
    meta: {
      cell: {
        variant: "select",
        options: [
          { label: "Aktif", value: "active" },
          { label: "Pasif", value: "inactive" },
        ],
      },
    },
  },
  {
    id: "count",
    accessorKey: "count",
    header: "Adet",
    size: 100,
    meta: { cell: { variant: "number", min: 0, step: 1 } },
  },
];
```

**Satir Ekleme/Silme:**
```tsx
const onRowAdd = React.useCallback(() => {
  const newRow = { id: `NEW-${Date.now()}`, name: "", status: "active" };
  setData((prev) => [...prev, newRow]);
  return { rowIndex: data.length, columnId: "name" }; // Yeni satira fokusla
}, [data.length]);

const onRowsDelete = React.useCallback((rows: MyType[]) => {
  const ids = new Set(rows.map((r) => r.id));
  setData((prev) => prev.filter((row) => !ids.has(row.id)));
}, []);

const { table, ...dataGridProps } = useDataGrid({
  data, columns, onDataChange: setData, onRowAdd, onRowsDelete, getRowId: (row) => row.id,
});
```

**Desteklenen hucre tipleri (variant):**
| Variant | Aciklama | Meta Ornek |
|---------|----------|------------|
| `short-text` | Kisa metin | `{ variant: "short-text" }` |
| `long-text` | Uzun metin | `{ variant: "long-text" }` |
| `number` | Sayi | `{ variant: "number", min: 0, step: 1 }` |
| `url` | Link | `{ variant: "url" }` |
| `checkbox` | Onay kutusu | `{ variant: "checkbox" }` |
| `select` | Tekli secim | `{ variant: "select", options: [...] }` |
| `multi-select` | Coklu secim | `{ variant: "multi-select", options: [...] }` |
| `date` | Tarih secici | `{ variant: "date" }` |
| `file` | Dosya yukleme | `{ variant: "file" }` |

### shadcn MCP Server
Bu projede shadcn MCP Server yapilandirilmistir (`.mcp.json`).
Claude Code, shadcn registry'sindeki bilesenleri dogrudan gorebilir, arayabilir ve yukleyebilir.

---

## Dark Mode / Tema

Dark mode `ThemeProvider` ile yonetilir (next-themes KULLANMA, Vite uyumlu degil).

**Tema degistirme bileseni**: Header'da sag ustte `ModeToggle` butonu vardir.
**ThemeProvider**: `src/client/components/theme-provider.tsx` dosyasindadir.
**localStorage key**: `oplog-ui-theme` (degerler: "light", "dark", "system")

Tema degerini okumak icin:
```tsx
import { useTheme } from "@/components/theme-provider";

const { theme, setTheme } = useTheme();
// theme: "light" | "dark" | "system"
// setTheme("dark") ile tema degistir
```

Dark mode destekli class yazimi:
```tsx
// Tailwind dark variant kullan:
<div className="bg-white dark:bg-gray-900 text-black dark:text-white">

// Veya shadcn/ui tema degiskenlerini kullan (otomatik dark mode destegi):
<div className="bg-background text-foreground">
<div className="bg-muted text-muted-foreground">
<div className="bg-card text-card-foreground">
```

**ONEMLI:** `next-themes` paketi KULLANMA. Bu proje Vite + Cloudflare Workers ortaminda calisir, Next.js degildir. Tema islemleri icin sadece `@/components/theme-provider` kullan.

---

## Stil ve Tema

- Tailwind CSS 4 kullanilir (yeni CSS-native yaklasim)
- Tema degiskenleri `src/client/index.css` dosyasindadir (oklch renk uzayi)
- Font: Inter (CDN yerine system font stack kullanilir)
- Mobile-first yaklasim: `className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4"`
- `cn()` fonksiyonu ile class birlestirme: `import { cn } from "@/lib/utils"`
- Animasyon: `tw-animate-css` paketi yuklu

### Sayfa Baslik Bileseni
Her sayfanin ustunde `PageHeader` bileseni kullan:
```tsx
import { PageHeader } from "@/components/shared/page-header";

<PageHeader
  title="Sayfa Basligi"
  description="Sayfa aciklamasi"
  actions={<Button>Aksiyon</Button>}
/>
```

### Toast Bildirimleri
```tsx
import { toast } from "sonner";

toast.success("Basarili!");
toast.error("Hata olustu");
toast.info("Bilgi mesaji");
toast("Genel bildirim");
```

### Ikonlar
Lucide React kullanilir. Kullanilabilir tum ikonlar: https://lucide.dev/icons
```tsx
import { Home, Users, Settings, Plus, Trash, Edit, Search } from "lucide-react";

<Home className="h-4 w-4" />
```

---

## Backend Gelistirme Kurallari

### Mevcut API Endpoint'leri
- `GET /api/health` - Sunucu durumu (status, timestamp, environment)
- `GET /api/examples` - Ornek liste (pagination + search destekli)
- `POST /api/examples` - Yeni ornek ekle (Zod validasyonlu)
- `PUT /api/examples/:id` - Ornek guncelle
- `DELETE /api/examples/:id` - Ornek sil

### Hono Middleware'ler (zaten aktif)
- `logger()` - Tum istekleri loglar
- `cors()` - CORS basliklarini ekler (sadece /api/* icin)

### Zod Validasyon Deseni
```typescript
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

const schema = z.object({
  name: z.string().min(1, "Isim zorunlu"),
  email: z.string().email("Gecerli email giriniz"),
  status: z.enum(["active", "inactive"]).default("active"),
  age: z.number().min(0).optional(),
});

app.post("/", zValidator("json", schema), (c) => {
  const data = c.req.valid("json"); // tip-guvenli
  return c.json({ item: data }, 201);
});
```

### Cloudflare Bindings

Cloudflare servislerine `c.env` uzerinden erisim:

```typescript
// D1 veritabani
const result = await c.env.DB.prepare("SELECT * FROM users").all();

// KV store
await c.env.KV.put("key", "value");
const value = await c.env.KV.get("key");

// R2 object storage
await c.env.BUCKET.put("file.txt", data);
```

Binding eklemek icin:
1. `wrangler.jsonc` dosyasindaki yorumlu satirlari ac
2. `src/worker/index.ts` dosyasindaki `Env` type'ina ekle
3. `npm run cf-typegen` calistir

---

## Isimlendirme Kurallari

| Oge | Kural | Ornek |
|-----|-------|-------|
| Dosya adlari | kebab-case | `my-component.tsx`, `api-client.ts` |
| Bilesen adlari | PascalCase | `export function MyComponent()` |
| API endpoint'leri | kebab-case | `/api/my-endpoint` |
| Hook'lar | camelCase, "use" ile baslar | `useApiQuery`, `useMyHook` |
| Degiskenler | camelCase | `const myVariable = ...` |
| Tipler/Interface'ler | PascalCase | `type MyType = { ... }` |
| CSS class'lari | Tailwind utility class'lari | `className="flex items-center gap-2"` |

---

## Deploy ve CI/CD

### Tek Komutla Deploy
```bash
npm run deploy        # Cloudflare Workers'a deploy et (wrangler login gerektirir)
```

### Otomatik CI/CD (GitHub Actions)
- `main` branch'e push → otomatik deploy (`.github/workflows/deploy.yml`)
- Pull Request → preview ortami (`.github/workflows/preview.yml`)

### CI/CD Kurulumu (Ilk seferlik)
1. GitHub'da repo olustur ve kodu push et
2. Cloudflare Dashboard > "My Profile" > "API Tokens" > "Create Token"
3. "Edit Cloudflare Workers" template'ini sec ve token olustur
4. GitHub repo > Settings > Secrets > Actions > `CLOUDFLARE_API_TOKEN` ekle

### Deploy Akisi
```
Kod degisikligi -> git push -> GitHub Actions -> Build -> Cloudflare Workers'a Deploy
```

### Manuel Deploy (CI/CD olmadan)
```bash
npx wrangler login     # Ilk seferlik: Cloudflare hesabina giris
npm run deploy         # Build + deploy
```

### Ortam Degiskenleri
- Gelistirme: `.dev.vars` dosyasi (`.dev.vars.example`'i kopyala)
- Production: `npx wrangler secret put SECRET_NAME`

---

## PWA (Progressive Web App) - Mobil Uygulama Destegi

Bu proje PWA olarak yapilandirilmistir. Kullanicilar uygulamayi telefonlarinda "Ana Ekrana Ekle" yaparak native uygulama gibi kullanabilir.

**Kullanici "mobilde calissin", "telefonda kullanmak istiyorum", "uygulama olarak yuklensin" gibi bir sey derse:**
Bu zaten hazir! Uygulama deploy edildikten sonra telefondan acilip "Ana Ekrana Ekle" yapilabilir.

### PWA Dosyalari
- `public/manifest.json` - Uygulama adi, ikonu, renkleri, gorunum modu
- `public/sw.js` - Service Worker (cache yonetimi, offline destek)
- `index.html` - PWA meta tag'leri (apple-touch-icon, apple-mobile-web-app-capable)
- `src/client/main.tsx` - Service Worker kaydi

### manifest.json Guncelleme
Uygulama adi veya renkleri degisirse `public/manifest.json` dosyasini guncelle:
```json
{
  "name": "Uygulama Tam Adi",
  "short_name": "Kisa Ad",
  "description": "Uygulama aciklamasi",
  "theme_color": "#1a1a2e",
  "background_color": "#ffffff",
  "display": "standalone",
  "start_url": "/",
  "icons": [
    {
      "src": "/OPLOG.png",
      "sizes": "any",
      "type": "image/png"
    }
  ]
}
```

### Uygulama Ikonu Degistirme
1. Yeni ikonu `public/` klasorune koy (PNG, en az 512x512 piksel onerilir)
2. `public/manifest.json` dosyasindaki `icons` dizisini guncelle
3. `index.html` dosyasindaki `apple-touch-icon` href'ini guncelle
4. Birden fazla boyut eklemek icin (daha iyi gorunum):
```json
"icons": [
  { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },
  { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png" }
]
```

### Service Worker (Cache) Guncelleme
Eger offline davranisi degistirmek gerekirse `public/sw.js` dosyasini duzenle:
- `CACHE_NAME` versiyonunu artir (ornek: `"oplog-app-v2"`) → eski cache silinir
- `PRECACHE_URLS` dizisine offline'da gerekli dosyalari ekle
- API cagrilari (`/api/...`) cache'lenmez, her zaman agdan alinir

### PWA Test
1. `npm run build && npm run deploy` ile deploy et
2. Chrome'da deploy URL'ini ac → DevTools > Application > Manifest (kontrol et)
3. Telefonda URL'i ac → "Ana Ekrana Ekle" veya "Install App" secenegi cikar

---

## Mevcut Ozellikler

- [x] React 19 + TypeScript + Vite 6 (tek komutla frontend + backend)
- [x] Tailwind CSS 4 ile stil (oklch tema, dark mode)
- [x] shadcn/ui bilesen kutuphanesi (46 bilesen - TUMU yuklu)
- [x] DiceUI DataGrid (Excel-benzeri duzenlenebilir tablo)
- [x] shadcn MCP Server (bilesen arama/yukleme)
- [x] Hono.js backend + Cloudflare Workers
- [x] GitHub Actions CI/CD (push = otomatik deploy)
- [x] PWA (Progressive Web App) - mobilde kurulabilir uygulama
- [x] React Router ile sayfa yonlendirme
- [x] TanStack Query ile veri yonetimi (useApiQuery/useApiMutation)
- [x] Zod ile form validasyonu
- [x] React Hook Form ile form yonetimi
- [x] Sonner ile toast bildirimleri
- [x] Lucide React ile ikonlar
- [x] Recharts 3 ile grafik/chart (Bar, Area, Pie, Stacked Bar - interaktif)
- [x] Dark/Light/System tema destegi (ThemeProvider)
- [x] Responsive sidebar layout (desktop + mobil Sheet)
- [x] Error boundary
- [x] Loading/Skeleton bilesenleri
- [x] Animasyon (tw-animate-css)

---

## Onemli Uyarilar

1. **ASLA `node_modules/` veya `.dev.vars` commit etme**
2. **Deploy oncesi `npm run build` calistir** - Build hatalari deploy'u engeller
3. **next-themes KULLANMA** - Vite uyumlu degil, `@/components/theme-provider` kullan
4. **Yeni route eklerken 3 dosyayi guncelle:** route dosyasi, `routes/index.ts`, `worker/index.ts`
5. **Yeni sayfa eklerken 2-3 dosyayi guncelle:** sayfa dosyasi, `router.tsx`, opsiyonel `sidebar.tsx`
6. **Form olusturmak icin** React Hook Form + Zod + shadcn/ui Form pattern kullan (referans: `form-example.tsx`)
7. **Tablo olusturmak icin** shadcn/ui Table + useApiQuery pattern kullan (referans: `table-example.tsx`)
8. **API cagrilari icin** `useApiQuery` / `useApiMutation` hook'larini kullan, dogrudan `fetch` yazma
9. **shadcn/ui bileseni eklerken** `npx shadcn@latest add <bilesen>` kullan
10. **CSS degisiklikleri icin** Tailwind class'lari kullan, custom CSS yazma
11. **Chart renkleri icin** `var(--color-chart-1)` ... `var(--color-chart-5)` kullan, `hsl()` wrapper KULLANMA (Tailwind v4 oklch formati)
12. **DataGrid kullanirken** `DirectionProvider` + `TooltipProvider` ile SARMALA, `useDataGrid` hook'u provider icinde cagir (referans: `datagrid-example.tsx`)
