// FOX — Financial Operational eXcellence
// Ana özet sayfası: 3 scope ve strateji özeti

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/shared/page-header";
import {
  LayoutDashboard,
  Database,
  Workflow,
  Sparkles,
  ArrowRight,
  FileText,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const scopes = [
  {
    id: "scope1",
    title: "Scope 1: Consolidation & Reporting Foundation",
    shortTitle: "Konsolidasyon & Raporlama",
    href: "/fox/scope1",
    icon: Database,
    description:
      "Tüm ülke muhasebe sistemlerinden otomatik GL çekimi, birleşik CoA eşlemesi, konsolide finansal tablolar (P&L, Bilanço, Nakit Akışı) ve metrik/dashboard ile analiz.",
    status: "Temel — her şey buna dayanır",
    color: "border-l-4 border-l-blue-500",
  },
  {
    id: "scope2",
    title: "Scope 2: In-Country Operations Optimization",
    shortTitle: "Ülke İçi Operasyonlar",
    href: "/fox/scope2",
    icon: Workflow,
    description:
      "Defter tutma, kapanış, mutabakat, maliyet dağıtımı ve FABRIKA entegrasyonu ile müşteri faturalama — no-touch operasyonlara doğru ilerleme.",
    status: "Scope 1 tamamlandıkça",
    color: "border-l-4 border-l-emerald-500",
  },
  {
    id: "scope3",
    title: "Scope 3: AI-Powered Proactive Intelligence",
    shortTitle: "AI ile Proaktif Zeka",
    href: "/fox/scope3",
    icon: Sparkles,
    description:
      "Anomali tespiti, varyans analizi, nakit akışı tahmini, yönetim ve board için proaktif öneriler — agentic AI ile stratejik karar destekleri.",
    status: "Veri ve süreçler hazır oldukça",
    color: "border-l-4 border-l-violet-500",
  },
];

export function FoxOverviewPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="FOX — Financial Operational eXcellence"
        description="Bookkeeping'den konsolidasyona, mutabakattan raporlamaya tüm finansal yaşam döngüsünü AI-native platforma dönüştürme."
      />

      <Card className="bg-muted/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <LayoutDashboard className="h-5 w-5" />
            Strateji Özeti
          </CardTitle>
          <CardDescription>
            FOX, Service Manufacturing Platform (NEXUS) içinde kurumsal finansal zeka katmanıdır.
            FABRIKA (depo maliyetleri) ile birlikte uçtan uca maliyet-görünürlüğü sağlar.
            Strateji dokümanı: <code className="rounded bg-muted px-1 text-xs">docs/fox-strategic-initiative.md</code>
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
        {scopes.map((scope) => (
          <Card key={scope.id} className={scope.color}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <scope.icon className="h-8 w-8 text-muted-foreground" />
                <Badge variant="secondary" className="text-xs">
                  {scope.status}
                </Badge>
              </div>
              <CardTitle className="text-base">{scope.shortTitle}</CardTitle>
              <CardDescription className="text-sm">{scope.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" size="sm" asChild className="w-full">
                <Link to={scope.href}>
                  Detay
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Başarı Kriterleri (Özet)
          </CardTitle>
          <CardDescription>
            Tüm 4 ülke verisi otomatik akış, konsolide tablolar dahilde üretim, CFO-as-a-service kaldırılması,
            metrik/dashboard ile analiz, AI ile aksiyon alınabilir içgörüler.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
