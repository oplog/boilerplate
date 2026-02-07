# Sorun Giderme Rehberi

Bu rehber, gelistirme sirasinda karsilasabilecginiz yaygin hatalari ve cozumlerini icerir.

---

## 1. Module Not Found (Modul Bulunamadi)

### Hata Mesaji

```
Error: Cannot find module '@/components/ui/button'
```

veya

```
Module not found: Error: Can't resolve '@/lib/utils'
```

### Cozum

1. **Bagimliliklari tekrar yukleyin:**
   ```bash
   rm -rf node_modules
   npm install
   ```

2. **Dosyanin var oldugundan emin olun:**
   - `@/` alias'i `src/client/` dizinine isaret eder
   - `@/components/ui/button` = `src/client/components/ui/button.tsx`

3. **shadcn/ui bileseni eksikse:**
   ```bash
   npx shadcn@latest add button
   ```

4. **Import yolunu kontrol edin:**
   ```tsx
   // Dogru
   import { Button } from "@/components/ui/button";

   // Yanlis
   import { Button } from "src/client/components/ui/button";
   import { Button } from "./components/ui/button";
   ```

---

## 2. Build Failed (Build Hatasi)

### Hata Mesaji

```
error TS2307: Cannot find module '...'
```

veya

```
Build failed with X errors
```

### Cozum

1. **TypeScript hatalarini kontrol edin:**
   ```bash
   npx tsc --noEmit
   ```

2. **Yaygin TypeScript hatalari:**

   **Eksik tip tanimi:**
   ```tsx
   // Hata: Parameter 'data' implicitly has an 'any' type
   // Cozum: Tip belirtin
   function handleData(data: MyType) { ... }
   ```

   **Eksik prop:**
   ```tsx
   // Hata: Property 'title' is missing
   // Cozum: Zorunlu prop'u ekleyin
   <PageHeader title="Baslik" />
   ```

   **Null kontrolu:**
   ```tsx
   // Hata: Object is possibly 'undefined'
   // Cozum: Optional chaining kullanin
   const name = data?.user?.name;
   ```

3. **Cache temizleyin:**
   ```bash
   rm -rf node_modules/.vite
   npm run dev
   ```

---

## 3. Port Already in Use (Port Zaten Kullaniliyor)

### Hata Mesaji

```
Error: Port 5173 is already in use
```

### Cozum

1. **Mevcut sureci sonlandirin:**

   **macOS/Linux:**
   ```bash
   # 5173 portunu kullanan sureci bul
   lsof -i :5173

   # Sureci sonlandir
   kill -9 <PID>
   ```

   **Windows:**
   ```bash
   # 5173 portunu kullanan sureci bul
   netstat -ano | findstr :5173

   # Sureci sonlandir
   taskkill /PID <PID> /F
   ```

2. **Farkli port kullanin:**
   ```bash
   npm run dev -- --port 3000
   ```

---

## 4. shadcn/ui Bilesen Bulunamadi

### Hata Mesaji

```
npx shadcn@latest add dialog
Error: Something went wrong...
```

### Cozum

1. **components.json dosyasini kontrol edin:**
   - Dosyanin proje kokunde oldugundan emin olun
   - Iceriginin dogru oldugundan emin olun

