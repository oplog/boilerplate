<p align="center">
  <img src="public/OPLOG.png" alt="OPLOG" width="120" />
</p>

<h1 align="center">OPLOG App Builder</h1>

<p align="center">
  <strong>OPLOG ekibi icin fullstack uygulama gelistirme template'i.</strong>
  <br />
  React 19 + Hono.js + Cloudflare Workers. Tek komutla calistir, tek komutla deploy et.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=white" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-6-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite 6" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind CSS 4" />
  <img src="https://img.shields.io/badge/Hono-4-E36002?style=flat-square&logo=hono&logoColor=white" alt="Hono" />
  <img src="https://img.shields.io/badge/Cloudflare_Workers-F38020?style=flat-square&logo=cloudflare&logoColor=white" alt="Cloudflare Workers" />
  <img src="https://img.shields.io/badge/shadcn/ui-46_component-000000?style=flat-square&logo=shadcnui&logoColor=white" alt="shadcn/ui" />
</p>

---

## Ozellikler

- **Tek komut** - `npm run dev` ile frontend + backend ayni anda calisir
- **46 UI bileşen** - shadcn/ui tum bilesenleri onceden yuklu
- **DataGrid** - DiceUI ile Excel-benzeri duzenlenebilir tablolar
- **Grafikler** - Recharts 3 ile interaktif bar, area, pie, stacked chart
- **PWA** - Mobilde "Ana Ekrana Ekle" ile native uygulama deneyimi
- **Dark Mode** - Acik/koyu/sistem tema destegi
- **CI/CD** - GitHub Actions ile `git push` = otomatik deploy
- **Claude Code uyumlu** - `CLAUDE.md` ile AI destekli gelistirme

## Teknoloji Stack

| Katman | Teknoloji | Aciklama |
|--------|-----------|----------|
| **Frontend** | React 19, TypeScript | UI gelistirme |
| **Stil** | Tailwind CSS 4, shadcn/ui | 46 hazir bilesen, dark mode |
| **Backend** | Hono.js | Hafif API framework |
| **Altyapi** | Cloudflare Workers | Global edge deploy |
| **Veri** | TanStack Query | Cache ve senkronizasyon |
| **Form** | React Hook Form + Zod | Validasyonlu form yonetimi |
| **Tablo** | DiceUI DataGrid | Excel-benzeri duzenlenebilir grid |
| **Grafik** | Recharts 3 | Interaktif chart'lar |
| **Bildirim** | Sonner | Toast bildirimleri |
| **Ikon** | Lucide React | 1000+ ikon |

## Hizli Baslangic

```bash
# Klonla ve baslat
git clone git@github.com:oplog/oplog-boilerplate.git
cd oplog-boilerplate
npm install
npm run dev
```

Tarayicida [http://localhost:5173](http://localhost:5173) adresini ac.

## Komutlar

| Komut | Aciklama |
|-------|----------|
| `npm run dev` | Gelistirme sunucusunu baslatir |
| `npm run build` | Production build olusturur |
| `npm run deploy` | Cloudflare Workers'a deploy eder |
| `npm run cf-typegen` | Cloudflare binding type'larini olusturur |

## Proje Yapisi

```
src/
├── client/                     # Frontend (React)
│   ├── components/
│   │   ├── layout/             # Sidebar, Header (shadcn Sidebar pattern)
│   │   ├── shared/             # PageHeader, Loading, ErrorBoundary
│   │   ├── ui/                 # shadcn/ui bilesenleri (46 adet)
│   │   └── data-grid/          # DiceUI DataGrid bilesenleri
│   ├── hooks/                  # use-api, use-data-grid, use-mobile
│   ├── pages/                  # Sayfa bilesenleri
│   │   └── examples/           # Form, Tablo, Grafik, DataGrid ornekleri
│   ├── router.tsx              # Route tanimlari
│   └── index.css               # Tema ve global stiller
└── worker/                     # Backend (Hono.js)
    ├── routes/                 # API endpoint'leri
    └── index.ts                # Hono giris noktasi
```

## Deploy

```bash
# Ilk seferlik: Cloudflare hesabina giris
npx wrangler login

# Deploy et
npm run deploy
```

### CI/CD ile Otomatik Deploy

`main` branch'e push yapildiginda GitHub Actions otomatik deploy eder.

**Kurulum:** GitHub repo > Settings > Secrets > `CLOUDFLARE_API_TOKEN` ekle.

## Claude Code ile Kullanim

Proje `CLAUDE.md` dosyasi ile Claude Code'a optimize edilmistir. Terminal'de `claude` yazarak basla:

```
> "Musteri listesi sayfasi olustur, tablo ile goster"
> "Siparisler icin API endpoint'i yaz"
> "Dashboard'a son 30 gunun grafigini ekle"
> "Formu mavi renk yap ve tarih secici ekle"
```

## Dokumantasyon

| Dokuman | Aciklama |
|---------|----------|
| [CLAUDE.md](CLAUDE.md) | AI destekli gelistirme rehberi |
| [Baslangic](docs/GETTING_STARTED.md) | Ilk kurulum adimlari |
| [Sayfa Ekleme](docs/ADDING_PAGES.md) | Yeni sayfa ekleme |
| [API Ekleme](docs/ADDING_API.md) | Yeni API endpoint ekleme |
| [Deploy](docs/DEPLOYMENT.md) | Cloudflare deploy |
| [Ornek Prompt'lar](docs/EXAMPLE_PROMPTS.md) | Claude Code komut ornekleri |

## Lisans

OPLOG ic kullanim icin gelistirilmistir.
