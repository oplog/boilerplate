// Yevmiye (Journal / Günlük kayıtlar)

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { FileText } from "lucide-react";

export function YevmiyePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Yevmiye"
        description="Yevmiye fişleri ve günlük kayıtlar."
      />
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Yevmiye
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Bu sayfa geliştirme aşamasındadır. Yevmiye kayıtları burada listelenecek.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
