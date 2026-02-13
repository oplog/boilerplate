# CLAUDE.md - OPLOG App Builder Template

Bu dosya Claude Code'un bu projeyi anlamasini ve dogru sekilde kod yazmasi icin olusturulmustur.
Her zaman bu dosyayi referans al.

## Misyon

Bu proje OPLOG sirketi calisanlarina verilen bir uygulama gelistirme template'idir.
Bunu kullanan kisiler yazilimci DEGILDIR - Claude Code (yani sen) ile birlikte uygulama gelistirecekler.
Kullanici sana "su sayfayi ekle", "su API'yi yaz", "deploy et" gibi talimatlar verecek.
Sen bu template'in yapisina uygun sekilde kod yazacak, test edecek ve deploy edeceksin.

**Temel beklentiler:**
- Kullanici "bun run dev" dediginde hem frontend hem backend tek komutla ayaga kalkmali
- Kullanici "deploy et" dediginde `bun run deploy` veya `git push` ile CI/CD uzerinden deploy olmali
- Yeni sayfa, API, component eklerken bu dosyadaki kurallara uy
- Her degisiklikten sonra `bun run build` ile build'in basarili oldugunu dogrula
- Hata olursa kullaniciya acikla ve duzelt
- Kullanici yazilimci degildir, ona teknik jargon yerine basit aciklamalar yap

---

## Sayfa Sablonlari (ZORUNLU — SIFIRDAN SAYFA YAZMA)

Bu projede 6 adet sayfa sablonu ONCEDEN YUKLUDUR. Kullanici herhangi bir sayfa istegi yaptiginda ONCE asagidaki tabloya bak ve uygun sablonu KOPYALA + OZELLESTIR. Sifirdan sayfa olusturma YASAK.

### Sablon → Istek Eslestirme Tablosu

| Sablon Dosyasi | Ne Zaman Kullan | Tetikleyen Istekler |
|----------------|----------------|-------------------|
| `src/client/pages/templates/dashboard-template.tsx` | KPI, metrik, ozet gorunum, anasayfa | "dashboard yap", "ozet sayfa", "KPI ekrani", "ana ekran" |
| `src/client/pages/templates/crud-table-template.tsx` | Liste + ekleme/duzenleme/silme islemleri | "tablo yap", "liste sayfasi", "kayitlari goster", "CRUD" |
| `src/client/pages/templates/form-template.tsx` | Veri giris formu, kayit olusturma | "form yap", "kayit formu", "bilgi giris sayfasi" |
| `src/client/pages/templates/detail-template.tsx` | Tekil kayit detayi, profil | "detay sayfasi", "profil sayfasi", "kayit detayi" |
| `src/client/pages/templates/kanban-template.tsx` | Gorev takip, kanban board | "kanban yap", "gorev takip", "board gorunumu" |
| `src/client/pages/templates/report-template.tsx` | Rapor/analiz sayfasi, istatistik | "rapor sayfasi", "analiz gorunumu", "istatistikler" |

### Yeni Sayfa Olusturma (5 Adim)