2. **Manuel olarak ekleyin:**
   - [https://ui.shadcn.com/docs/components/dialog](https://ui.shadcn.com/docs/components/dialog) sayfasindan kodu kopyalayin
   - `src/client/components/ui/dialog.tsx` dosyasi olusturup yapisitirin

3. **Eksik bagimliliklari yukleyin:**
   ```bash
   npm install radix-ui
   ```

4. **Belirli bir surumle deneyin:**
   ```bash
   npx shadcn@0.9.4 add dialog
   ```

---

## 5. Deploy Hatasi

### Hata: "Authentication Error"

```bash
# Tekrar giris yapin
npx wrangler login

# Giris durumunu kontrol edin
npx wrangler whoami
```

### Hata: "Script too large"

```
Error: Your Worker exceeded the size limit
```

**Cozum:**
- Kullanilmayan paketleri `package.json`'dan kaldirin
- `npm prune` calistirin
- Build ciktisini kontrol edin: `ls -la dist/`

### Hata: "Binding not found"

```
Error: D1_ERROR: no such binding 'DB'
```

**Cozum:**
1. `wrangler.jsonc` dosyasindaki binding yapilandirmasini kontrol edin
2. Veritabaninin/KV namespace'in olusturulmus oldugundan emin olun:
   ```bash
   npx wrangler d1 list
   npx wrangler kv namespace list
   ```

### Hata: "Compatibility date"

```
Error: Your Worker requires compatibility_date ...
```

**Cozum:** `wrangler.jsonc` dosyasindaki `compatibility_date` degerini guncelleyin.

---

## 6. TypeScript Hatalari

### "Type 'X' is not assignable to type 'Y'"

```tsx
// Hata
const status: "active" | "inactive" = someVariable; // string -> union type

// Cozum
const status = someVariable as "active" | "inactive";
// veya
if (someVariable === "active" || someVariable === "inactive") {
  const status: "active" | "inactive" = someVariable;
}
```

### "Property does not exist on type"

```tsx
// Hata
const data = await response.json();
console.log(data.name); // Property 'name' does not exist on type '{}'

// Cozum: Tip belirtin
type User = { name: string; email: string };
const data = await response.json() as User;
console.log(data.name);
```

### "Cannot find name 'React'"

```tsx
// Cozum: React'i import edin (genellikle gerek yok ama bazen lazim)
import React from "react";
```

---

## 7. Cloudflare Workers Ozel Sorunlar

### "No matching routes"

API endpoint'ine yapilan istek 404 donuyorsa:

1. Route'un `src/worker/index.ts` dosyasinda tanimlandigini kontrol edin
2. URL path'inin dogru oldugunu kontrol edin (buyuk/kucuk harf duyarli)
3. HTTP metodunun dogru oldugunu kontrol edin (GET vs POST)

```typescript
// Kontrol edin:
// 1. Import edilmis mi?
import orders from "./routes/orders";

// 2. Route baglanmis mi?
.route("/api/orders", orders)

// 3. Endpoint dogru tanamlanmis mi?
const app = new Hono()
  .get("/", (c) => { ... })  // GET /api/orders
  .post("/", (c) => { ... }) // POST /api/orders
```

### "CORS Error" (Tarayicida)

```
Access to fetch at 'http://localhost:5173/api/...' has been blocked by CORS policy
```

Bu hata normalde olmamali cunku CORS middleware'i zaten aktif. Eger oluyorsa:

1. `src/worker/index.ts` dosyasinda CORS middleware'inin dogru tanimlandigini kontrol edin:
   ```typescript
   .use("/api/*", cors())
   ```

2. API URL'sinin `/api/` ile basladigini kontrol edin

### "Worker threw an exception"

Worker icinde yakalanmamis bir hata oldugunda bu mesaj gorulur.

1. `npm run dev` ile gelistirme sunucusunu calistirin
2. Terminal'deki hata mesajini okuyun
3. `try/catch` bloklari ekleyin:

```typescript
app.get("/", async (c) => {
  try {
    // ... islemler
    return c.json({ data });
  } catch (error) {
    console.error("Hata:", error);
    return c.json({ error: "Sunucu hatasi" }, 500);
  }
});
```

### D1 SQL Hatalari

```
D1_ERROR: SQLITE_ERROR: no such table: users
```

**Cozum:** Migration'i calistirin:
```bash
npx wrangler d1 execute oplog-app-db --local --file=./migrations/0001_create_tables.sql
```

---

## 8. Gelistirme Sunucusu Sorunlari

### Hot Module Replacement (HMR) Calismiyor

Dosyayi kaydediyorsunuz ama tarayici guncellenmiyor:

1. Tarayici developer tools'da Console sekmesini kontrol edin
2. Vite cache'ini temizleyin:
   ```bash
   rm -rf node_modules/.vite
   npm run dev
   ```
3. Tarayicida hard refresh yapin: `Ctrl+Shift+R` (Windows) veya `Cmd+Shift+R` (macOS)

### "Failed to resolve import"

```
[vite] Internal server error: Failed to resolve import "@/components/ui/xyz"
```

**Cozum:**
1. Dosyanin var oldugundan emin olun
2. Dosya adinin dogru oldugundan emin olun (buyuk/kucuk harf duyarli)
3. Export'un dogru yapildigini kontrol edin

### Yavas Gelistirme Sunucusu

1. `node_modules/` dizinini tekrar olusturun:
   ```bash
   rm -rf node_modules
   npm install
   ```
2. Tarayicida gereksiz extension'lari devre disi birakin
3. Buyuk dosyalarin import grafiklerini kontrol edin

---

## 9. Genel Ipuclari

1. **Her zaman terminal ciktisini okuyun** - Hata mesajlari genellikle cozumu isaret eder
2. **"Nuclear option"** - Her sey bozulduysa:
   ```bash
   rm -rf node_modules .wrangler dist
   npm install
   npm run dev
   ```
3. **Claude Code'a sorun** - Hata mesajini Claude Code'a yapisitirin:
   ```
   > "Su hatayi aliyorum: [hata mesaji]. Nasil duzeltirim?"
   ```
4. **Git ile geri dondun** - Bir sey bozulduysa son calisan duruma donun:
   ```bash
   git stash        # Degisiklikleri kaydet
   git checkout .    # Son commit'e don
   npm run dev       # Test et
   git stash pop     # Degisiklikleri geri getir (isterseniz)
   ```
