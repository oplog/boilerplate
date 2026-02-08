import { PageHeader } from "@/components/shared/page-header";
import { Separator } from "@/components/ui/separator";
import Stats01 from "@/components/blocks/stats-01";
import Stats02 from "@/components/blocks/stats-02";
import Stats03 from "@/components/blocks/stats-03";
import Stats04 from "@/components/blocks/stats-04";
import Stats05 from "@/components/blocks/stats-05";
import Stats07 from "@/components/blocks/stats-07";
import Stats08 from "@/components/blocks/stats-08";
import Stats10 from "@/components/blocks/stats-10";
import Stats15 from "@/components/blocks/stats-15";

export function StatsExamplePage() {
  return (
    <div>
      <PageHeader
        title="Stats Örnekleri"
        description="MessageCard tabanlı istatistik blokları — farklı layout ve veri gösterim seçenekleri"
      />

      <div className="space-y-10">
        {/* Stats 01 - Temel Finansal */}
        <section>
          <h2 className="text-lg font-semibold mb-3">Finansal Özet</h2>
          <p className="text-sm text-muted-foreground mb-4">4 sütunlu temel metrik kartları, değişim yüzdesi ile</p>
          <Stats01 />
        </section>

        <Separator />

        {/* Stats 02 - Karşılaştırmalı */}
        <section>
          <h2 className="text-lg font-semibold mb-3">Karşılaştırmalı Metrikler</h2>
          <p className="text-sm text-muted-foreground mb-4">Önceki dönem karşılaştırması ve trend badge'i</p>
          <Stats02 />
        </section>

        <Separator />

        {/* Stats 03 - Minimal */}
        <section>
          <h2 className="text-lg font-semibold mb-3">Minimal İstatistikler</h2>
          <p className="text-sm text-muted-foreground mb-4">Sade tasarım, büyük sayı ve değişim göstergesi</p>
          <Stats03 />
        </section>

        <Separator />

        {/* Stats 04 - Badge ile */}
        <section>
          <h2 className="text-lg font-semibold mb-3">Trend Badge'li Kartlar</h2>
          <p className="text-sm text-muted-foreground mb-4">Başlık yanında renkli trend badge'i</p>
          <Stats04 />
        </section>

        <Separator />

        {/* Stats 05 - CTA ile */}
        <section>
          <h2 className="text-lg font-semibold mb-3">Aksiyon Butonlu</h2>
          <p className="text-sm text-muted-foreground mb-4">Alt kısımda "Detayları gör" link butonu</p>
          <Stats05 />
        </section>

        <Separator />

        {/* Stats 07 - Radial Gauge */}
        <section>
          <h2 className="text-lg font-semibold mb-3">Kapasite Göstergeleri</h2>
          <p className="text-sm text-muted-foreground mb-4">Radial gauge ile kullanım yüzdesi</p>
          <Stats07 />
        </section>

        <Separator />

        {/* Stats 08 - Bütçe Radial */}
        <section>
          <h2 className="text-lg font-semibold mb-3">Bütçe Takibi</h2>
          <p className="text-sm text-muted-foreground mb-4">Departman bütçe ilerlemesi, radial chart ile</p>
          <Stats08 />
        </section>

        <Separator />

        {/* Stats 10 - Mini Sparkline */}
        <section>
          <h2 className="text-lg font-semibold mb-3">Trend Sparkline</h2>
          <p className="text-sm text-muted-foreground mb-4">Mini alan grafiği ile değer trendi</p>
          <Stats10 />
        </section>

        <Separator />

        {/* Stats 15 - Liste */}
        <section>
          <h2 className="text-lg font-semibold mb-3">Projeksiyon Listesi</h2>
          <p className="text-sm text-muted-foreground mb-4">Kompakt liste formatında yatırım büyüme projeksiyonu</p>
          <Stats15 />
        </section>
      </div>
    </div>
  );
}