**Adim 1:** Uygun sablonu belirle (yukaridaki tablo)
**Adim 2:** Sablon dosyasini oku, icerigi kopyalayarak yeni sayfa dosyasi olustur (`src/client/pages/`)
**Adim 3:** Kopyalanan sayfayi ozellestir (basliklar, veri alanlari, API endpoint'leri)
**Adim 4:** Router'a + Sidebar'a + Header pageTitles'a ekle
**Adim 5:** Command palette'e ekle (`src/client/components/command-palette.tsx` — pages dizisine)

```tsx
// router.tsx — children dizisine:
{ path: "/my-page", element: <MyPage /> },

// sidebar.tsx — mainNav dizisine:
{ name: "Sayfam", href: "/my-page", icon: LayoutDashboard },

// header.tsx — pageTitles'a:
"/my-page": "Sayfam",

// command-palette.tsx — pages dizisine:
{ name: "Sayfam", href: "/my-page", icon: LayoutDashboard },
```

### @oplog Registry (Ek Bilesenler)

OPLOG'un merkezi bilesen registry'si: `https://nexus-ui.oplog.io/r/{name}.json`

Ek bilesen ihtiyaci icin (genellikle gerekmez, template'ler yeterlidir):
```bash
bunx shadcn add @oplog/{item-adi}
```

| Block | Aciklama |
|-------|----------|
| `@oplog/stats-card` | Parametrik KPI karti |
| `@oplog/empty-state` | Bos durum gosterimi |
| `@oplog/confirm-dialog` | Silme/onay diyalogu |
| `@oplog/filter-bar` | Filtre bari |
| `@oplog/page-header` | Sayfa baslik bileseni |
| `@oplog/loading` | Yukleme gosterimi |
| `@oplog/error-boundary` | Hata yakalama |
| `@oplog/use-api` | API hook'lari |
| `@oplog/user-context` | Zero Trust user hook'u |

---

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
│   │   │   ├── shared/          # Paylasilan bilesenler (page-header, loading, error-boundary, navigation-progress, showcase-card)
│   │   │   ├── blocks/          # @blocks registry bilesenleri (table, dialog, form-layout vs.)
│   │   │   ├── ui/              # shadcn/ui + @diceui bilesenleri (60+ adet)
│   │   │   ├── data-grid/       # DiceUI DataGrid bilesenleri (Excel-benzeri tablo)
│   │   │   ├── command-palette.tsx  # Global Cmd+K spotlight (sayfa arama, tema, aksiyonlar)
│   │   │   ├── theme-provider.tsx  # Dark/Light mod yonetimi
│   │   │   └── mode-toggle.tsx     # Tema degistirme butonu
│   │   ├── hooks/               # Custom React hook'lari
│   │   │   ├── use-api.ts       # API veri cekme/gonderme hook'lari
│   │   │   ├── use-user.ts      # Zero Trust kullanici bilgisi hook'u
│   │   │   └── use-mobile.ts    # Mobil cihaz algilama hook'u
│   │   ├── lib/                 # Yardimci fonksiyonlar
│   │   │   ├── api-client.ts    # HTTP istemcisi (/api/... cagrilari)
│   │   │   └── utils.ts         # cn() yardimci fonksiyonu
│   │   ├── pages/               # Sayfa bilesenleri
│   │   │   ├── home.tsx         # Ana sayfa (rehber/ornek promptlar)
│   │   │   ├── not-found.tsx    # 404 sayfasi
│   │   │   ├── showcase.tsx     # Bilesen Katalogu (/showcase)
│   │   │   ├── showcase/        # Katalog tab bilesenleri (form-inputs, data-display, layout-nav, overlay-feedback, blocks-showcase, advanced-showcase)
│   │   │   ├── templates/       # SAYFA SABLONLARI (kopyala + ozellestir)
│   │   │   │   ├── dashboard-template.tsx    # KPI + chart + tablo
│   │   │   │   ├── crud-table-template.tsx   # CRUD liste + dialog
│   │   │   │   ├── form-template.tsx         # Form + validasyon
│   │   │   │   ├── detail-template.tsx       # Detay + tabs + timeline
│   │   │   │   ├── kanban-template.tsx       # Kanban board
│   │   │   │   └── report-template.tsx       # Rapor + analiz
│   │   │   └── examples/        # Ornek sayfalar (form, table, chart, datagrid, stats, sidebar)
│   │   ├── main.tsx             # Uygulama giris noktasi (ThemeProvider, QueryClient, Router)
│   │   ├── router.tsx           # React Router yapilandirmasi
│   │   └── index.css            # Tailwind CSS 4 tema ve global stiller
│   └── worker/                  # Backend (Hono.js + Cloudflare Workers)
│       ├── middleware/
│       │   └── auth.ts          # Cloudflare Zero Trust JWT middleware
│       ├── routes/              # API route dosyalari
│       │   ├── index.ts         # Route aggregator
│       │   ├── health.ts        # GET /api/health
│       │   ├── me.ts            # GET /api/me - kullanici bilgisi
│       │   └── examples.ts      # CRUD /api/examples
│       ├── lib/
│       │   ├── types.ts         # Paylasilan TypeScript tipleri
│       │   └── openapi.ts       # OpenAPI 3.0 spec (Swagger UI icin)
│       └── index.ts             # Hono ana giris noktasi, middleware ve route kaydi
├── public/                      # Statik dosyalar (OPLOG.png, fonts/, sw.js, manifest.json)
├── .github/workflows/           # CI/CD (deploy.yml, preview.yml)
├── .mcp.json                    # shadcn MCP Server yapilandirmasi
├── components.json              # shadcn/ui yapilandirmasi (@oplog, @diceui, @blocks registries)
├── wrangler.jsonc               # Cloudflare Workers yapilandirmasi
├── vite.config.ts               # Vite yapilandirmasi (React + Tailwind + Cloudflare)
├── tsconfig.json                # TypeScript yapilandirmasi (@ alias)
├── package.json                 # Bagimliliklar ve script'ler
└── index.html                   # HTML giris noktasi
```

## Hizli Baslatma Komutlari

```bash
bun install          # Bagimliliklari yukle
bun run dev          # Gelistirme sunucusunu baslat (http://localhost:5173)
bun run build        # Production build olustur
bun run deploy       # Cloudflare Workers'a deploy et
bun run cf-typegen   # Cloudflare binding type'larini olustur
```

---

## Auth Sistemi (Cloudflare Zero Trust)

Bu projede login sayfasi YOKTUR. Kimlik dogrulama Cloudflare Zero Trust tarafindan edge'de yapilir.

### Nasil Calisir

```
Kullanici → Cloudflare Zero Trust (login burada) → App Worker → Uygulama
```

1. Kullanici uygulamaya erismeye calisir
2. Cloudflare Zero Trust kullaniciyi authenticate eder (Google, SAML, vb.)
3. Basarili giris sonrasi `Cf-Access-Jwt-Assertion` header'i ile request worker'a ulasir
4. Worker middleware bu header'dan user email/name cikarir
5. Frontend `/api/me` endpoint'inden kullanici bilgisini alir

### Backend'de Kullanici Bilgisi

```typescript
// Herhangi bir route handler'da:
app.get("/my-route", (c) => {
  const user = c.get("user"); // { email: string, name: string }
  return c.json({ greeting: `Merhaba ${user.name}` });
});
```

### Frontend'de Kullanici Bilgisi

```tsx
import { useUser } from "@/hooks/use-user";

function MyComponent() {
  const { user, isLoading } = useUser();
  // user: { email: string, name: string } | null
  return <p>Merhaba {user?.name}</p>;
}
```

### Cikis Yap

```tsx
// Sidebar'da zaten var, manual eklemek icin:
<a href="/.auth/logout">Cikis Yap</a>
```

**ONEMLI:**
- Login sayfasi EKLEME — Zero Trust hallediyor
- KindeProvider, AuthGate gibi frontend auth bilesenleri KULLANMA
- `@kinde-oss/kinde-auth-react` paketi KULLANMA
- Gelistirme ortaminda JWT olmadan varsayilan kullanici (dev@oplog.com) kullanilir

---

## Frontend Gelistirme Kurallari

### Yeni Sayfa Ekleme (Adim Adim)

Kullanici "yeni bir sayfa ekle" dediginde:

**ONCE `src/client/pages/templates/` dizinindeki sablonlara bak!**
Uygun sablon bul → Oku → Kopyala → Ozellestir.

**Adim 1:** Uygun sablonu belirle ve oku (orn: `templates/dashboard-template.tsx`)
**Adim 2:** Kopyalayarak yeni sayfa olustur: `src/client/pages/my-page.tsx`
**Adim 3:** Sayfayi ozellestir (basliklar, veri, alanlar, API endpoint'leri degistir)
**Adim 4:** Router + Sidebar + Header'a ekle
**Adim 5:** Command palette'e ekle (`command-palette.tsx` — pages dizisine)

```tsx
// router.tsx
import { MyPage } from "@/pages/my-page";
{ path: "/my-page", element: <MyPage /> },

// sidebar.tsx — mainNav dizisine:
{ name: "Sayfam", href: "/my-page", icon: LayoutDashboard },

// header.tsx — pageTitles'a:
"/my-page": "Sayfam",

// command-palette.tsx — pages dizisine:
{ name: "Sayfam", href: "/my-page", icon: LayoutDashboard },
```

### Yeni API Endpoint Ekleme (Adim Adim)

Kullanici "yeni bir API yaz" dediginde su 4 adimi takip et:

**Adim 1: Route dosyasini olustur**
```typescript
// src/worker/routes/my-route.ts
import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import type { UserContext } from "../middleware/auth";

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
});

