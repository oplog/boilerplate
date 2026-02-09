// Finansal Tablolar — Genel bakış

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { BarChart3 } from "lucide-react";

export function FinancialStatementsOverviewPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Finansal Tablolar"
        description="Gelir tablosu (P&L), bilanço ve nakit akışı."
      />
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Genel Bakış
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Sol menüden Gelir Tablosu (P&L), Bilanço veya Nakit Akışı sayfalarına gidebilirsiniz.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
