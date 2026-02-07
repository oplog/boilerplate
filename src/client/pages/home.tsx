// Ana sayfa - OPLOG App Builder Rehberi
// Claude Code ile nasıl uygulama geliştirileceğini ekiplere anlatan kapsamlı rehber

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  MessageSquare,
  Rocket,
  Code2,
  Layers,
  Terminal,
  Database,
  BarChart3,
  FileText,
  Users,
  Headphones,
  Truck,
  Wallet,
  Search,
  PlusCircle,
  RefreshCw,
  Globe,
  Lightbulb,
} from "lucide-react";

// Claude Code kullanım adımları
const steps = [
  {
    icon: Terminal,
    title: "1. Claude Code'u Aç",
    description:
      "Terminal'de proje klasörüne git ve 'claude' yaz. Claude Code açılacak ve projeyi otomatik tanıyacak.",
    code: "cd proje-klasoru && claude",
  },
  {
    icon: MessageSquare,
    title: "2. Ne İstediğini Söyle",
    description:
      "Türkçe veya İngilizce, ne yapmak istediğini yaz. Detay verdikçe sonuç o kadar iyi olur.",
    code: '"Müşteri listesi sayfası oluştur"',
  },
  {
    icon: Layers,
    title: "3. Sonucu Gör",
    description:
      "Claude kodu yazar, dosyaları oluşturur. Tarayıcıda localhost'u aç, değişiklikleri anında gör.",
    code: "npm run dev → localhost:5173",
  },
  {
    icon: Rocket,
    title: "4. Yayınla",
    description:
      "GitHub'a push'la, CI/CD otomatik deploy eder. Ya da Claude'a 'deploy et' de.",
    code: "git push origin main",
  },
];

// Ekiplere göre örnek promptlar
const teamPrompts = [
  {
    team: "Operasyon",
    icon: Truck,
    color: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    prompts: [
      "Günlük sevkiyat takip tablosu oluştur, tarih/müşteri/durum/kargo firması kolonları olsun",
      "Depo doluluk oranını gösteren dashboard yap, yüzdelik bar chart ile",
      "Sipariş durumu değişikliğini gösteren timeline komponenti ekle",
      "Vardiya planı giriş formu yap, çalışan adı, tarih, saat ve pozisyon alanları olsun",
    ],
  },
  {
    team: "Finans",
    icon: Wallet,
    color: "bg-green-500/10 text-green-600 dark:text-green-400",
    prompts: [
      "Aylık gelir/gider tablosu yap, toplam ve kâr satırı olsun",
      "Fatura oluşturma formu yap - müşteri seçimi, kalemler, KDV hesaplama olsun",
      "Son 12 ayın ciro grafiğini çiz, çubuk grafik olsun",
      "Ödeme vadeleri listesi yap, gecikenleri kırmızı göster",
    ],
  },
  {
    team: "Müşteri Destek",
    icon: Headphones,
    color: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
    prompts: [
      "Müşteri talep/şikayet formu oluştur, öncelik seviyesi ve kategori olsun",
      "Açık ticketları listeleyen tablo yap, durum ve önceliğe göre filtrele",
      "Müşteri memnuniyet anketi sayfası yap, 1-5 yıldız değerlendirme olsun",
      "Sık sorulan sorular sayfası oluştur, accordion ile aç/kapa olsun",
    ],
  },
  {
    team: "İnsan Kaynakları",
    icon: Users,
    color: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
    prompts: [
      "Personel listesi sayfası yap, departman ve pozisyona göre filtrele",
      "İzin talep formu oluştur, tarih seçici ve izin türü olsun",
      "Organizasyon şeması sayfası yap",
      "Yeni işe alım başvuru formu oluştur, CV yükleme alanı olsun",
    ],
  },
];

