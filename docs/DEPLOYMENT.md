# Deploy Rehberi

Bu rehber, uygulamayi Cloudflare Workers'a deploy etmenin adimlarini anlatir.

---

## On Kosullar

- Node.js v20+ yuklu olmali
- `bun install` calistirilmis olmali
- Cloudflare hesabi (ucretsiz plan yeterli)

---

## 1. Cloudflare Hesabi Olusturma

1. [https://dash.cloudflare.com/sign-up](https://dash.cloudflare.com/sign-up) adresine gidin
2. Email ve sifre ile kayit olun
3. Email adresinizi dogrulayin

Cloudflare Workers ucretsiz plan ile gunluk 100.000 istek yapilabilir. Cogu dahili uygulama icin yeterlidir.

---

## 2. Wrangler ile Giris Yapma

Wrangler, Cloudflare'in CLI aracidir. Zaten projede yukludur.

```bash
bunx wrangler login
```

Bu komut tarayicinizda Cloudflare giris sayfasini acar. Giris yapip "Allow" butonuna tiklayarak Wrangler'a yetki verin.

### Giris Dogrulama

```bash
bunx wrangler whoami
```

Hesap bilgilerinizi gormelisiniz.

---

## 3. Deploy Etme

### Ilk Deploy

```bash
# Build ve deploy
bun run deploy
```

Bu komut asagidaki adimlari otomatik yapar:
1. Projeyi build eder (`vite build`)
2. Build ciktisini Cloudflare Workers'a yukler
3. Worker'i aktif eder

Deploy tamamlandiktan sonra terminalde uygulamanizin URL'sini goreceksiniz:

```
Published oplog-app (X.XXs)
  https://oplog-app.<hesap-adi>.workers.dev
```

### Sonraki Deploy'lar

Her degisiklikten sonra ayni komutu calistirin:

```bash
bun run deploy
```

---

## 4. GitHub Actions ile Otomatik CI/CD

Bu template, GitHub Actions ile otomatik CI/CD icin hazir yapilandirilmistir.
`main` branch'e her push yapildiginda uygulama otomatik olarak deploy edilir.

### Nasil Calisir?

```
Kod degisikligi → git push → GitHub Actions → Build → Cloudflare Workers'a Deploy
```

Projede 2 workflow dosyasi vardir:
- `.github/workflows/deploy.yml` - main'e push yapildiginda otomatik deploy
- `.github/workflows/preview.yml` - PR acildiginda preview ortami olusturur

### Kurulum Adimlari (Ilk seferlik)

#### Adim 1: Cloudflare API Token Olusturma
1. [Cloudflare Dashboard](https://dash.cloudflare.com/profile/api-tokens) > "My Profile" > "API Tokens"
2. "Create Token" butonuna tiklayin
3. "Edit Cloudflare Workers" template'ini secin
4. "Continue to summary" > "Create Token"
5. **Olusturulan token'i kopyalayin** (bir daha goremezsiniz!)

#### Adim 2: GitHub'a Token Ekleme
1. GitHub'da repo sayfaniza gidin
2. Settings > Secrets and variables > Actions
3. "New repository secret" butonuna tiklayin
4. **Name:** `CLOUDFLARE_API_TOKEN`
5. **Secret:** Cloudflare'den kopyaladiginiz token
6. "Add secret" tiklayin

#### Adim 3: Ilk Push
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

Artik her push'da otomatik deploy olacak!

### Claude Code ile CI/CD Kurulumu

Claude Code'a soyle de:
```
> "GitHub repo olustur, Cloudflare API token'imi ekle ve CI/CD'yi calistir"
```

### Alternatif: Workers Builds (Dashboard Uzerinden)

GitHub Actions yerine Cloudflare'in kendi CI/CD'sini de kullanabilirsiniz:
1. [Cloudflare Dashboard](https://dash.cloudflare.com/) > Workers & Pages > Create
2. "Connect to Git" secin
3. GitHub hesabinizi baglayip repoyu secin
4. Build ayarlari otomatik algilanir

---

## 5. Custom Domain (Ozel Alan Adi)

Uygulamanizi kendi alan adinizla kullanabilirsiniz.

### Adimlar

1. Cloudflare Dashboard'da alan adinizi ekleyin (henuz eklemediyseniz):
   - Dashboard > Websites > Add a site

2. Worker'inize custom domain ekleyin:
   - Dashboard > Workers > oplog-app > Settings > Domains & Routes
   - "Add Custom Domain" butonuna tiklayin
   - Alan adinizi girin (ornek: `app.oplog.com`)

### wrangler.jsonc ile

```jsonc
{
  "routes": [
    {
      "pattern": "app.oplog.com",
      "custom_domain": true
    }
  ]
}
```

---

## 6. Ortam Degiskenleri (Environment Variables)

Gizli bilgileri (API anahtarlari, sifreleri) ortam degiskeni olarak saklayin.

### Gelistirme Ortami

`.dev.vars.example` dosyasini `.dev.vars` olarak kopyalayin:

```bash
cp .dev.vars.example .dev.vars
```

`.dev.vars` dosyasina gizli degerleri yazin:

```
API_KEY=your-api-key-here
AUTH_SECRET=your-secret-here
DATABASE_URL=your-db-url
```

> **UYARI:** `.dev.vars` dosyasini ASLA git'e commit etmeyin! `.gitignore` dosyasinda zaten tanimli ama dikkatli olun.

### Production Ortami

Wrangler CLI ile secret ekleyin:

```bash
# Secret ekle
bunx wrangler secret put API_KEY
# Terminalde deger girmenizi isteyecek

bunx wrangler secret put AUTH_SECRET
```

Cloudflare Dashboard uzerinden de ekleyebilirsiniz:
- Dashboard > Workers > oplog-app > Settings > Variables and Secrets

### Kod Icinde Kullanim

```typescript
// src/worker/index.ts
export type Env = {
  ASSETS: Fetcher;
  API_KEY: string;
  AUTH_SECRET: string;
};

// Route icinde
app.get("/secure", (c) => {
  const apiKey = c.env.API_KEY;
  // ...
});
```

---

## 7. Staging ve Production Ortamlari

Farkli ortamlar icin ayri Worker'lar olusturabilirsiniz.

### wrangler.jsonc ile

```jsonc
{
  "name": "oplog-app",
  "env": {
    "staging": {
      "name": "oplog-app-staging",
      "vars": {
        "ENVIRONMENT": "staging"
      }
    },
    "production": {
      "name": "oplog-app",
      "vars": {
        "ENVIRONMENT": "production"
      }
    }
  }
}
```

### Deploy Komutlari

```bash
# Staging'e deploy
bunx wrangler deploy --env staging

# Production'a deploy
bunx wrangler deploy --env production
```

---

## 8. Deploy Oncesi Kontrol Listesi

Deploy etmeden once su kontrolleri yapin:

- [ ] `bun run build` hatasiz tamamlaniyor mu?
- [ ] Gelistirme sunucusunda (`bun run dev`) her sey dogru calisiyor mu?
- [ ] `.dev.vars` dosyasi commit edilmemis mi?
- [ ] `node_modules/` commit edilmemis mi?
- [ ] Tum sayfalar mobilde dogru gorunuyor mu?
- [ ] API endpoint'leri dogru calisiyor mu?
- [ ] `console.log` kalintilari temizlendi mi?
- [ ] TypeScript hatalari yok mu?

---

## Sikca Karsilasilan Deploy Hatalari

### "Build failed"

```bash
# Once build'i test edin
bun run build
```

Build hatasini duzeltin ve tekrar deploy edin.

### "Authentication error"

```bash
# Tekrar giris yapin
bunx wrangler login
```

### "Script too large"

Cloudflare Workers'in boyut limiti vardir (ucretsiz plan: 1MB, ucretli plan: 10MB). `node_modules/` icerisinden gereksiz paketleri kaldirin.

### "D1/KV binding not found"

`wrangler.jsonc` dosyasindaki binding yapilandirmasini kontrol edin. Veritabani/KV namespace'in gercekten olusturulmus oldugundan emin olun.

---

## Claude Code ile Deploy

```
> "Uygulamayi deploy et"
```

```
> "Staging ortamina deploy et"
```

```
> "API_KEY icin bir secret ekle"
```

```
> "Build hatalarini duzelt ve deploy et"
```
