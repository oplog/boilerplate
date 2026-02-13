# Veritabani ve Depolama Rehberi

Bu rehber, Cloudflare'in sundugun veritabani ve depolama hizmetlerinin nasil kullanilacagini anlatir. Uc ana hizmet vardir:

| Hizmet | Tur | Kullanim Alani |
|--------|-----|----------------|
| **D1** | SQL veritabani | Yapisal veri (kullanicilar, siparisler, urunler) |
| **KV** | Key-Value store | Basit anahtar-deger verileri (ayarlar, cache, oturum) |
| **R2** | Nesne depolama | Dosyalar (resimler, PDF'ler, yedekler) |

---

## D1 - SQL Veritabani

D1, Cloudflare'in SQLite tabanli serverless SQL veritabanidir. Yapisal verileri saklamak icin kullanilir.

### 1. Veritabani Olusturma

```bash
# Yeni veritabani olustur
bunx wrangler d1 create oplog-app-db
```

Bu komut bir veritabani ID'si olusturur. Bu ID'yi kopyalayin.

### 2. wrangler.jsonc Yapilandirmasi

`wrangler.jsonc` dosyasindaki yorumlu kismi aktif edin:

```jsonc
{
  "name": "oplog-app",
  "main": "./src/worker/index.ts",
  "compatibility_date": "2025-04-01",
  "compatibility_flags": ["nodejs_compat"],
  "assets": {
    "binding": "ASSETS",
    "not_found_handling": "single-page-application"
  },
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "oplog-app-db",
      "database_id": "BURAYA-VERITABANI-ID-YAPISTIR"
    }
  ]
}
```

### 3. Env Type Guncelleme

`src/worker/index.ts` dosyasindaki `Env` type'ina `DB` ekleyin:

```typescript
export type Env = {
  ASSETS: Fetcher;
  DB: D1Database;
};
```

### 4. Tablo Olusturma

SQL migration dosyasi olusturun:

```sql
-- migrations/0001_create_tables.sql

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  department TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  customer_name TEXT NOT NULL,
  product TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TEXT DEFAULT (datetime('now'))
);
```

Migration'i calistirin:

```bash
# Yerel veritabaninda calistir (gelistirme)
bunx wrangler d1 execute oplog-app-db --local --file=./migrations/0001_create_tables.sql

# Uzak veritabaninda calistir (production)
bunx wrangler d1 execute oplog-app-db --remote --file=./migrations/0001_create_tables.sql
```

### 5. D1 Kullanim Ornekleri

```typescript
// src/worker/routes/users.ts

import { Hono } from "hono";
import type { Env } from "../index";

const app = new Hono<{ Bindings: Env }>()
  // Tum kullanicilari listele
  .get("/", async (c) => {
    const { results } = await c.env.DB
      .prepare("SELECT * FROM users ORDER BY created_at DESC")
      .all();
    return c.json({ items: results });
  })

  // Tek kullanici getir
  .get("/:id", async (c) => {
    const user = await c.env.DB
      .prepare("SELECT * FROM users WHERE id = ?")
      .bind(c.req.param("id"))
      .first();

    if (!user) {
      return c.json({ error: "Kullanici bulunamadi" }, 404);
    }
    return c.json({ item: user });
  })

  // Yeni kullanici olustur
  .post("/", async (c) => {
    const { name, email, department } = await c.req.json();

    const result = await c.env.DB
      .prepare("INSERT INTO users (name, email, department) VALUES (?, ?, ?) RETURNING *")
      .bind(name, email, department)
      .first();

    return c.json({ item: result }, 201);
  })

  // Kullanici guncelle
  .put("/:id", async (c) => {
    const { name, email, department } = await c.req.json();
    const id = c.req.param("id");

    const result = await c.env.DB
      .prepare("UPDATE users SET name = ?, email = ?, department = ? WHERE id = ? RETURNING *")
      .bind(name, email, department, id)
      .first();

    if (!result) {
      return c.json({ error: "Kullanici bulunamadi" }, 404);
    }
    return c.json({ item: result });
  })

  // Kullanici sil
  .delete("/:id", async (c) => {
    await c.env.DB
      .prepare("DELETE FROM users WHERE id = ?")
      .bind(c.req.param("id"))
      .run();

    return c.json({ success: true });
  })

  // Arama
  .get("/search/:query", async (c) => {
    const query = `%${c.req.param("query")}%`;
    const { results } = await c.env.DB
      .prepare("SELECT * FROM users WHERE name LIKE ? OR email LIKE ?")
      .bind(query, query)
      .all();

    return c.json({ items: results });
  });

export default app;
```

---

## KV - Key-Value Store

KV, basit anahtar-deger verileri icin kullanilir. Cok hizli okuma, biraz gecikemeli yazma sunar. Ayarlar, cache ve oturum verileri icin idealdir.

### 1. KV Namespace Olusturma

```bash
bunx wrangler kv namespace create KV
```

Cikti olarak namespace ID'si verilir.

### 2. wrangler.jsonc Yapilandirmasi

```jsonc
{
  "kv_namespaces": [
    {
      "binding": "KV",
      "id": "BURAYA-KV-NAMESPACE-ID-YAPISTIR"
    }
  ]
}
```

### 3. Env Type Guncelleme

```typescript
export type Env = {
  ASSETS: Fetcher;
  KV: KVNamespace;
};
```

### 4. KV Kullanim Ornekleri

```typescript
// src/worker/routes/settings.ts

import { Hono } from "hono";
import type { Env } from "../index";

const app = new Hono<{ Bindings: Env }>()
  // Ayar oku
  .get("/:key", async (c) => {
    const value = await c.env.KV.get(c.req.param("key"));

    if (value === null) {
      return c.json({ error: "Ayar bulunamadi" }, 404);
    }

    // JSON olarak parse etmeyi dene
    try {
      return c.json({ value: JSON.parse(value) });
    } catch {
      return c.json({ value });
    }
  })

  // Ayar yaz
  .put("/:key", async (c) => {
    const { value } = await c.req.json();
    const key = c.req.param("key");

    // String olarak sakla
    await c.env.KV.put(
      key,
      typeof value === "string" ? value : JSON.stringify(value)
    );

    return c.json({ success: true, key, value });
  })

  // Ayar sil
  .delete("/:key", async (c) => {
    await c.env.KV.delete(c.req.param("key"));
    return c.json({ success: true });
  })

  // Tum ayarlari listele (prefix ile)
  .get("/", async (c) => {
    const prefix = c.req.query("prefix") || "";
    const list = await c.env.KV.list({ prefix });

    return c.json({
      keys: list.keys.map((k) => k.name),
      complete: list.list_complete,
    });
  });

export default app;
```

### KV Ozel Ozellikleri

```typescript
// Sureli veri (TTL - Time To Live)
await c.env.KV.put("session:abc", "user123", {
  expirationTtl: 3600, // 1 saat sonra otomatik silinir
});

// Metadata ile birlikte
await c.env.KV.put("config:theme", "dark", {
  metadata: { updatedBy: "admin", updatedAt: new Date().toISOString() },
});

// Metadata okuma
const { value, metadata } = await c.env.KV.getWithMetadata("config:theme");
```

---

## R2 - Nesne Depolama (Object Storage)

R2, dosya depolamak icin kullanilir. Resimler, PDF'ler, CSV dosyalari ve diger dosyalar icin idealdir.

### 1. R2 Bucket Olusturma

```bash
bunx wrangler r2 bucket create oplog-app-files
```

### 2. wrangler.jsonc Yapilandirmasi

```jsonc
{
  "r2_buckets": [
    {
      "binding": "BUCKET",
      "bucket_name": "oplog-app-files"
    }
  ]
}
```

### 3. Env Type Guncelleme

```typescript
export type Env = {
  ASSETS: Fetcher;
  BUCKET: R2Bucket;
};
```

### 4. R2 Kullanim Ornekleri

```typescript
// src/worker/routes/files.ts

import { Hono } from "hono";
import type { Env } from "../index";

const app = new Hono<{ Bindings: Env }>()
  // Dosya yukle
  .post("/upload", async (c) => {
    const formData = await c.req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return c.json({ error: "Dosya bulunamadi" }, 400);
    }

    const key = `uploads/${Date.now()}-${file.name}`;
    await c.env.BUCKET.put(key, file.stream(), {
      httpMetadata: {
        contentType: file.type,
      },
    });

    return c.json({
      success: true,
      key,
      name: file.name,
      size: file.size,
    }, 201);
  })

  // Dosya indir
  .get("/:key{.+}", async (c) => {
    const key = c.req.param("key");
    const object = await c.env.BUCKET.get(key);

    if (!object) {
      return c.json({ error: "Dosya bulunamadi" }, 404);
    }

    const headers = new Headers();
    headers.set("Content-Type", object.httpMetadata?.contentType || "application/octet-stream");
    headers.set("Content-Length", String(object.size));

    return new Response(object.body, { headers });
  })

  // Dosya sil
  .delete("/:key{.+}", async (c) => {
    await c.env.BUCKET.delete(c.req.param("key"));
    return c.json({ success: true });
  })

  // Dosyalari listele
  .get("/", async (c) => {
    const prefix = c.req.query("prefix") || "";
    const list = await c.env.BUCKET.list({ prefix });

    return c.json({
      files: list.objects.map((obj) => ({
        key: obj.key,
        size: obj.size,
        uploaded: obj.uploaded,
      })),
    });
  });

export default app;
```

---

## Tum Binding'leri Birlikte Kullanma

```typescript
// src/worker/index.ts

export type Env = {
  ASSETS: Fetcher;
  DB: D1Database;
  KV: KVNamespace;
  BUCKET: R2Bucket;
};
```

```jsonc
// wrangler.jsonc
{
  "name": "oplog-app",
  "main": "./src/worker/index.ts",
  "compatibility_date": "2025-04-01",
  "compatibility_flags": ["nodejs_compat"],
  "assets": {
    "binding": "ASSETS",
    "not_found_handling": "single-page-application"
  },
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "oplog-app-db",
      "database_id": "VERITABANI-ID"
    }
  ],
  "kv_namespaces": [
    {
      "binding": "KV",
      "id": "KV-NAMESPACE-ID"
    }
  ],
  "r2_buckets": [
    {
      "binding": "BUCKET",
      "bucket_name": "oplog-app-files"
    }
  ]
}
```

---

## Claude Code ile Veritabani Islemleri

### D1 Tablo Olusturma

```
> "D1 veritabaninda bir 'products' tablosu olustur. Alanlar: id, name, price, stock,
   category, created_at. Migration dosyasini da olustur."
```

### CRUD API + D1

```
> "Urunler icin D1 veritabanini kullanan CRUD API olustur. Listeleme, ekleme,
   guncelleme ve silme endpoint'leri olsun. Pagination ve arama desteklesin."
```

### KV Ayarlar

```
> "Uygulama ayarlari icin KV kullanan bir settings API olustur. Tema rengi, dil,
   bildirim tercihleri gibi ayarlar kaydedilip okunabilsin."
```

### R2 Dosya Yukleme

```
> "Dosya yukleme endpoint'i olustur. Frontend'de dosya secme butonu olsun.
   R2'ye yuklenen dosyanin URL'sini dondurusun. Dosya listesi de gosterilsin."
```

---

## Ipuclari

1. **Gelistirme ortaminda** D1 ve KV otomatik olarak yerel calisir (`--local` flag'i gerek yok)
2. **SQL injection'a dikkat** - Her zaman parametreli sorgular kullan (`?` placeholder ile `.bind()`)
3. **KV icin TTL kullan** - Gecici verilerde `expirationTtl` ayarla
4. **R2 dosya boyutu** - Tek seferde max 5GB dosya yuklenebilir
5. **Type generation** - `bun run cf-typegen` komutu Cloudflare binding type'larini otomatik olusturur