// İleri seviye prompt örnekleri
const advancedPrompts = [
  {
    icon: Database,
    title: "Veritabanı & API",
    prompts: [
      "D1 veritabanı ekle, müşteriler tablosu oluştur ve CRUD API yaz",
      "Backend'e /api/products endpoint'i ekle, GET ile listeleme POST ile ekleme yapsın",
      "KV store kullanarak önbellek ekle, sık kullanılan verileri cache'le",
    ],
  },
  {
    icon: BarChart3,
    title: "Grafik & Raporlama",
    prompts: [
      "Recharts ile pasta grafiği ekle, kategori bazlı dağılımı göstersin",
      "Haftalık performans karşılaştırma tablosu yap, önceki haftayla kıyaslasın",
      "PDF export butonu ekle, tablo verilerini PDF olarak indirebilsin",
    ],
  },
  {
    icon: FileText,
    title: "Form & Validasyon",
    prompts: [
      "Çok adımlı (wizard) form yap, her adımda farklı alanlar olsun",
      "Dosya yükleme alanı ekle, sürükle-bırak destekli olsun",
      "Form alanlarına Türkçe hata mesajları ekle, TC kimlik no doğrulama yap",
    ],
  },
  {
    icon: Globe,
    title: "Genel & Tasarım",
    prompts: [
      "Sidebar'a yeni menü öğesi ekle ve ilgili sayfayı oluştur",
      "Dark mode'da renkleri düzenle, primary rengi turuncuya çevir",
      "Mobilde hamburger menü düzgün çalışsın, responsive yap",
    ],
  },
];

// Query ve veri çekme örnekleri
const queryExamples = [
  {
    title: "Veri Listeleme",
    icon: Search,
    description: "API'den veri çekip tabloda göster",
    prompt:
      "Backend'de /api/siparisler endpoint'i oluştur, frontend'de bu veriyi çeken tablo sayfası yap",
  },
  {
    title: "Veri Ekleme",
    icon: PlusCircle,
    description: "Form ile yeni kayıt oluştur",
    prompt:
      "Yeni müşteri ekleme formu yap, kaydedince API'ye POST atsın ve listeye geri dönsün",
  },
  {
    title: "Veri Güncelleme",
    icon: RefreshCw,
    description: "Mevcut kaydı düzenle",
    prompt:
      "Müşteri listesinde düzenle butonu ekle, tıklayınca form açılsın ve güncellenebilsin",
  },
];

