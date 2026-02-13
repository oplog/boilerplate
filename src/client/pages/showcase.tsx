// Bileşen Kataloğu — Tüm bileşenleri, block'ları ve ileri düzey öğeleri gösteren tek sayfa
// 6 Tab: Form & Giriş, Veri Gösterim, Layout & Navigasyon, Overlay & Geri Bildirim, Bloklar, Gelişmiş

import { PageHeader } from "@/components/shared/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShowcaseFormInputs } from "./showcase/form-inputs";
import { ShowcaseDataDisplay } from "./showcase/data-display";
import { ShowcaseLayoutNav } from "./showcase/layout-nav";
import { ShowcaseOverlayFeedback } from "./showcase/overlay-feedback";
import { ShowcaseBlocks } from "./showcase/blocks-showcase";
import { ShowcaseAdvanced } from "./showcase/advanced-showcase";

export function ShowcasePage() {
  return (
    <div>
      <PageHeader
        title="Bileşen Kataloğu"
        description="Projede kullanılabilir tüm bileşenler, bloklar ve ileri düzey öğeler"
      />

      <Tabs defaultValue="form-inputs">
        <TabsList className="mb-4 flex w-full flex-wrap gap-1">
          <TabsTrigger value="form-inputs">Form & Giriş</TabsTrigger>
          <TabsTrigger value="data-display">Veri Gösterim</TabsTrigger>
          <TabsTrigger value="layout-nav">Layout & Navigasyon</TabsTrigger>
          <TabsTrigger value="overlay-feedback">Overlay & Geri Bildirim</TabsTrigger>
          <TabsTrigger value="blocks">Bloklar</TabsTrigger>
          <TabsTrigger value="advanced">Gelişmiş</TabsTrigger>
        </TabsList>

        <TabsContent value="form-inputs">
          <ShowcaseFormInputs />
        </TabsContent>
        <TabsContent value="data-display">
          <ShowcaseDataDisplay />
        </TabsContent>
        <TabsContent value="layout-nav">
          <ShowcaseLayoutNav />
        </TabsContent>
        <TabsContent value="overlay-feedback">
          <ShowcaseOverlayFeedback />
        </TabsContent>
        <TabsContent value="blocks">
          <ShowcaseBlocks />
        </TabsContent>
        <TabsContent value="advanced">
          <ShowcaseAdvanced />
        </TabsContent>
      </Tabs>
    </div>
  );
}
