# Baslangic Rehberi

Bu rehber, OPLOG App Builder Template'ini ilk kez kullanacak kisiler icin adim adim kurulum talimatlarini icerir. Teknik bilgiye ihtiyac yoktur -- talimatlari sirasi ile takip etmeniz yeterlidir.

---

## 1. Node.js Kurulumu (v20+)

Node.js, JavaScript kodunu bilgisayarinizda calistirmanizi saglayan bir yazilimdir. Bu proje icin **v20 veya uzeri** gereklidir.

### macOS

```bash
# Homebrew ile (onerilen)
brew install node

# veya Node.js web sitesinden indir:
# https://nodejs.org/
```

### Windows

1. [https://nodejs.org/](https://nodejs.org/) adresine git
2. **LTS** surumunu indir (yesil buton)
3. Indirilen dosyayi calistir ve tum varsayilan ayarlari kabul et
4. Kurulum tamamlandiktan sonra bilgisayari yeniden baslat

### Kurulumu Dogrula

Terminal (macOS) veya Command Prompt (Windows) ac ve su komutu calistir:

```bash
node --version
# v20.x.x veya uzeri cikmalir

npm --version
# 10.x.x veya uzeri cikmali
```

---

## 2. Git Kurulumu

Git, kodunuzun versiyon kontrolunu yapan bir yazilimdir.

### macOS

```bash
# Xcode Command Line Tools ile gelir
xcode-select --install

# veya Homebrew ile
brew install git
```

### Windows

1. [https://git-scm.com/](https://git-scm.com/) adresine git
2. "Download for Windows" butonuna tikla
3. Indirilen dosyayi calistir ve tum varsayilan ayarlari kabul et

### Kurulumu Dogrula

```bash
git --version
# git version 2.x.x cikmali
```

---

## 3. Claude Code Kurulumu

Claude Code, yapay zeka destekli bir kod yazma aracidir. Bu template ile birlikte kullanarak, dogal dilde komut vererek uygulama gelistirebilirsiniz.

### Kurulum

```bash
# Claude Code'u global olarak yukle
npm install -g @anthropic-ai/claude-code
```

### Dogrulama

```bash
claude --version
```

### Ilk Kullanim

Claude Code'u proje dizininde baslatin:

```bash
cd oplog-boilerplate
claude
```

Claude Code acildiginda, projenin yapisini otomatik olarak anlar (`CLAUDE.md` dosyasini okur) ve size yardimci olur.

---

## 4. Projeyi Klonla

Projeyi bilgisayariniza indirin:

```bash
# Repoyu klonla
git clone <repo-url>

# Proje dizinine gir
cd oplog-boilerplate
```

> **Not:** `<repo-url>` yerine projenin gercek Git URL'sini yazin. Bu URL'yi GitHub sayfasindaki yesil "Code" butonundan alabilirsiniz.

---

## 5. Bagimliliklari Yukle

Projenin calismas icin gereken tum kutuphaneleri yukleyin:

```bash
npm install
```

Bu komut `node_modules/` dizinini olusturur ve tum bagimliliklari indirir. Ilk seferde birkacc dakika surebilir.

---

## 6. Gelistirme Sunucusunu Baslat

```bash
npm run dev
```

Bu komut calistiktan sonra terminalde su mesaji goreceksiniz:

```
  VITE v6.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.x.x:5173/
```

---

## 7. Tarayicida Goruntule

Tarayicinizi acin ve adres cubuguna su adresi yazin:

```
http://localhost:5173
```

OPLOG App Template'in ana sayfasini (Dashboard) gormelisiniz. Sol tarafta sidebar menusi, ortada istatistik kartlari ve son aktiviteler tablosu yer alir.

### Sayfalar Arasi Gezinme

Sidebar'daki menuden farkli sayfalara gidebilirsiniz:
- **Ana Sayfa** - Dashboard istatistikleri
- **Hakkinda** - Template bilgileri ve teknoloji stack
- **Form Ornegi** - Form olusturma ornegi
- **Tablo Ornegi** - API'den veri cekme ve tablo ornegi

---

## 8. Ilk Degisikligi Yap

Simdi basit bir degisiklik yaparak her seyin calistigini dogrulayalim.

### Claude Code ile (Onerilen)

```bash
# Terminal'de Claude Code'u baslat
claude

# Sunu yazin:
> "Ana sayfadaki 'Dashboard' basligini 'OPLOG Kontrol Paneli' olarak degistir"
```

Claude Code degisikligi otomatik olarak yapacak ve tarayicida aninda goreceksiniz (Hot Module Replacement sayesinde sayfa yenilemeye gerek yok).

### Manuel Olarak

`src/client/pages/home.tsx` dosyasini bir metin editoru ile acin ve `title="Dashboard"` satirini `title="OPLOG Kontrol Paneli"` olarak degistirin. Dosyayi kaydedin ve tarayicida degisikligi gorun.

---

## Sonraki Adimlar

Artik projeniz calisiyor! Sirayla su dokumanlari okuyabilirsiniz:

1. [Sayfa Ekleme](ADDING_PAGES.md) - Yeni sayfa nasil eklenir
2. [API Ekleme](ADDING_API.md) - Backend endpoint nasil eklenir
3. [Bilesen Ekleme](ADDING_COMPONENTS.md) - UI bilesenleri nasil eklenir
4. [Ornek Prompt'lar](EXAMPLE_PROMPTS.md) - Claude Code icin ornek komutlar

---

## Sikca Sorulan Sorular

### `npm run dev` komutu calismadi, ne yapmaliyim?

1. `node --version` ile Node.js surumuuzu kontrol edin (v20+ olmali)
2. `npm install` komutunu tekrar calistirin
3. Baska bir terminal penceresinde ayni port kullanilmiyor oldugundan emin olun

### `npm install` cok uzun suruyor

Ilk seferde birkacc dakika surmesi normaldir. Internet baglantinizi kontrol edin.

### Tarayicida sayfa gozukmuyor

1. Terminal'de hata mesaji olup olmadigini kontrol edin
2. `http://localhost:5173` adresini dogru yazdiginizdan emin olun
3. Tarayici cache'ini temizleyin (Ctrl+Shift+R veya Cmd+Shift+R)

### Claude Code calismiyor

1. `npm install -g @anthropic-ai/claude-code` ile tekrar yukleyin
2. Terminal'i kapatip yeniden acin
3. API anahtarinizin gecerli oldugundan emin olun
