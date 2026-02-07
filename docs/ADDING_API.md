# Yeni API Endpoint Ekleme Rehberi

Bu rehber, backend'e yeni API endpoint'leri eklemenin adimlarini anlatir. Backend, Hono.js framework'u uzerinde calisir ve Cloudflare Workers'a deploy edilir.

---

## Genel Bakis

Yeni bir API endpoint eklemek icin 4 adim gereklidir:

1. **Route dosyasini olustur** - `src/worker/routes/` altinda
2. **Route aggregator'a ekle** - `src/worker/routes/index.ts` dosyasina
3. **Ana uygulamaya bagla** - `src/worker/index.ts` dosyasina
4. **Frontend'den cagir** - `src/client/` icinden API'yi kullan

---

## Adim 1: Route Dosyasini Olustur

`src/worker/routes/` dizini altinda yeni bir `.ts` dosyasi olustur.

### Basit GET Endpoint

```typescript
// src/worker/routes/products.ts

import { Hono } from "hono";

const app = new Hono()
  .get("/", (c) => {
    const products = [
      { id: "1", name: "Urun A", price: 100 },
      { id: "2", name: "Urun B", price: 200 },
    ];
    return c.json({ items: products, total: products.length });
  });

export default app;
```

### CRUD Endpoint'leri (Tam Ornek)

```typescript
// src/worker/routes/orders.ts

import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

// Validation semasi
const orderSchema = z.object({
  customerName: z.string().min(1, "Musteri adi zorunlu"),
  product: z.string().min(1, "Urun secimi zorunlu"),
  quantity: z.number().min(1, "Adet en az 1 olmali"),
  address: z.string().optional(),
});

type Order = {
  id: string;
  customerName: string;
  product: string;
  quantity: number;
  address?: string;
  status: string;
  createdAt: string;
};

// Gecici veri (gercek projede D1 veritabani kullan)
let orders: Order[] = [];

const app = new Hono()
  // Tum siparisleri listele
  .get("/", (c) => {
    const page = Number(c.req.query("page") || "1");
    const limit = Number(c.req.query("limit") || "10");

    const total = orders.length;
    const start = (page - 1) * limit;
    const paginated = orders.slice(start, start + limit);

    return c.json({
      items: paginated,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  })

  // Tek siparis getir
  .get("/:id", (c) => {
    const order = orders.find((o) => o.id === c.req.param("id"));
    if (!order) {
      return c.json({ error: "Siparis bulunamadi" }, 404);
    }
    return c.json({ item: order });
  })

  // Yeni siparis olustur
  .post("/", zValidator("json", orderSchema), (c) => {
    const data = c.req.valid("json");
    const newOrder: Order = {
      id: crypto.randomUUID(),
      ...data,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    orders.push(newOrder);
    return c.json({ item: newOrder }, 201);
  })

  // Siparis guncelle
  .put("/:id", zValidator("json", orderSchema.partial()), (c) => {
    const idx = orders.findIndex((o) => o.id === c.req.param("id"));
    if (idx === -1) {
      return c.json({ error: "Siparis bulunamadi" }, 404);
    }
    orders[idx] = { ...orders[idx], ...c.req.valid("json") };
    return c.json({ item: orders[idx] });
  })

  // Siparis sil
  .delete("/:id", (c) => {
    const idx = orders.findIndex((o) => o.id === c.req.param("id"));
    if (idx === -1) {
      return c.json({ error: "Siparis bulunamadi" }, 404);
    }
    orders.splice(idx, 1);
    return c.json({ success: true });
  });

export default app;
```

---

## Adim 2: Route Aggregator'a Ekle

`src/worker/routes/index.ts` dosyasina yeni route'un export'unu ekle:

```typescript
// src/worker/routes/index.ts

export { default as health } from "./health";
export { default as examples } from "./examples";
export { default as orders } from "./orders";        // <-- Yeni eklenen
```

---

## Adim 3: Ana Uygulamaya Bagla

`src/worker/index.ts` dosyasinda yeni route'u import et ve `.route()` ile bagla:

```typescript
// src/worker/index.ts

import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import health from "./routes/health";
import examples from "./routes/examples";
import orders from "./routes/orders";                 // <-- Yeni import

export type Env = {
  ASSETS: Fetcher;
};

const app = new Hono<{ Bindings: Env }>()
  .use("*", logger())
  .use("/api/*", cors())
  .route("/api/health", health)
  .route("/api/examples", examples)
  .route("/api/orders", orders);                      // <-- Yeni route

export type AppType = typeof app;
export default app;
```

### URL Yapisi

Route tanimindaki path, `.route()` parametresi ile birlesir:

