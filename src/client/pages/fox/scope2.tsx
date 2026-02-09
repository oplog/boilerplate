// FOX Scope 2: In-Country Operations Optimization

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Workflow, Link2 } from "lucide-react";

export function FoxScope2Page() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Scope 2: In-Country Operations Optimization"
        description="Defter tutma, kapanış, mutabakat, maliyet dağıtımı ve FABRIKA → müşteri faturalama — no-touch’a doğru."
      />

      <Card className="border-l-4 border-l-emerald-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Workflow className="h-5 w-5" />
            Yetenek Alanları
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ul className="list-inside list-disc space-y-2 text-sm text-muted-foreground">
            <li>Bookkeeping otomasyonu (tekrarlayan işlem tipleri)</li>
            <li>Kapanış yönetimi — checklist, kontrol, entity durumu</li>
            <li>Mutabakat — banka, GL, şirketler arası; AI destekli eşleştirme</li>
            <li>FABRIKA entegrasyonu ile müşteri faturalama pipeline</li>
            <li>Maliyet dağıtım / allocation kuralları</li>
          </ul>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">Bookkeeping</Badge>
            <Badge variant="outline">Close</Badge>
            <Badge variant="outline">Reconciliation</Badge>
            <Badge variant="outline">FABRIKA</Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-muted-foreground">
            <Link2 className="h-5 w-5" />
            Geliştirme alanı
          </CardTitle>
          <CardDescription>
            Scope 1 temeli oturdukça burada süreç ekranları, mutabakat UI ve faturalama akışı eklenecek.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Referans: <code>docs/fox-strategic-initiative.md</code> — Scope 2 bölümü.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
