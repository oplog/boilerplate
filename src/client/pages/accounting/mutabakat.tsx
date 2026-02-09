// Mutabakat (Reconciliation)

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { Scale } from "lucide-react";

export function MutabakatPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Mutabakat"
        description="Banka, GL ve şirketler arası mutabakat."
      />
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scale className="h-5 w-5" />
            Mutabakat
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Bu sayfa geliştirme aşamasındadır. Mutabakat listesi ve eşleştirme burada olacak.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
