<!-- OPLOG Logo -->
<p align="center">
  <img src="public/favicon.svg" alt="OPLOG Logo" width="80" height="80" />
</p>

<h1 align="center">OPLOG App Builder Template</h1>

<p align="center">
  <strong>Kod yazmadan uygulama gelistirmek icin hazirlanmis modern fullstack sablon.</strong>
  <br />
  Claude Code ile birlikte kullanilarak, teknik bilgiye ihtiyac duymadan production-ready uygulamalar olusturulabilir.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=white" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-6-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite 6" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind CSS 4" />
  <img src="https://img.shields.io/badge/Hono-4-E36002?style=flat-square&logo=hono&logoColor=white" alt="Hono" />
  <img src="https://img.shields.io/badge/Cloudflare_Workers-F38020?style=flat-square&logo=cloudflare&logoColor=white" alt="Cloudflare Workers" />
</p>

---

## Hakkinda

OPLOG App Builder Template, OPLOG ekibinin hizli bir sekilde dahili uygulamalar gelistirmesi icin olusturulmus bir sablondur. Modern web teknolojilerini kullanir ve Cloudflare Workers uzerinde calisir. Frontend ve backend tek bir projede birlestirilmistir.

**Claude Code** ile birlikte kullanildiginda, yazilim gelistirme deneyimi olmayan kisiler bile profesyonel web uygulamalari olusturabilir.

## Teknoloji Stack

| Katman | Teknoloji | Aciklama |
|--------|-----------|----------|
| **Frontend** | React 19, TypeScript | Modern UI gelistirme |
| **Stil** | Tailwind CSS 4, shadcn/ui | Hizli ve tutarli tasarim |
| **Backend** | Hono.js | Hafif ve hizli API framework |
| **Altyapi** | Cloudflare Workers | Global edge computing |
| **Veri Yonetimi** | TanStack Query | Otomatik cache ve senkronizasyon |
| **Form** | React Hook Form, Zod | Tip-guvenli form yonetimi |
| **Grafikler** | Recharts | Dashboard grafikleri |
| **Bildirimler** | Sonner | Toast bildirimleri |
| **Ikonlar** | Lucide React | 1000+ modern ikon |

## Hizli Baslangic

### On Kosullar

- [Node.js](https://nodejs.org/) v20 veya uzeri
- [Git](https://git-scm.com/)
- [Claude Code](https://claude.ai/code) (opsiyonel ama onerilen)

### Kurulum

```bash
# 1. Repoyu klonla
git clone <repo-url>
cd oplog-boilerplate

# 2. Bagimliliklari yukle
npm install

# 3. Gelistirme sunucusunu baslat
npm run dev
```

Tarayicida [http://localhost:5173](http://localhost:5173) adresini ac.

### Mevcut Komutlar

| Komut | Aciklama |
|-------|----------|
| `npm run dev` | Gelistirme sunucusunu baslatir |
| `npm run build` | Production build olusturur |
| `npm run preview` | Build edilmis uygulamayi on izler |
| `npm run deploy` | Cloudflare Workers'a deploy eder |
| `npm run cf-typegen` | Cloudflare binding type'larini olusturur |

## Proje Yapisi

```
oplog-boilerplate/
├── src/
│   ├── client/                  # Frontend (React)
│   │   ├── components/
│   │   │   ├── layout/          # Layout bilesenleri (header, sidebar)
│   │   │   ├── shared/          # Paylasilan bilesenler (page-header, loading)
│   │   │   └── ui/              # shadcn/ui bilesenleri
│   │   ├── hooks/               # Custom React hook'lari
│   │   ├── lib/                 # Yardimci fonksiyonlar
│   │   ├── pages/               # Sayfa bilesenleri
│   │   ├── router.tsx           # Sayfa routing yapilandirmasi
│   │   └── index.css            # Global stiller ve tema
│   └── worker/                  # Backend (Hono.js)
│       ├── routes/              # API endpoint'leri
│       ├── lib/                 # Paylasilan tipler
│       └── index.ts             # API ana giris noktasi
├── wrangler.jsonc               # Cloudflare yapilandirmasi
├── vite.config.ts               # Vite yapilandirmasi
├── components.json              # shadcn/ui yapilandirmasi
└── package.json                 # Bagimliliklar
```

### Onemli Dizinler

- **`src/client/pages/`** - Yeni sayfa eklemek icin bu dizini kullan
- **`src/client/components/ui/`** - shadcn/ui bilesenleri burada
- **`src/worker/routes/`** - Yeni API endpoint'i eklemek icin bu dizini kullan
- **`src/client/router.tsx`** - Sayfa route tanimlarini burada yap
- **`src/client/components/layout/sidebar.tsx`** - Sidebar menu ogelerini burada tanimla

## Deploy

### Cloudflare Workers'a Deploy

```bash
# 1. Cloudflare hesabina giris yap
npx wrangler login

# 2. Deploy et
npm run deploy
```

Detayli deploy talimatlari icin [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) dosyasina bak.

## Claude Code ile Kullanim

Bu sablon, Claude Code ile birlikte kullanilmak uzere optimize edilmistir. Claude Code, `CLAUDE.md` dosyasini okuyarak projenin yapisini anlar ve dogru sekilde kod yazar.

### Ornek Kullanim

```
# Claude Code'u baslat
claude

# Ornek komutlar:
> "Yeni bir urunler sayfasi olustur, tabloda urun adi, fiyati ve stok durumu gosterilsin"
> "Siparisler icin bir API endpoint'i olustur, GET ve POST desteklesin"
> "Dashboard'a bir cizgi grafik ekle, son 7 gunun siparis sayisini gostersin"
> "Formun rengini mavi yap ve bir tarih secici ekle"
```

Daha fazla ornek prompt icin [docs/EXAMPLE_PROMPTS.md](docs/EXAMPLE_PROMPTS.md) dosyasina bak.

## Dokumantasyon

| Dokuman | Aciklama |
|---------|----------|
| [Baslangic Rehberi](docs/GETTING_STARTED.md) | Ilk kurulum adimlari |
| [Sayfa Ekleme](docs/ADDING_PAGES.md) | Yeni sayfa nasil eklenir |
| [API Ekleme](docs/ADDING_API.md) | Yeni API endpoint nasil eklenir |
| [Bilesen Ekleme](docs/ADDING_COMPONENTS.md) | shadcn/ui bilesen ekleme |
| [Veritabani](docs/DATABASE.md) | D1, KV, R2 kullanimi |
| [Deploy](docs/DEPLOYMENT.md) | Cloudflare'e deploy etme |
| [Sorun Giderme](docs/TROUBLESHOOTING.md) | Sik karsilasilan hatalar |
| [Ornek Prompt'lar](docs/EXAMPLE_PROMPTS.md) | Claude Code icin ornek komutlar |

## Katki

1. Bu repoyu fork'la
2. Yeni bir branch olustur (`git checkout -b feature/yeni-ozellik`)
3. Degisikliklerini commit et (`git commit -m 'Yeni ozellik eklendi'`)
4. Branch'ini push et (`git push origin feature/yeni-ozellik`)
5. Pull Request olustur

Katki yaparken su kurallara uy:
- TypeScript strict mode'da hata vermemeli
- Tum sayfalar responsive olmali (mobil + desktop)
- shadcn/ui bilesen pattern'lerini takip et
- API endpoint'lerinde Zod validation kullan
- `console.log` kalintisi birakma

## Lisans

Bu proje OPLOG ic kullanim icin gelistirilmistir.
