// Sidebar navigasyon verisi ve preview context
// Tüm sidebar varyantları bu modülü kullanır
// Preview modunda link'ler otomatik prefix'lenir

import { createContext, useContext } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Home,
  Settings,
  ShoppingCart,
  Package,
  Users,
  BarChart3,
  Receipt,
  FileText,
  Table,
  LineChart,
  Grid3x3,
  PanelLeft,
  BookOpen,
  CircleHelp,
} from "lucide-react";

// ─── Tipler ──────────────────────────────────
export type NavItem = { title: string; href: string; icon: LucideIcon };
export type NavSection = { title: string; icon: LucideIcon; items: NavItem[] };

// ─── BasePath Context ────────────────────────
// Normal modda "" (boş), preview modda "/preview/sidebar/:variant"
const BasePathContext = createContext("");
export const BasePathProvider = BasePathContext.Provider;
export function useBasePath() {
  return useContext(BasePathContext);
}

// ─── Link prefix ─────────────────────────────
function prefix(href: string, basePath: string): string {
  if (href === "#") return "#";
  if (href === "/") return basePath || "/";
  return basePath ? `${basePath}${href}` : href;
}

// ─── Navigasyon verisi ───────────────────────
export function getNavSections(basePath: string): NavSection[] {
  const exampleItems: NavItem[] = [
    { title: "Form Örneği", href: prefix("/examples/form", basePath), icon: FileText },
    { title: "Tablo Örneği", href: prefix("/examples/table", basePath), icon: Table },
    { title: "Grafik Örneği", href: prefix("/examples/chart", basePath), icon: LineChart },
    { title: "DataGrid Örneği", href: prefix("/examples/datagrid", basePath), icon: Grid3x3 },
  ];

  // Sidebar Örnekleri sadece normal modda görünür (preview'da geri butonu var)
  if (!basePath) {
    exampleItems.push({
      title: "Sidebar Örnekleri",
      href: "/examples/sidebar",
      icon: PanelLeft,
    });
  }

  return [
    {
      title: "Genel",
      icon: Home,
      items: [
        { title: "Ana Sayfa", href: prefix("/", basePath), icon: Home },
        { title: "Ayarlar", href: "#", icon: Settings },
      ],
    },
    {
      title: "Uygulamalar",
      icon: ShoppingCart,
      items: [
        { title: "Sipariş Yönetimi", href: "#", icon: ShoppingCart },
        { title: "Stok Takibi", href: "#", icon: Package },
        { title: "Müşteri Listesi", href: "#", icon: Users },
        { title: "Raporlar", href: "#", icon: BarChart3 },
        { title: "Fatura Kesimi", href: "#", icon: Receipt },
      ],
    },
    {
      title: "Örnekler",
      icon: FileText,
      items: exampleItems,
    },
    {
      title: "Destek",
      icon: BookOpen,
      items: [
        { title: "Dokümantasyon", href: "#", icon: BookOpen },
        { title: "SSS", href: "#", icon: CircleHelp },
      ],
    },
  ];
}
