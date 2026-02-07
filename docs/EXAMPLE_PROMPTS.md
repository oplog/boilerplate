# Claude Code Icin Ornek Prompt'lar

Bu dokuman, Claude Code ile uygulama gelistirirken kullanabilecginiz ornek komutlari (prompt'lari) icerir. Bu prompt'lari dogrudan Claude Code'a yazabilirsiniz.

> **Ipucu:** Claude Code'u baslatmak icin terminal'de proje dizininde `claude` yazin.

---

## Sayfa Islemleri

### Yeni Sayfa Olusturma

```
Yeni bir "Urunler" sayfasi olustur. Sayfada urun listesi tablo halinde gosterilsin.
Tabloda urun adi, kategorisi, fiyati ve stok durumu sutunlari olsun.
Sidebar'a da linkini ekle.
```

```
Musteri detay sayfasi olustur. URL'den musteri ID'sini alsin (/customers/:id).
Sayfada musterinin adi, emaili, telefonu ve siparis gecmisi gosterilsin.
Siparis gecmisi tablo olarak gosterilsin.
```

```
Ayarlar sayfasi olustur. Icerisinde 3 sekme (tab) olsun:
1. Genel Ayarlar - uygulama adi ve dil secimi
2. Bildirimler - email ve push bildirim on/off
3. Guvenlik - sifre degistirme formu
```

```
Dashboard sayfasina yeni bir bolum ekle: "Haftalik Ozet" kart. Kart icinde
bu haftaki toplam siparis, tamamlanan siparis ve iptal edilen siparis sayilari olsun.
```

### Mevcut Sayfayi Duzenleme

```
Ana sayfadaki istatistik kartlarinin icerigini guncelle. "Toplam Siparis" yerine
"Bugunun Siparisleri", "Aktif Musteri" yerine "Yeni Musteriler" yaz.
```

```
Tablo ornegi sayfasina bir "Yeni Ekle" butonu koy. Butona tikladiginda bir modal
(dialog) acilsin ve icinde isim, aciklama ve durum alanlari olan bir form olsun.
```

```
Hakkinda sayfasina ekip uyeleri bolumu ekle. Her uye icin isim, pozisyon ve
avatar (bos harf ikonu) gosterilsin. Grid layout ile 3 sutunlu olsun.
```

---

## UI Degisiklikleri

### Tema ve Renkler

```
Uygulamanin ana rengini maviden yesile cevir. Primary renk yesil tonlarinda olsun.
```

```
Sidebar'in arka plan rengini koyu gri yap. Aktif menu ogesinin rengi turuncu olsun.
```

```
Dark mode toggle butonu ekle. Header'in sag tarafinda bir gunes/ay ikonu olsun.
Tiklayinca dark mode acilip kapansin.
```

### Bilesenler

```
Tum tablolara "Excel'e Aktar" butonu ekle. Buton tablonun sag ustunde olsun,
tiklaninca tablo verilerini CSV olarak indirsin.
```

```
Sayfalar arasi geciste yukleniyor animasyonu ekle. Sayfa degisirken kisa bir
skeleton animasyonu gosterilsin.
```

```
Form gonderildikten sonra basari bildirimi gosterilsin. Yesil renkli toast
bildirim "Kayit basariyla olusturuldu" mesaji gostersin.
```

```
Tablo satirlarina tiklayinca detay gosterilsin. Satira tiklaninca sagdan bir
sheet (yan panel) acilsin ve icerisinde detay bilgileri gosterilsin.
```

### Responsive Tasarim

```
Dashboard istatistik kartlarini mobilde tek sutun, tablette 2 sutun, masaustunde
4 sutun olacak sekilde responsive yap.
```

```
Tablo sutunlarindaki "Aciklama" ve "Olusturulma Tarihi" mobilde gizlensin.
Sadece isim ve durum sutunlari gorunsun.
```

```
Mobilde sidebar otomatik kapansin. Bir menur butonu ekle, tiklayinca sidebar
sol taraftan kayarak acilsin.
```

---

## API Islemleri

### Yeni Endpoint Olusturma

```
Musteriler icin bir API olustur. Endpoint: /api/customers
- GET / : Tum musterileri listele (pagination destekli)
- GET /:id : Tek musteri getir
- POST / : Yeni musteri olustur (isim, email, telefon)
- PUT /:id : Musteri bilgilerini guncelle
- DELETE /:id : Musteri sil
Zod validation kullan.
```

```
Dashboard istatistikleri icin bir API endpoint'i olustur: GET /api/dashboard/stats
Toplam siparis sayisi, aktif musteri sayisi, bugunun geliri ve onceki gune gore
degisim yuzdelerini donsun.
```

```
Rapor API'si olustur. GET /api/reports/daily endpoint'i bugunun islem ozetini
donsun: toplam islem, basarili islem, basarisiz islem, ortalama islem suresi.
```

### Mevcut Endpoint'i Duzenleme

```
/api/examples endpoint'ine tarih filtresi ekle. start_date ve end_date query
parametreleri ile filtreleme yapilabilsin.
```

```
/api/examples POST endpoint'ine email bildirimi ekle. Yeni kayit olusturuldugunda
console.log ile "Yeni kayit: {isim}" yazdir (gercek email yerine simdilik).
```

---

## Dashboard Ozellikleri

### Grafikler ve Chartlar

```
Dashboard'a bir cizgi grafik (line chart) ekle. Son 7 gunun siparis sayisini gostersin.
Recharts kutuphanesini kullan. X ekseninde gun isimleri, Y ekseninde siparis sayisi olsun.
```

```
Dashboard'a bir pasta grafik (pie chart) ekle. Siparis durumlarinin dagilimini
gostersin: Bekleyen (%30), Tamamlanan (%55), Iptal (%15). Renkli legendle birlikte.
```

```
Dashboard'a bir bar chart ekle. Departmanlara gore aylik performans gostersin.
Operasyon, Depo, Lojistik, IT departmanlari icin ayri cubuklar olsun.
```

### Filtreler

```
Dashboard'a tarih araligi filtresi ekle. "Bugun", "Bu Hafta", "Bu Ay", "Ozel Aralik"
secenekleri olsun. Secilen tarihe gore istatistikler guncellensin.
```

```
Tablo sayfasina durum filtresi ekle. "Tumu", "Aktif", "Pasif" butonlari olsun.
Tiklaninca tablo filtrelensin.
```

```
Tablo sayfasina siralama ozelligt ekle. Sutun basligina tiklaninca o sutuna gore
siralama yapilsin (A-Z / Z-A toggle).
```

---

## Veritabani Islemleri

### D1 (SQL)

```
D1 veritabaninda bir urunler tablosu olustur: id, name, category, price, stock,
status, created_at, updated_at alanlari olsun. Migration dosyasini olustur.
```

```
Urunler API'sini D1 veritabanini kullanacak sekilde guncelle. In-memory dizi
yerine gercek SQL sorgulari kullansin. Arama ve pagination desteklesin.
```

### KV

```
Uygulama ayarlari icin KV store kullanan bir sistem olustur. Tema rengi, dil,
sidebar acik/kapali gibi ayarlari KV'de saklasin ve frontend'den degistirilebilsin.
```

### R2

```
Dosya yukleme sistemi olustur. Bir sayfa olustur, uzerinde dosya secme butonu
olsun. Secilen dosya R2'ye yuklensin ve yuklenen dosyalarin listesi gosterilsin.
```

---

## Genel Islemler

### Hata Duzeltme

```
Su hatayi aliyorum: "Cannot find module '@/components/ui/calendar'".
Bu hatayai duzelt.
```

```
Form gonderildiginde sayfa yenileniyor. Form gonderimini engelleyip toast
bildirimi gosterecek sekilde duzelt.
```

```
Tablo verisi yuklenmediginde bos bir sayfa gorunuyor. Veri yokken "Kayit bulunamadi"
mesaji gosterilsin.
```

### Performans

```
Dashboard sayfasinin yuklenmesini hizlandir. API cagrilarini paralel yap ve
skeleton yukleniyor animasyonu ekle.
```

```
Tablodaki arama kutusuna debounce ekle. Kullanici her harf yazdiginda degil,
yazmay bitirdikten 300ms sonra arama yapilsin.
```

### Dark Mode

```
Uygulamaya dark mode destegi ekle. Header'a bir toggle butonu koy. Kullanicinin
tercihi localStorage'da saklansin.
```

### Diger

```
Uygulamaya 404 sayfasi ekle. Gecersiz URL'lere gidildiginde "Sayfa Bulunamadi"
mesaji gosterilsin ve ana sayfaya donme linki olsun.
```

```
Tum sayfalara breadcrumb (ekmek kirintisi) navigasyonu ekle. Kullanicinin
hangi sayfada oldugu gorunsun: Ana Sayfa > Urunler > Urun Detay
```

```
Sidebar'a kullanici profil alani ekle. En altta kullanicinin adi, rolu ve
bir cikis butonu olsun.
```

```
Uygulamaya Turkce/Ingilizce dil degistirme ozelligi ekle. Header'da bir
dil secici olsun.
```

---

## Prompt Yazma Ipuclari

### Iyi Prompt Ornekleri

1. **Spesifik olun:**
   - Iyi: "Musteriler sayfasi olustur, tabloda isim, email ve telefon sutunlari olsun"
   - Kotu: "Bir sayfa yap"

2. **Gorunum belirtin:**
   - Iyi: "4 sutunlu grid layout'ta kart bilesenleri ile goster"
   - Kotu: "Guzel gorunsun"

3. **Davranis belirtin:**
   - Iyi: "Butona tiklaninca modal acilsin, formda isim ve email alanlari olsun"
   - Kotu: "Butona birseyler ekle"

4. **Referans verin:**
   - Iyi: "Tablo ornegi sayfasindaki gibi bir tablo olustur ama musteri verileri ile"
   - Kotu: "Bir tablo yap"

### Karmasik Istekleri Bolun

Buyuk degisiklikler icin istegi adimlara bolun:

```
# 1. Adim
> "Urunler icin bir API endpoint'i olustur. GET ve POST desteklesin."

# 2. Adim
> "Simdi bu API'yi kullanan bir urunler sayfasi olustur."

# 3. Adim
> "Urunler sayfasina arama kutusu ve filtreleme ekle."

# 4. Adim
> "Urunler sayfasina yeni urun ekleme modal'i ekle."
```
