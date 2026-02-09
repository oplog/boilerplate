// FOX Scope 3: AI-Powered Proactive Financial Intelligence

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Sparkles, BarChart3 } from "lucide-react";

export function FoxScope3Page() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Scope 3: AI-Powered Proactive Intelligence"
        description="Agentic AI ile anomali tespiti, varyans analizi, tahminleme ve yönetim/board için proaktif öneriler."
      />

      <Card className="border-l-4 border-l-violet-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            İki Boyut
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="mb-2 font-medium">Yönetim (Internal)</h4>
            <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
              <li>Proaktif anomali tespiti</li>
              <li>Otomatik varyans / flux analizi</li>
              <li>Nakit akışı tahmini, bütçe vs gerçek uyarıları</li>
              <li>Stratejik öneriler (maliyet, yatırım zamanlaması)</li>
              <li>FOX + FABRIKA cost-to-serve görünürlüğü</li>
            </ul>
          </div>
          <div>
            <h4 className="mb-2 font-medium">Board & Yatırımcı</h4>
            <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
              <li>Gerçek zamanlı çoklu-entity finansal görünürlük</li>
              <li>On-demand, sistem üretimi board raporları</li>
              <li>İleriye dönük anlatı ve senaryo modelleme</li>
            </ul>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">Anomaly</Badge>
            <Badge variant="outline">Variance</Badge>
            <Badge variant="outline">Forecast</Badge>
            <Badge variant="outline">Board</Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-muted-foreground">
            <BarChart3 className="h-5 w-5" />
            Geliştirme alanı
          </CardTitle>
          <CardDescription>
            Scopes 1–2 veri ve süreçleri hazır oldukça: AI agentleri, alert dashboard’ları ve rapor üretimi burada geliştirilecek.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Referans: <code>docs/fox-strategic-initiative.md</code> — Scope 3 bölümü.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
