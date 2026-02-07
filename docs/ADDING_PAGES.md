# Yeni Sayfa Ekleme Rehberi

Bu rehber, uygulamaya yeni bir sayfa eklemenin adimlarini anlatir. Her adimda hem manuel yontemi hem de Claude Code ile nasil yapilacagi aciklanmistir.

---

## Genel Bakis

Yeni bir sayfa eklemek icin 3 adim gereklidir:

1. **Sayfa dosyasini olustur** - `src/client/pages/` altinda
2. **Route tanimini ekle** - `src/client/router.tsx` dosyasina
3. **Sidebar linkini ekle** (opsiyonel) - `src/client/components/layout/sidebar.tsx` dosyasina

---

## Adim 1: Sayfa Dosyasini Olustur

`src/client/pages/` dizini altinda yeni bir `.tsx` dosyasi olustur. Dosya adi **kebab-case** olmalidir.

### Sablon

```tsx
// src/client/pages/my-page.tsx

import { PageHeader } from "@/components/shared/page-header";

export function MyPage() {
  return (
    <div>
      <PageHeader
        title="Sayfa Basligi"
        description="Sayfa hakkinda kisa aciklama"
      />

      {/* Sayfa icerigi buraya */}
      <div>
        <p>Merhaba, bu yeni bir sayfa!</p>
      </div>
    </div>
  );
}
```

### Kurallar

- Dosya adi kebab-case olmali: `my-page.tsx`, `order-list.tsx`, `user-settings.tsx`
- Bilesen adi PascalCase olmali: `MyPage`, `OrderList`, `UserSettings`
- **Named export** kullanilmali (default export degil): `export function MyPage()`
- Her sayfanin basinda `PageHeader` bileseni kullanilmali
- `@/` alias'i ile import yap: `import { Button } from "@/components/ui/button"`

### Alt Dizin Kullanimi

Iliskili sayfalar icin alt dizin olusturabilirsiniz:

```
src/client/pages/
├── home.tsx
├── about.tsx
├── orders/
│   ├── order-list.tsx
│   └── order-detail.tsx
└── settings/
    ├── general.tsx
    └── profile.tsx
```

---

## Adim 2: Route Tanimini Ekle

`src/client/router.tsx` dosyasini ac ve yeni sayfanin route'unu ekle.

### Ornek

```tsx
// src/client/router.tsx

import { createBrowserRouter } from "react-router-dom";
import { RootLayout } from "@/components/layout/root-layout";
import { HomePage } from "@/pages/home";
import { AboutPage } from "@/pages/about";
import { MyPage } from "@/pages/my-page";           // <-- Yeni import

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/about", element: <AboutPage /> },
      { path: "/my-page", element: <MyPage /> },     // <-- Yeni route
    ],
  },
]);
```

### URL Path Kurallari

- Kebab-case kullan: `/my-page`, `/order-list`
- Alt dizinler icin: `/orders/list`, `/settings/profile`
- Dinamik parametreler icin: `/orders/:id`, `/users/:userId`

---

## Adim 3: Sidebar Linkini Ekle (Opsiyonel)

Yeni sayfa sidebar'da gorunsun istiyorsan, `src/client/components/layout/sidebar.tsx` dosyasini guncelle.

### Ornek

```tsx
// src/client/components/layout/sidebar.tsx

import {
  Home,
  Info,
  FileText,
  Table,
  Package,        // <-- Yeni ikon import'u (Lucide'den)
} from "lucide-react";

// Navigasyon menu ogeleri
const navigation = [
  { name: "Ana Sayfa", href: "/", icon: Home },
  { name: "Hakkinda", href: "/about", icon: Info },
  { name: "Yeni Sayfam", href: "/my-page", icon: Package },  // <-- Yeni link
];
```

### Ikon Secimi

Lucide React'ten uygun ikon secin. Tum ikonlar icin: [https://lucide.dev/icons](https://lucide.dev/icons)

