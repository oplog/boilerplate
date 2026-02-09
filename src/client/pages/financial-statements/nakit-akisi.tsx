// Nakit Akışı (Cash Flow)

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { Wallet } from "lucide-react";

export function NakitAkisiPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Nakit Akışı"
        description="İşletme, yatırım ve finansman faaliyetleri."
      />
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Nakit Akışı
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Bu sayfa geliştirme aşamasındadır. Nakit akış tablosu burada gösterilecek.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
