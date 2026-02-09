// Sidebar önizleme layout — her varyantı tam ekran çalışır halde gösterir
// RootLayout dışında render edilir (SidebarProvider çakışması önlenir)
// Child route'lar ile Form, Tablo, Grafik, DataGrid örnekleri çalışır

import { useParams, Link, Outlet } from "react-router-dom";
import { ArrowLeft, Moon, Sun } from "lucide-react";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { BasePathProvider } from "@/lib/sidebar-nav";
import { useTheme } from "@/components/theme-provider";
import { SidebarDefault } from "@/components/sidebars/sidebar-default";
import { SidebarSubmenu } from "@/components/sidebars/sidebar-submenu";
import { SidebarCollapsible } from "@/components/sidebars/sidebar-collapsible";
import { SidebarDropdown } from "@/components/sidebars/sidebar-dropdown";
import { SidebarDouble } from "@/components/sidebars/sidebar-double";

const variantTitles: Record<string, string> = {
  default: "Icon Collapsible",
  double: "Double Sidebar",
  submenu: "Submenu",
  collapsible: "Collapsible",
  dropdown: "Dropdown",
};

// Collapse destekleyen varyantlar (SidebarTrigger göster)
const collapsibleVariants = new Set(["default", "double"]);

function SidebarByVariant({ variant }: { variant: string }) {
  switch (variant) {
    case "default":
      return <SidebarDefault />;
    case "double":
      return <SidebarDouble />;
    case "submenu":
      return <SidebarSubmenu />;
    case "collapsible":
      return <SidebarCollapsible />;
    case "dropdown":
      return <SidebarDropdown />;
    default:
      return null;
  }
}

export function SidebarPreviewPage() {
  const { variant = "default" } = useParams<{ variant: string }>();
  const title = variantTitles[variant] ?? "Sidebar";
  const isDouble = variant === "double";
  const hasCollapse = collapsibleVariants.has(variant);
  const basePath = `/preview/sidebar/${variant}`;

  const { theme, setTheme } = useTheme();
  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  return (
    <BasePathProvider value={basePath}>
      <SidebarProvider
        defaultOpen={true}
        style={isDouble ? ({ "--sidebar-width": "350px" } as React.CSSProperties) : undefined}
      >
        <SidebarByVariant variant={variant} />
        <SidebarInset>
          {/* ─── Header ──────────────────────────── */}
          <header className="flex h-16 shrink-0 items-center justify-between border-b px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2">
              {hasCollapse && <SidebarTrigger className="-ml-1" />}
              {hasCollapse && (
                <Separator orientation="vertical" className="mr-2 h-4" />
              )}
              <Button variant="ghost" size="sm" asChild>
                <Link to="/examples/sidebar">
                  <ArrowLeft className="mr-1 h-4 w-4" />
                  Örneklere Dön
                </Link>
              </Button>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <span className="text-sm font-medium text-muted-foreground">
                {title}
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(isDark ? "light" : "dark")}
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              <span className="sr-only">Tema değiştir</span>
            </Button>
          </header>

          {/* ─── İçerik ──────────────────────────── */}
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            <Outlet />
          </main>
        </SidebarInset>
      </SidebarProvider>
    </BasePathProvider>
  );
}
