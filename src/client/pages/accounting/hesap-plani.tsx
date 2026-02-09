// Hesap Planı (Chart of Accounts)

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { ListTree } from "lucide-react";

export function HesapPlaniPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Hesap Planı"
        description="Birleşik hesap planı ve kaynak sistem eşlemesi."
      />
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ListTree className="h-5 w-5" />
            Hesap Planı
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Bu sayfa geliştirme aşamasındadır. GL / CoA verisi burada listelenecek.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
