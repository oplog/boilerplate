// Örnek CRUD API endpoint'leri
// Bu dosya yeni endpoint'ler oluşturmak için referans olarak kullanılabilir

import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

// Örnek veri şeması - Zod ile validation
const itemSchema = z.object({
  name: z.string().min(1, "İsim zorunludur"),
  description: z.string().optional(),
  status: z.enum(["active", "inactive"]).default("active"),
});

// Tip tanımı
type Item = {
  id: string;
  name: string;
  description?: string;
  status: string;
  createdAt: string;
};

// In-memory store (gerçek projede D1 veya KV kullan)
let items: Item[] = [
  {
    id: "1",
    name: "Depo Yönetimi Modülü",
    description: "Depo giriş-çıkış takibi",
    status: "active",
    createdAt: "2025-01-15T10:00:00Z",
  },
  {
    id: "2",
    name: "Sipariş Takip Sistemi",
    description: "Müşteri siparişlerinin anlık takibi",
    status: "active",
    createdAt: "2025-01-20T14:30:00Z",
  },
  {
    id: "3",
    name: "Envanter Sayım Aracı",
    description: "Periyodik envanter sayım yönetimi",
    status: "inactive",
    createdAt: "2025-02-01T09:15:00Z",
  },
  {
    id: "4",
    name: "Kargo Entegrasyonu",
    status: "active",
    createdAt: "2025-02-05T11:45:00Z",
  },
  {
    id: "5",
    name: "Raporlama Paneli",
    description: "Günlük ve aylık operasyon raporları",
    status: "active",
    createdAt: "2025-02-10T08:00:00Z",
  },
];

const app = new Hono()
  // Tüm item'ları listele (pagination destekli)
  .get("/", (c) => {
    const page = Number(c.req.query("page") || "1");
    const limit = Number(c.req.query("limit") || "10");
    const search = c.req.query("search") || "";

    let filtered = items;
    if (search) {
      filtered = items.filter(
        (i) =>
          i.name.toLowerCase().includes(search.toLowerCase()) ||
          i.description?.toLowerCase().includes(search.toLowerCase())
      );
    }

    const total = filtered.length;
    const start = (page - 1) * limit;
    const paginated = filtered.slice(start, start + limit);

    return c.json({
      items: paginated,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  })
  // Tek item getir
  .get("/:id", (c) => {
    const item = items.find((i) => i.id === c.req.param("id"));
    if (!item) {
      return c.json({ error: "Bulunamadı" }, 404);
    }
    return c.json({ item });
  })
  // Yeni item oluştur
  .post("/", zValidator("json", itemSchema), (c) => {
    const data = c.req.valid("json");
    const newItem: Item = {
      id: crypto.randomUUID(),
      ...data,
      createdAt: new Date().toISOString(),
    };
    items.push(newItem);
    return c.json({ item: newItem }, 201);
  })
  // Item güncelle
  .put("/:id", zValidator("json", itemSchema.partial()), (c) => {
    const idx = items.findIndex((i) => i.id === c.req.param("id"));
    if (idx === -1) {
      return c.json({ error: "Bulunamadı" }, 404);
    }
    items[idx] = { ...items[idx], ...c.req.valid("json") };
    return c.json({ item: items[idx] });
  })
  // Item sil
  .delete("/:id", (c) => {
    const idx = items.findIndex((i) => i.id === c.req.param("id"));
    if (idx === -1) {
      return c.json({ error: "Bulunamadı" }, 404);
    }
    items.splice(idx, 1);
    return c.json({ success: true });
  });

export default app;