export function HomePage() {
  return (
    <div className="max-w-4xl">
      {/* Hero */}
      <Card className="mb-8 overflow-hidden">
        <CardContent className="flex flex-col items-center gap-4 py-8 text-center">
          <img src="/OPLOG.png" alt="OPLOG" className="h-16 w-auto" />
          <div>
            <h1 className="text-2xl font-bold">OPLOG App Builder</h1>
            <p className="mx-auto mt-2 max-w-lg text-muted-foreground">
              Bu template, OPLOG ekiplerinin yazılım bilgisi olmadan uygulama
              geliştirmesi için tasarlandı. Tek ihtiyacın{" "}
              <strong>Claude Code</strong> ve bir fikir.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Nasıl Çalışır */}
      <div className="mb-8">
        <h2 className="mb-4 text-lg font-semibold">Nasıl Çalışır?</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {steps.map((step) => (
            <Card key={step.title}>
              <CardHeader className="flex flex-row items-center gap-3 pb-2">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <step.icon className="h-5 w-5" />
                </div>
                <CardTitle className="text-base">{step.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-2 text-sm text-muted-foreground">
                  {step.description}
                </p>
                <code className="rounded bg-muted px-2 py-1 text-xs">
                  {step.code}
                </code>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Separator className="mb-8" />

      {/* Ekiplere Göre Örnek Promptlar */}
      <div className="mb-8">
        <div className="mb-4 flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-yellow-500" />
          <h2 className="text-lg font-semibold">
            Ekibine Göre Örnek Komutlar
          </h2>
        </div>
        <p className="mb-4 text-sm text-muted-foreground">
          Claude Code'a bunları aynen yazabilirsin. Kendi ihtiyacına göre
          değiştir, detay ekle.
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          {teamPrompts.map((team) => (
            <Card key={team.team}>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-md ${team.color}`}
                  >
                    <team.icon className="h-4 w-4" />
                  </div>
                  <CardTitle className="text-base">{team.team}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {team.prompts.map((prompt) => (
                    <div
                      key={prompt}
                      className="rounded-md border bg-muted/50 px-3 py-2 text-xs leading-relaxed"
                    >
                      &gt; "{prompt}"
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Separator className="mb-8" />

      {/* Veri İşlemleri */}
      <div className="mb-8">
        <div className="mb-4 flex items-center gap-2">
          <Database className="h-5 w-5 text-blue-500" />
          <h2 className="text-lg font-semibold">Veri İşlemleri Nasıl Yapılır?</h2>
        </div>
        <p className="mb-4 text-sm text-muted-foreground">
          API oluşturma, veri çekme ve form kaydetme işlemleri için Claude'a
          şunları söyle:
        </p>

        <div className="grid gap-4 sm:grid-cols-3">
          {queryExamples.map((example) => (
            <Card key={example.title}>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <example.icon className="h-4 w-4 text-muted-foreground" />
                  <CardTitle className="text-sm">{example.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="mb-2 text-xs text-muted-foreground">
                  {example.description}
                </p>
                <div className="rounded-md border bg-muted/50 px-3 py-2 text-xs leading-relaxed">
                  &gt; "{example.prompt}"
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Separator className="mb-8" />

      {/* İleri Seviye */}
      <div className="mb-8">
        <div className="mb-4 flex items-center gap-2">
          <Code2 className="h-5 w-5 text-green-500" />
          <h2 className="text-lg font-semibold">İleri Seviye Komutlar</h2>
        </div>
        <p className="mb-4 text-sm text-muted-foreground">
          Veritabanı, grafik, dosya yükleme gibi daha karmaşık işlemler için:
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          {advancedPrompts.map((category) => (
            <Card key={category.title}>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <category.icon className="h-4 w-4 text-muted-foreground" />
                  <CardTitle className="text-sm">{category.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {category.prompts.map((prompt) => (
                    <div
                      key={prompt}
                      className="rounded-md border bg-muted/50 px-3 py-2 text-xs leading-relaxed"
                    >
                      &gt; "{prompt}"
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Separator className="mb-8" />

      {/* İpuçları */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-base">İpuçları</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 text-sm sm:grid-cols-2">
            <div className="flex items-start gap-2">
              <Badge variant="outline" className="mt-0.5 shrink-0">
                1
              </Badge>
              <span>
                <strong>Detay ver:</strong> "Tablo yap" yerine "Müşteri tablosu
                yap, isim/email/telefon kolonları olsun, arama kutusu ekle"
              </span>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="outline" className="mt-0.5 shrink-0">
                2
              </Badge>
              <span>
                <strong>Adım adım iste:</strong> Büyük işleri parçala. Önce
                "tablo yap", sonra "filtreleme ekle", sonra "export butonu ekle"
              </span>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="outline" className="mt-0.5 shrink-0">
                3
              </Badge>
              <span>
                <strong>Hata varsa söyle:</strong> "Bu çalışmıyor, şu hatayı
                alıyorum: ..." diye hatayı yapıştır
              </span>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="outline" className="mt-0.5 shrink-0">
                4
              </Badge>
              <span>
                <strong>Türkçe yaz:</strong> Claude Türkçe anlıyor. İstediğini
                kendi cümlelerinle rahatça anlatabilirsin
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hızlı Komut Referansı */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Hızlı Komut Referansı</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between rounded-md bg-muted/50 px-3 py-2">
              <span className="text-muted-foreground">Projeyi çalıştır</span>
              <code className="rounded bg-background px-2 py-0.5 text-xs">
                npm run dev
              </code>
            </div>
            <div className="flex items-center justify-between rounded-md bg-muted/50 px-3 py-2">
              <span className="text-muted-foreground">Build al</span>
              <code className="rounded bg-background px-2 py-0.5 text-xs">
                npm run build
              </code>
            </div>
            <div className="flex items-center justify-between rounded-md bg-muted/50 px-3 py-2">
              <span className="text-muted-foreground">Deploy et</span>
              <code className="rounded bg-background px-2 py-0.5 text-xs">
                npm run deploy
              </code>
            </div>
            <div className="flex items-center justify-between rounded-md bg-muted/50 px-3 py-2">
              <span className="text-muted-foreground">Claude Code aç</span>
              <code className="rounded bg-background px-2 py-0.5 text-xs">
                claude
              </code>
            </div>
            <div className="flex items-center justify-between rounded-md bg-muted/50 px-3 py-2">
              <span className="text-muted-foreground">GitHub'a gönder</span>
              <code className="rounded bg-background px-2 py-0.5 text-xs">
                git push origin main
              </code>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
