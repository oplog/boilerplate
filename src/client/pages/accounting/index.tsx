// Muhasebe — Genel bakış

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { BookOpen } from "lucide-react";

export function AccountingOverviewPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Muhasebe"
        description="Hesap planı, yevmiye, mutabakat ve muhasebe süreçleri."
      />
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Genel Bakış
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Sol menüden Hesap Planı, Yevmiye veya Mutabakat sayfalarına gidebilirsiniz.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
