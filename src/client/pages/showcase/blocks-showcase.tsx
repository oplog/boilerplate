// Showcase: Block Bileşenleri
// Stats (9 varyant), Table (2), Dialog (2), FormLayout, FileUpload, CommandMenu

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
import Table03 from "@/components/blocks/table-03";
import Table05 from "@/components/blocks/table-05";
import Dialog01 from "@/components/blocks/dialog-01";
import Dialog11 from "@/components/blocks/dialog-11";
import FormLayout02 from "@/components/blocks/form-layout-02";
import FileUpload04 from "@/components/blocks/file-upload-04";

function BlockSection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-base font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="rounded-lg border p-4">{children}</div>
      <Separator />
    </div>
  );
}

export function ShowcaseBlocks() {
  return (
    <div className="space-y-6">
      {/* Stats Blocks */}
      <div>
        <h2 className="mb-4 text-lg font-bold">Stats Blokları (9 Varyant)</h2>
        <div className="space-y-6">
          <BlockSection title="Stats01" description="Temel metrik kartları — gelir, büyüme, müşteri, sipariş">
            <Stats01 />
          </BlockSection>
          <BlockSection title="Stats02" description="Önceki dönem karşılaştırmalı metrikler">
            <Stats02 />
          </BlockSection>
          <BlockSection title="Stats03" description="Minimal — büyük sayılar ile vurgu">
            <Stats03 />
          </BlockSection>
          <BlockSection title="Stats04" description="Renkli trend badge'leri (yeşil/kırmızı)">
            <Stats04 />
          </BlockSection>
          <BlockSection title="Stats05" description="Aksiyon butonu ile detay sayfasına yönlendirme">
            <Stats05 />
          </BlockSection>
          <BlockSection title="Stats07" description="Radial gauge — kapasite göstergeleri">
            <Stats07 />
          </BlockSection>
          <BlockSection title="Stats08" description="Departman bütçe takibi — radial progress">
            <Stats08 />
          </BlockSection>
          <BlockSection title="Stats10" description="Sparkline trend çizgileri ile kompakt görünüm">
            <Stats10 />
          </BlockSection>
          <BlockSection title="Stats15" description="Liste formatı — sıralama ve projeksiyon">
            <Stats15 />
          </BlockSection>
        </div>
      </div>

      <Separator />

      {/* Table Blocks */}
      <div>
        <h2 className="mb-4 text-lg font-bold">Tablo Blokları</h2>
        <div className="space-y-6">
          <BlockSection title="Table03" description="Basit tablo — badge'li durum gösterimi">
            <Table03 />
          </BlockSection>
          <BlockSection title="Table05" description="Gelişmiş tablo — filtreleme, sıralama, toplu işlem">
            <Table05 />
          </BlockSection>
        </div>
      </div>

      <Separator />

      {/* Dialog Blocks */}
      <div>
        <h2 className="mb-4 text-lg font-bold">Dialog Blokları</h2>
        <div className="space-y-6">
          <BlockSection title="Dialog01" description="Basit onay dialogu">
            <Dialog01 />
          </BlockSection>
          <BlockSection title="Dialog11" description="Form içeren multi-input dialog">
            <Dialog11 />
          </BlockSection>
        </div>
      </div>

      <Separator />

      {/* Form & File Upload Blocks */}
      <div>
        <h2 className="mb-4 text-lg font-bold">Form & Dosya Blokları</h2>
        <div className="space-y-6">
          <BlockSection title="FormLayout02" description="Yan label'lı form layout">
            <FormLayout02 />
          </BlockSection>
          <BlockSection title="FileUpload04" description="Progress bar'lı dosya yükleme">
            <FileUpload04 />
          </BlockSection>
        </div>
      </div>
    </div>
  );
}