Sik kullanilan ikonlar:
- `Home` - Ana sayfa
- `Package` - Urun/paket
- `ShoppingCart` - Siparis
- `Users` - Kullanicilar
- `Settings` - Ayarlar
- `BarChart3` - Grafikler/raporlar
- `Truck` - Kargo/lojistik
- `Warehouse` - Depo
- `ClipboardList` - Liste/envanter
- `FileText` - Dokuman/form

---

## Tam Ornek: Urunler Sayfasi

Asagida, API'den veri ceken bir urunler sayfasinin tam ornegi vardir:

### 1. Sayfa Dosyasi

```tsx
// src/client/pages/products.tsx

import { useApiQuery } from "@/hooks/use-api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/shared/page-header";
import { TableSkeleton } from "@/components/shared/loading";
import { Button } from "@/components/ui/button";

type Product = {
  id: string;
  name: string;
  price: number;
  stock: number;
  status: "active" | "inactive";
};

type ProductsResponse = {
  items: Product[];
  total: number;
};

export function ProductsPage() {
  const { data, isLoading } = useApiQuery<ProductsResponse>(
    ["products"],
    "/products"
  );

  return (
    <div>
      <PageHeader
        title="Urunler"
        description="Urun listesi ve yonetimi"
        actions={<Button>Yeni Urun Ekle</Button>}
      />

      <Card>
        <CardHeader>
          <CardTitle>Urun Listesi</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <TableSkeleton />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Urun Adi</TableHead>
                  <TableHead>Fiyat</TableHead>
                  <TableHead>Stok</TableHead>
                  <TableHead>Durum</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.items.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.price} TL</TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell>
                      <Badge variant={product.status === "active" ? "default" : "secondary"}>
                        {product.status === "active" ? "Aktif" : "Pasif"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
```

### 2. Route Ekleme

```tsx
// src/client/router.tsx - children dizisine ekle
{ path: "/products", element: <ProductsPage /> },
```

### 3. Sidebar Ekleme

```tsx
// sidebar.tsx - navigation dizisine ekle
{ name: "Urunler", href: "/products", icon: Package },
```

---

## Claude Code ile Sayfa Ekleme

Claude Code'a asagidaki gibi komutlar vererek sayfa ekleyebilirsiniz:

### Basit Sayfa

```
> "Ayarlar sayfasi olustur, basit bir baslik ve aciklama metni olsun"
```

### Tablo Sayfasi

```
> "Musteriler sayfasi olustur. Tabloda musteri adi, email, telefon ve kayit tarihi gosterilsin.
   API'den /api/customers endpoint'inden veri ceksin."
```

### Form Sayfasi

```
> "Yeni siparis olusturma sayfasi ekle. Formda musteri adi, urun secimi, adet ve
   teslimat adresi alanlari olsun. Form gonderilince /api/orders endpoint'ine POST atsin."
```

### Dashboard Sayfasi

```
> "Depo durumu sayfasi olustur. 4 istatistik karti olsun: toplam urun, bos raf,
   bugunun girisleri ve cikislari. Kartlarin altinda son islemler tablosu olsun."
```

### Detay Sayfasi

```
> "Siparis detay sayfasi olustur. URL'den siparis ID'sini alsin (/orders/:id).
   Siparis bilgilerini, urun listesini ve durum gecmisini gostersin."
```

---

## Ipuclari

1. **Mevcut orneklere bak** - `src/client/pages/examples/` altindaki dosyalar iyi birer referanstir
2. **PageHeader kullan** - Tum sayfalarda tutarli bir gorunum saglar
3. **Loading durumunu unutma** - Veri cekerken `isLoading` kontrolu yap
4. **Responsive tasarim** - Mobil ve desktop icin farkli gorunumler tanimla
5. **Toast bildirimler kullan** - Islem sonuclari icin `toast.success()` ve `toast.error()`