| `.route()` | Route icindeki path | Sonuc URL |
|------------|---------------------|-----------|
| `/api/orders` | `/` | `GET /api/orders` |
| `/api/orders` | `/:id` | `GET /api/orders/123` |
| `/api/orders` | `/stats` | `GET /api/orders/stats` |

---

## Adim 4: Frontend'den Cagir

### useApiQuery Hook'u ile (GET)

```tsx
import { useApiQuery } from "@/hooks/use-api";

type OrdersResponse = {
  items: Order[];
  total: number;
  page: number;
  totalPages: number;
};

// Component icinde:
const { data, isLoading, error } = useApiQuery<OrdersResponse>(
  ["orders"],              // Cache anahtari
  "/orders?page=1&limit=10" // Endpoint
);
```

### useApiMutation Hook'u ile (POST/PUT/DELETE)

```tsx
import { useApiMutation } from "@/hooks/use-api";

// Yeni siparis olusturma
const createOrder = useApiMutation<{ item: Order }, OrderFormData>(
  "/orders",
  {
    method: "POST",
    invalidateKeys: [["orders"]], // Basarili olunca orders sorgusunu yenile
  }
);

// Kullanim:
createOrder.mutate({
  customerName: "Ahmet",
  product: "Urun A",
  quantity: 5,
});
```

### Dogrudan apiClient ile

```tsx
import { apiClient } from "@/lib/api-client";

// GET
const data = await apiClient<OrdersResponse>("/orders");

// POST
const newOrder = await apiClient<{ item: Order }>("/orders", {
  method: "POST",
  body: { customerName: "Ahmet", product: "Urun A", quantity: 5 },
});

// PUT
await apiClient("/orders/123", {
  method: "PUT",
  body: { status: "completed" },
});

// DELETE
await apiClient("/orders/123", { method: "DELETE" });
```

---

## Zod Validation Desenleri

### Temel Tipler

```typescript
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1, "Zorunlu alan"),
  email: z.string().email("Gecerli email girin"),
  age: z.number().min(0).max(150),
  phone: z.string().optional(),
  status: z.enum(["active", "inactive", "pending"]),
  tags: z.array(z.string()),
  isAdmin: z.boolean().default(false),
  createdAt: z.string().datetime(),
});
```

### Partial Validation (PUT icin)

```typescript
// Tum alanlar opsiyonel olur
app.put("/:id", zValidator("json", schema.partial()), (c) => {
  const data = c.req.valid("json");
  // Sadece gonderilen alanlar guncellenir
});
```

### Query Parametreleri Validation

```typescript
const querySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  search: z.string().optional(),
});

app.get("/", zValidator("query", querySchema), (c) => {
  const { page, limit, search } = c.req.valid("query");
});
```

---

## Hata Yonetimi

```typescript
app.get("/:id", (c) => {
  try {
    const item = findById(c.req.param("id"));

    if (!item) {
      return c.json({ error: "Kayit bulunamadi" }, 404);
    }

    return c.json({ item });
  } catch (error) {
    return c.json({ error: "Sunucu hatasi" }, 500);
  }
});
```

---

## Claude Code ile API Ekleme

### Basit Liste Endpoint'i

```
> "Musteriler icin bir API olustur. GET /api/customers endpoint'i musteri listesini donsun.
   Her musteride id, name, email ve phone alanlari olsun."
```

### CRUD Endpoint'leri

```
> "Urunler icin tam CRUD API olustur. GET (listeleme + pagination), GET/:id (tek urun),
   POST (yeni urun), PUT/:id (guncelleme), DELETE/:id (silme) endpoint'leri olsun.
   Urun alanlari: name, price, stock, category. Zod validation kullan."
```

### Filtreleme ve Arama

```
> "Siparisler API'sine arama ve filtreleme ekle. Query parametreleri olarak
   search (metin arama), status (durum filtresi) ve dateRange (tarih araligi) desteklesin."
```

### Frontend Entegrasyonu

```
> "Olusturdugumuz /api/orders endpoint'ini kullanan bir siparisler sayfasi olustur.
   Tablo, arama kutusu ve pagination olsun. Yeni siparis ekleme formu da olsun."
```

---

## Ipuclari

1. **Referans dosya** - `src/worker/routes/examples.ts` dosyasini ornek olarak kullan
2. **Her zaman 3 dosyayi guncelle** - Route dosyasi + routes/index.ts + worker/index.ts
3. **Validation kullan** - POST ve PUT endpoint'lerinde mutlaka Zod validation kullan
4. **Hata kodlari** - 404 (bulunamadi), 400 (gecersiz veri), 201 (olusturuldu), 500 (sunucu hatasi)
5. **Pagination** - Liste endpoint'lerinde mutlaka pagination destegi ekle
6. **Tutarli yapilandir** - Response formati: `{ items: [...], total, page, totalPages }` veya `{ item: {...} }`
