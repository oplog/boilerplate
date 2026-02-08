// Sidebar varyantları örnek sayfası
// 5 farklı sidebar pattern'ini kartlar halinde gösterir
// Her biri tam ekran önizleme sayfasına yönlendirir

import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";

const variants = [
  {
    id: "default",
    title: "Icon Collapsible",
    pattern: "sidebar-07",
    description:
      "Icon modunda daraltılabilir sidebar. Varsayılan layout'ta kullanılan pattern. Sidebar daraltıldığında sadece ikonlar görünür, tooltip ile menü adları okunur.",
    features: ["Icon modu", "Tooltip desteği", "Grup etiketleri", "Rail collapse"],
  },
  {
    id: "double",
    title: "Double Sidebar",
    pattern: "sidebar-09",
    description:
      "İç içe çift sidebar: sol tarafta dar ikon rail, sağ tarafta geniş içerik paneli. İkon rail'den seçim yapınca sağ panel güncellenir. Daraltıldığında sadece ikon rail kalır.",
    features: ["İkon rail", "İçerik paneli", "Dinamik güncelleme", "Arama"],
  },
  {
    id: "submenu",
    title: "Submenu",
    pattern: "sidebar-03",
    description:
      "Her zaman açık alt menüler ile dokümantasyon stili sidebar. Tüm navigasyon öğeleri sürekli görünür, hiyerarşi girintilerle sağlanır.",
    features: ["Sabit alt menüler", "Düz hiyerarşi", "Arama", "Bölüm ikonları"],
  },
  {
    id: "collapsible",
    title: "Collapsible",
    pattern: "sidebar-05",
    description:
      "Açılır/kapanır bölümler ile gelişmiş sidebar. Chevron ikonu ile bölüm açılıp kapatılır, arama kutusu ile filtreleme yapılabilir.",
    features: ["Chevron toggle", "Arama kutusu", "Açılır bölümler", "Bölüm ikonları"],
  },
  {
    id: "dropdown",
    title: "Dropdown",
    pattern: "sidebar-06",
    description:
      "Alt menüler dropdown olarak açılır. Her bölüm tıklandığında yan tarafta açılan menü ile navigasyon sağlar. Mobil cihazlarda otomatik konumlanır.",
    features: ["Dropdown menüler", "Öğe ikonları", "Mobil uyumlu", "Arama"],
  },
];

export function SidebarExamplePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Sidebar Örnekleri"
        description="shadcn/ui sidebar block'larından 5 farklı varyant. Her birini tam ekran önizleyin ve projenize uygun olanı seçin."
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {variants.map((v) => (
          <Card key={v.id} className="flex flex-col">
            <CardHeader>
              <div className="flex items-center gap-2">
                <CardTitle className="text-base">{v.title}</CardTitle>
                <Badge variant="secondary">{v.pattern}</Badge>
              </div>
              <CardDescription className="mt-1.5 leading-relaxed">
                {v.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="mt-auto space-y-3">
              <div className="flex flex-wrap gap-1.5">
                {v.features.map((f) => (
                  <Badge key={f} variant="outline" className="text-xs">
                    {f}
                  </Badge>
                ))}
              </div>
              <Button className="w-full" asChild>
                <Link to={`/preview/sidebar/${v.id}`}>
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Tam Ekran Önizle
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