const app = new Hono<{ Variables: { user: UserContext } }>()
  .get("/", (c) => {
    const user = c.get("user");
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

**Adim 4: OpenAPI spec'e ekle**
```typescript
// src/worker/lib/openapi.ts — paths objesine yeni endpoint'i ekle
// Swagger UI (/api/docs) otomatik olarak goruntuler
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
  invalidateKeys: [["my-items"]],
});

createMutation.mutate(
  { name: "Ali", email: "ali@oplog.com" },
  {
    onSuccess: () => toast.success("Kaydedildi!"),
    onError: (err) => toast.error(err.message),
  }
);
```

---

## Bilesen Katalogu

### shadcn/ui Primitives (Tumu Yuklu)

**Layout & Navigation:**
accordion, breadcrumb, carousel, collapsible, menubar, navigation-menu, pagination, resizable, scroll-area, separator, sheet, sidebar, tabs

**Form & Input:**
button, calendar, checkbox, combobox, field, input, input-otp, label, radio-group, select, slider, switch, tags-input, textarea, time-picker, toggle, toggle-group

**Data Display:**
avatar, badge, card, chart, field, kbd, message-card, progress, skeleton, stat, status, table

**Overlay & Feedback:**
alert, alert-dialog, aspect-ratio, command, context-menu, dialog, drawer, dropdown-menu, file-upload, hover-card, popover, responsive-dialog, sonner (toast), tooltip, tour

### @diceui Bilesenleri (Tumu Yuklu)

| Bilesen | Import | Ne Icin |
|---------|--------|---------|
| `kanban` | `@/components/ui/kanban` | Surukle-birak kanban board |
| `timeline` | `@/components/ui/timeline` | Zaman cizelgesi gorunumu |
| `stepper` | `@/components/ui/stepper` | Cok adimli wizard/stepper |
| `combobox` | `@/components/ui/combobox` | Aranabilir dropdown |
| `file-upload` | `@/components/ui/file-upload` | Dosya yukleme (drag & drop) |
| `time-picker` | `@/components/ui/time-picker` | Saat secici |
| `tags-input` | `@/components/ui/tags-input` | Etiket/tag giris alani |
| `sortable` | `@/components/ui/sortable` | Surukle-birak siralama |
| `responsive-dialog` | `@/components/ui/responsive-dialog` | Mobilde drawer, desktop'ta dialog |
| `tour` | `@/components/ui/tour` | Kullanici rehber turu |
| `stat` | `@/components/ui/stat` | Istatistik karti |
| `status` | `@/components/ui/status` | Durum gostergesi (dot/badge) |

### @blocks Bilesenleri (Hazir Sayfalar)

`src/client/components/blocks/` dizinindedir. Dogrudan import edip kullan veya referans olarak kopyala:

| Block | Ne Icin |
|-------|---------|
| `table-05` | Gelismis tablo (filtreleme, siralama, toplu islem) |
| `table-03` | Basit tablo (badge'li satir durum gosterimi) |
| `form-layout-02` | Yan label'li form layout |
| `dialog-01` | Basit dialog |
| `dialog-11` | Form iceren dialog (select, input) |
| `file-upload-04` | Progress bar'li dosya yukleme |
| `command-menu-01` | Klavye kisayol menusu (Cmd+K) |

### shadcn-hooks (Yardimci Hook'lar)

~25 yardimci hook `src/client/hooks/` dizininde yukludur. Dogrudan import edip kullan:

| Kategori | Hook'lar |
|----------|---------|
| **Durum Yonetimi** | `useBoolean`, `useCounter`, `useToggle` |
| **Zamanlama** | `useDebounce`, `useThrottle`, `useInterval`, `useTimeout` |
| **Yasam Dongusu** | `useMount`, `useUnmount`, `useUpdateEffect` |
| **Tarayici** | `useClickAway`, `useClipboard`, `useDocumentVisibility`, `useElementSize`, `useEventListener` |
| **DOM** | `useHover`, `useInViewport`, `useIsOnline`, `useScrollLock` |
| **Ileri Duzey** | `usePrevious`, `useLatest`, `useMemoizedFn`, `useLockFn`, `useWhyDidYouUpdate` |

```tsx
import { useBoolean } from "@/hooks/use-boolean";
import { useDebounce } from "@/hooks/use-debounce";

const [isOpen, { setTrue, setFalse, toggle }] = useBoolean(false);
const debouncedSearch = useDebounce(searchTerm, 300);
```

### DiceUI DataGrid (Excel-benzeri Tablo)

Projede DiceUI DataGrid onceden yukludur. Excel/Google Sheets benzeri duzenlenebilir tablo icin kullan.

**Referans dosya:** `src/client/pages/examples/datagrid-example.tsx`

**KRITIK: DirectionProvider + TooltipProvider SARMALAMA ZORUNLU**

```tsx
import { DirectionProvider } from "@radix-ui/react-direction";
import { DataGrid } from "@/components/data-grid/data-grid";
import { useDataGrid } from "@/hooks/use-data-grid";
import { TooltipProvider } from "@/components/ui/tooltip";

// DOGRU - iki bilesen kullan:
function DataGridContent() {
  const { table, ...dataGridProps } = useDataGrid({
    data, columns, onDataChange: setData, getRowId: (row) => row.id,
  });
  return <DataGrid table={table} {...dataGridProps} height={400} />;
}

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

**Desteklenen hucre tipleri (variant):**
| Variant | Aciklama |
|---------|----------|
| `short-text` | Kisa metin |
| `long-text` | Uzun metin |
| `number` | Sayi |
| `url` | Link |
| `checkbox` | Onay kutusu |
| `select` | Tekli secim |
| `multi-select` | Coklu secim |
| `date` | Tarih secici |
| `file` | Dosya yukleme |

---

## Tablo Sayfasi Olusturma

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

## Form Sayfasi Olusturma

Referans dosya: `src/client/pages/examples/form-example.tsx`

```tsx
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { toast } from "sonner";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const formSchema = z.object({
  name: z.string().min(1, "Isim zorunlu"),
  email: z.string().email("Gecerli email gir"),
});

export function MyFormPage() {
  const form = useForm({
    defaultValues: { name: "", email: "" },
    validators: { onSubmit: formSchema },
    onSubmit: ({ value }) => {
      toast.success("Kaydedildi!");
    },
  });

  return (
    <Card className="max-w-md">
      <CardHeader><CardTitle>Yeni Kayit</CardTitle></CardHeader>
      <CardContent>
        <form onSubmit={(e) => { e.preventDefault(); form.handleSubmit(); }} className="space-y-4">
          <form.Field name="name">
            {(field) => {
              const hasError = field.state.meta.isTouched && field.state.meta.errors.length > 0;
              return (
                <Field data-invalid={hasError || undefined}>
                  <FieldLabel htmlFor={field.name}>Isim</FieldLabel>
                  <Input id={field.name} value={field.state.value} onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)} />
                  {hasError && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>
          <form.Field name="email">
            {(field) => {
              const hasError = field.state.meta.isTouched && field.state.meta.errors.length > 0;
              return (
                <Field data-invalid={hasError || undefined}>
                  <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                  <Input id={field.name} type="email" value={field.state.value} onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)} />
                  {hasError && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>
          <Button type="submit">Kaydet</Button>
        </form>
      </CardContent>
    </Card>
  );
}
```

---

## Grafik/Chart Ekleme

Recharts + shadcn/ui Chart bileseni yukludur.

**Referans dosya:** `src/client/pages/examples/chart-example.tsx`

**ONEMLI KURALLAR:**
- Renk olarak `var(--color-chart-1)` ile `var(--color-chart-5)` kullan
- `hsl()` wrapper KULLANMA - renkler oklch formatinda
- ChartConfig'de tanimlanan key'ler otomatik olarak `--color-{key}` CSS degiskeni olusturur

```tsx
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";

const chartConfig: ChartConfig = {
  siparisler: { label: "Siparisler", color: "var(--color-chart-1)" },
  iadeler: { label: "Iadeler", color: "var(--color-chart-4)" },
};

<ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
  <BarChart data={data} accessibilityLayer>
    <CartesianGrid vertical={false} />
    <XAxis dataKey="month" tickLine={false} axisLine={false} />
    <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dashed" />} />
    <Bar dataKey="siparisler" fill="var(--color-siparisler)" radius={4} />
    <Bar dataKey="iadeler" fill="var(--color-iadeler)" radius={4} />
  </BarChart>
</ChartContainer>
```

---

## Stil ve Tema

- Tailwind CSS 4 (CSS-native yaklasim)
- Tema degiskenleri `src/client/index.css` (oklch renk uzayi)
- Font: **Uber Move** (tek font, DEGISTIRME)
- `cn()` fonksiyonu: `import { cn } from "@/lib/utils"`
- `@/` alias → `src/client/`

### Dark Mode

`ThemeProvider` ile yonetilir. `next-themes` KULLANMA!

```tsx
import { useTheme } from "@/components/theme-provider";
const { theme, setTheme } = useTheme();
```

### Toast
```tsx
import { toast } from "sonner";
toast.success("Basarili!");
```

### Ikonlar
```tsx
import { Home, Users, Settings } from "lucide-react";
<Home className="h-4 w-4" />
```

---

## Backend Gelistirme Kurallari

### Mevcut API Endpoint'leri
- `GET /api/health` - Sunucu durumu
- `GET /api/me` - Oturum acmis kullanici bilgisi (Zero Trust)
- `GET /api/examples` - Ornek liste (pagination + search)
- `POST /api/examples` - Yeni ornek ekle
- `PUT /api/examples/:id` - Ornek guncelle
- `DELETE /api/examples/:id` - Ornek sil
- `GET /api/docs` - Swagger UI (interaktif API dokumantasyonu)
- `GET /api/docs/openapi.json` - OpenAPI 3.0 spec (JSON)

### Hono Middleware'ler (aktif)
- `logger()` - Request loglama
- `cors()` - CORS (/api/*)
- `authMiddleware` - Zero Trust JWT → user bilgisi (/api/*)

### Cloudflare Bindings

```typescript
// D1 veritabani
const result = await c.env.DB.prepare("SELECT * FROM users").all();

// KV store
await c.env.KV.put("key", "value");
const value = await c.env.KV.get("key");
```

Binding eklemek icin:
1. `wrangler.jsonc` dosyasindaki yorumlu satirlari ac
2. `src/worker/index.ts` dosyasindaki `Env` type'ina ekle
3. `bun run cf-typegen` calistir

### D1 Veritabani

```bash
bunx wrangler d1 create oplog-app-db
bunx wrangler d1 migrations create oplog-app-db initial
bunx wrangler d1 migrations apply oplog-app-db --local   # lokal
bunx wrangler d1 migrations apply oplog-app-db            # production
```

### Gateway Entegrasyonu (DIA/Databricks)

DIA/Databricks verisine erisim nexus-gateway uzerinden yapilir (M2M).
Gateway entegrasyonu SADECE backend'de yapilir. Frontend'den erisim YOKTUR.

---

## Ortam Degiskenleri

- Gelistirme: `.dev.vars` dosyasi
- Production: `bunx wrangler secret put SECRET_NAME`
- Frontend: `VITE_` prefix'i → `import.meta.env.VITE_*`
- Backend: `c.env.SECRET_NAME`

---

## Deploy ve CI/CD

```bash
bun run deploy                    # Cloudflare Workers'a deploy
```

- `main` branch'e push → otomatik deploy (GitHub Actions)
- Pull Request → preview ortami
- Ilk kurulum: GitHub repo > Settings > Secrets > `CLOUDFLARE_API_TOKEN` ekle

---

## PWA (Progressive Web App)

Uygulama PWA olarak yapilandirilmistir.
- `public/manifest.json` - Uygulama adi, ikonu
- `public/sw.js` - Service Worker (cache)

---

## OPLOG Uygulama Standartlari (ZORUNLU — IHLAL ETME)

### Sablon Kullanimi (EN ONEMLI KURAL)
1. **Yeni sayfa istegi geldiginde ONCE `src/client/pages/templates/` dizinindeki sablonlara bak**
2. **Uygun sablon varsa KOPYALA + OZELLESTIR** — sifirdan sayfa YAZMA
3. **Sablondaki yapiyi, bilesenleri ve pattern'leri koru** — farkli UI bileseni veya yaklasim KULLANMA
4. **6 sablondan hicbiri uygun degilse** en yakin sablonu baz al ve adapte et

### Bilesen Kullanimi (SADECE YUKLU OLANLAR)
5. **SADECE projede yuklu bilesenleri kullan** — `bun install` ile yeni paket EKLEME
6. **shadcn/ui + @diceui + @blocks bilesenleri zaten yuklu** — bunlar disinda UI kutuphanesi KULLANMA
7. **Lucide React ikon kullan** — baska ikon kutuphanesi YASAK (Font Awesome, Heroicons vb.)
8. **Recharts + ChartContainer kullan** — baska chart kutuphanesi YASAK
9. **@tanstack/react-form + Zod kullan** — baska form/validasyon kutuphanesi YASAK (react-hook-form KULLANMA)
10. **Sonner toast kullan** — `alert()`, `window.confirm()` YASAK
11. **useApiQuery/useApiMutation kullan** — raw `fetch` YASAK

### Stil ve Tema
12. **Tema degiskenlerini kullan** — hardcoded renk YASAK (`bg-background`, `text-foreground` vs.)
13. **Uber Move fontunu DEGISTIRME** — tek font, baska font EKLEME
14. **Tailwind class kullan** — custom CSS dosyasi YAZMA
15. **`var(--color-chart-1..5)` kullan** — chart renklerinde `hsl()` KULLANMA

### Auth ve Altyapi
16. **Login sayfasi EKLEME** — Cloudflare Zero Trust hallediyor
17. **next-themes KULLANMA** — `@/components/theme-provider` kullan
18. **DIA/Databricks → SADECE nexus-gateway uzerinden**
19. **Her degisiklikten sonra `bun run build` calistir**
20. **Bun kullan** — `npm` ve `npx` YASAK, her yerde `bun` / `bunx` kullan

---

## Isimlendirme Kurallari

| Oge | Kural | Ornek |
|-----|-------|-------|
| Dosya adlari | kebab-case | `my-component.tsx` |
| Bilesen adlari | PascalCase | `export function MyComponent()` |
| API endpoint'leri | kebab-case | `/api/my-endpoint` |
| Hook'lar | camelCase, "use" ile baslar | `useApiQuery` |
| Tipler | PascalCase | `type MyType = { ... }` |

---

## Entegre Ozellikler

### Navigation Progress Bar
Sayfa gecislerinde ve API yuklemelerinde ust kisimda ince yukleme cubugu goruntulenir.
- Otomatik: Route degisikliginde ve TanStack Query fetch sirasinda calisir
- Dosya: `src/client/components/shared/navigation-progress.tsx`
- Ek yapilandirma GEREKMEZ — root-layout'a onceden eklenmistir

### Command Palette (Cmd+K / Ctrl+K)
Global spotlight — sayfa arama, sablon secimi, tema degistirme, hizli aksiyonlar.
- `Cmd+K` / `Ctrl+K` ile acilir
- Header'daki "Ara... ⌘K" butonuyla da acilir
- Dosya: `src/client/components/command-palette.tsx`
- **Yeni sayfa eklerken** bu dosyadaki `pages` dizisine de eklemeyi unutma!

### Swagger / OpenAPI Dokumantasyonu
`/api/docs` adresinde interaktif API dokumantasyonu.
- Swagger UI: `GET /api/docs`
- OpenAPI JSON: `GET /api/docs/openapi.json`
- Spec dosyasi: `src/worker/lib/openapi.ts`
- Auth middleware'den ONCE mount edilmistir (erisim icin auth gerekmez)
- **Yeni API endpoint eklerken** spec dosyasina OpenAPI metadata ekle

### Bilesen Katalogu (/showcase)
Tum bilesenleri, bloklari ve ileri duzey ogeleri gosteren tek sayfa.
- 6 tab: Form & Giris, Veri Gosterim, Layout & Navigasyon, Overlay & Geri Bildirim, Bloklar, Gelismis
- Dosya: `src/client/pages/showcase.tsx` + `src/client/pages/showcase/` dizini
- Her bilesenin canli demo'su mevcuttur

---

## Onemli Uyarilar

1. **ASLA `node_modules/` veya `.dev.vars` commit etme**
2. **Deploy oncesi `bun run build` calistir**
3. **Yeni route eklerken 4 dosyayi guncelle:** route dosyasi, `routes/index.ts`, `worker/index.ts`, `lib/openapi.ts`
4. **Yeni sayfa eklerken 5 dosyayi guncelle:** sayfa dosyasi, `router.tsx`, `sidebar.tsx`, `header.tsx`, `command-palette.tsx`
5. **DataGrid kullanirken** `DirectionProvider` + `TooltipProvider` ile SARMALA
6. **Chart renkleri icin** `var(--color-chart-1..5)` kullan, `hsl()` KULLANMA
