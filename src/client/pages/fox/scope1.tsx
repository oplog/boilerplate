// FOX Scope 1: Financial Consolidation & Reporting Foundation

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Database, Zap } from "lucide-react";

export function FoxScope1Page() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Scope 1: Consolidation & Reporting Foundation"
        description="Otomatik GL çekimi, birleşik CoA eşlemesi, konsolide P&L / Bilanço / Nakit Akışı ve finansal analiz altyapısı."
      />

      <Card className="border-l-4 border-l-blue-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Temel Çıktılar
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ul className="list-inside list-disc space-y-2 text-sm text-muted-foreground">
            <li>DIA (TR), DATEV (DE), XERO (UK), QuickBooks (US) — API/CSV ile otomatik çekim</li>
            <li>Kaynak CoA → Unified CoA eşlemesi ve para birimi çevirimi</li>
            <li>Konsolide P&L, Bilanço, Nakit Akışı dahilde üretim</li>
            <li>Metrikler, dashboard ve on-demand raporlama</li>
          </ul>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">GL Extraction</Badge>
            <Badge variant="outline">CoA Mapping</Badge>
            <Badge variant="outline">Consolidation</Badge>
            <Badge variant="outline">Reporting</Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-muted-foreground">
            <Zap className="h-5 w-5" />
            Geliştirme alanı
          </CardTitle>
          <CardDescription>
            Bu sayfa FOX Scope 1 özellikleri geliştirildikçe doldurulacak: sync durumu, mapping yönetimi,
            konsolide tablo önizleme, raporlar.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Referans: <code>docs/fox-strategic-initiative.md</code> — Scope 1 bölümü.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
